const cardTypes = [
    'diamond',
    'anchor',
    'cube',
    'leaf',
    'bomb',
    'bolt',
    'bicycle',
    'paper-plane'
];

cards = []; // Set of all cards
lockedCards = []; // The opened/locked matching set of cards
activeCard = null; // The currently flipped/active card

// Generate a pair for each card type to put in our cards list
for(let i = 0; i < cardTypes.length; ++i){
  cards.push(cardTypes[i]);
  cards.push(cardTypes[i]);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Generates a new deck and renders it to the deck's DOM
function generateDeck() {
    const deck = document.getElementsByClassName('deck')[0];

    // Clear out cards in deck in DOM
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }

    // Shuffle cards
    const shuffledCards = shuffle(cards);

    // Add shuffled cards to DOM
    for (let card of shuffledCards){

        // Create card DOM elements
        cardElement = document.createElement('li');
        cardElement.classList.add('card');
        cardIconElement = document.createElement('i');
        cardIconElement.classList.add('fa', 'fa-' + card);

        // Connect up card elements and attach click handler
        cardElement.appendChild(cardIconElement);
        cardElement.addEventListener('click', cardClickHandler);

        // Add card to deck's DOM
        deck.appendChild(cardElement);
    }
}

// Resets the game state
function initializeGame() {
    lockedCards = [];
    activeCard = null;

    generateDeck();
    setMovesTo(0);
    setStarsTo(3);

    restartTimer();
    stopTimer();
}

// Identify restart button and attach the initializeGame function to it
restartButton = document.getElementsByClassName('restart')[0];
restartButton.addEventListener('click', initializeGame);

function cardClickHandler(event) {
    let cardElement = event.target;

    startTimer();

    // Sometimes the target was the inner 'i' element (icon), so lets jump up
    // to the parent node (the card)
    if (!cardElement.classList.contains('card')) {
        cardElement = cardElement.parentNode;
    }

    // Prevent issues when clicking the active card again
    if (cardElement === activeCard) { return; }

    showCard(cardElement);

    if (activeCard) {
        if (isMatchingCard(cardElement)) {
            cardsMatching(cardElement);
        } else {
            cardsNotMatching(cardElement);
        }

        setMovesTo(getMoves() + 1);
        evaluateStars();

        if (isGameWon()) { showWonModal(); };

        activeCard = null;
    } else {
        activeCard = cardElement;
    }
}


/* -- Timer Functionality Start -- */
// Holds our timer interval increaser
let timerIncrement = null

// Starts the timer only if its not running
function startTimer() {
    if (timerIncrement) { return; }

    timerIncrement = window.setInterval(increaseTimer, 1000);
}

// Stop the timer from increasing (clear out the interval)
function stopTimer() {
    window.clearInterval(timerIncrement);
    timerIncrement = null;
}

// Restart the timer -- back to 0
function restartTimer() {
    timerCounter = document.getElementsByClassName('timer')[0];
    timerCounter.innerHTML = String(0);
}

// Get the timer's value
function getTime() {
    if (!timerIncrement) { return 0; }

    timerCounter = document.getElementsByClassName('timer')[0];
    return Number(timerCounter.innerHTML);
}

// Increase the timer's rendered text by one
function increaseTimer() {
    if (!timerIncrement) { return; }

    timerCounter = document.getElementsByClassName('timer')[0];
    timerCounter.innerHTML = String(getTime() + 1);
}
/* -- Timer Functionality End -- */


/* -- Moves Functionality Start -- */
// Get the number of moves made from the rendered DOM
function getMoves() {
    movesCounter = document.getElementsByClassName('moves')[0];
    return Number(movesCounter.innerHTML);
}

// Sets the number of moves to the rendered DOM
function setMovesTo(number) {
    movesCounter = document.getElementsByClassName('moves')[0];
    movesCounter.innerHTML = String(number);
}
/* -- Moves Functionality End -- */


/* -- Stars Functionality Start -- */
// Get the number of stars that are present on the DOM -- for points
function getStars() {
    const stars = document.getElementsByClassName('stars')[0];
    return stars.getElementsByClassName('fa-star').length;
}

// Sets the number of stars to the specified value, this is out of 3 and thus
// the rest of the stars are left as outlines
function setStarsTo(number) {
    const stars = document.getElementsByClassName('stars')[0];
    for(let i = 0; i < 3; i++){
        if (i < number) {
            stars.children[i].firstElementChild.className = 'fa fa-star';
        } else {
            stars.children[i].firstElementChild.className = 'fa fa-star-o';
        }
    }
}
/* -- Stars Functionality End -- */


/* -- Cards Functionality Start -- */
// If the selected and active cards match, we need to lock them and make them
// known as matches
function cardsMatching(cardElement) {
    lockedCards.push(cardElement);
    lockedCards.push(activeCard);
    cardElement.classList.add('match');
    activeCard.classList.add('match');
}

// If the cards are not matching, we need to hide both cards -- a timeout is
// used so that the animation can play out and shows the selected card
function cardsNotMatching(cardElement) {
    window.setTimeout(hideCard.bind(this, cardElement), 500);
    window.setTimeout(hideCard.bind(this, activeCard), 500);
}

// A check to see if the selected card matches the active card
function isMatchingCard(cardElement) {
    return activeCard.firstChild.className === cardElement.firstChild.className;
}

// Shows a card from a CSS perspective
function showCard(cardElement) {
    cardElement.classList.add('open');
    cardElement.classList.add('show');
}

// Hides a card from a CSS perspective
function hideCard(cardElement) {
    cardElement.classList.remove('open');
    cardElement.classList.remove('show');
}
/* -- Cards Functionality End -- */


/* -- Points and Win Condition Functionality Start -- */
// Check the number of moves made, and adjust the points
function evaluateStars() {
    const currentMoves = getMoves();

    if (currentMoves > 15) {
        setStarsTo(1);
    } else if (currentMoves > 10) {
        setStarsTo(2);
    } else {
        setStarsTo(3);
    }
}

// Check if the game has been won -- look if the number of locked cards matches
// the number of total cards in play
function isGameWon() {
    return lockedCards.length === cards.length;
}
/* -- Points and Win Condition Functionality End -- */


/* -- Modal Functionality Start -- */
// Show the won modal and populate the dynamic values
function showWonModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const movesScore = document.getElementById('moves-score');
    const starsScore = document.getElementById('stars-score');
    const timeScore = document.getElementById('time-score');

    movesScore.innerText = getMoves();
    starsScore.innerText = getStars();
    timeScore.innerText = getTime();

    stopTimer();
}

// Connect the play again button with a click handler than re-initializes the
// game and closes the modal
const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    initializeGame();
});
/* -- Modal Functionality End -- */

// Ready and start the game
initializeGame();
