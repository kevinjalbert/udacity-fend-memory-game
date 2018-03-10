/*
 * Create a list that holds all of your cards
 */

const cardTypes = [
    'diamond',
    'anchor',
    'cube',
    'leaf',
    'bomb',
    'bolt',
    'bicycle',
    'paper-plane'
]

cards = []; // Set of all cards
lockedCards = []; // The opened/locked matching set of cards
activeCard = null // The currently flipped/active card

// Generate a pair for each card type to put in our cards list
for(var i = 0; i < cardTypes.length; ++i){
  cards.push(cardTypes[i]);
  cards.push(cardTypes[i]);
}

function generateDeck() {
    const deck = document.getElementsByClassName('deck')[0];

    // Clear out cards in deck in DOM
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }

    // Shuffle cards
    const shuffledCards = shuffle(cards)

    // Add shuffled cards to DOM
    for (var card of shuffledCards){

        // Create card DOM elements
        cardElement = document.createElement('li');
        cardElement.classList.add('card');
        cardIconElement = document.createElement('i');
        cardIconElement.classList.add('fa', 'fa-' + card);

        // Connect up card elements and attach click handler
        cardElement.appendChild(cardIconElement);
        cardElement.addEventListener("click", cardClickHandler);

        // Add card to deck's DOM
        deck.appendChild(cardElement);
    }
}
generateDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

restartButton = document.getElementsByClassName('restart')[0]
restartButton.addEventListener("click", function() {
    generateDeck();
    // TODO: Reset move/starts
})

function cardClickHandler(event) {
    const cardElement = event.target;

    showCard(cardElement);

    if (activeCard) {
        if (isMatchingCard(cardElement)) {
            cardsMatching(cardElement)
        } else {
            cardsNotMatching(cardElement)
        }

        activeCard = null;
    } else {
        activeCard = cardElement;
    }
}


function cardsMatching(cardElement) {
    lockedCards.push(cardElement);
    cardElement.classList.add("match");
    activeCard.classList.add("match");
}

function cardsNotMatching(cardElement) {
    window.setTimeout(hideCard.bind(this, cardElement), 500);
    window.setTimeout(hideCard.bind(this, activeCard), 500);
}

function showCard(cardElement) {
    cardElement.classList.add('open');
    cardElement.classList.add('show');
}

function hideCard(cardElement) {
    cardElement.classList.remove('open');
    cardElement.classList.remove('show');
}


function isMatchingCard(cardElement) {
    return activeCard.firstChild.className === cardElement.firstChild.className
}
