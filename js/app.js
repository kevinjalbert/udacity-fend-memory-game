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

cards = [];
for(var i = 0; i < cardTypes.length; ++i){
  cards.push(cardTypes[i]);
  cards.push(cardTypes[i]);
}

const deck = document.getElementsByClassName('deck')[0];

function generateDeck() {
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
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
