
let cards = []
let dealerCards = []
let sum = 0
let dealerSum = 0
let hasBlackJack = false
let isAlive = false
let isStanding = false
let roundOver = false
let lastRoundResult = ""
let message = ""

const player = {
    name: "",
    chips: 10
}

const messageEl = document.getElementById("message-el")
const sumEl = document.getElementById("sum-el")
const cardsEl = document.getElementById("cards-el")
const dealerEl = document.getElementById("dealer-el")
const dealerSumEl = document.getElementById("dealer-sum-el")
const playerEl = document.getElementById("player-el")
const startBtn = document.getElementById("start-btn")

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1

    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    }

    return randomNumber
}

function renderPlayer() {
    if (player.name !== "") {
        playerEl.textContent = player.name + ": $" + player.chips
    } else {
        playerEl.textContent = "$" + player.chips
    }
}

function renderStartButton() {
    if (roundOver === true) {
        startBtn.textContent = lastRoundResult === "win" ? "CONTINUE GAME" : "NEW GAME"
        return
    }

    startBtn.textContent = "START GAME"
}

function renderCards() {
    cardsEl.textContent = "Cards: "

    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
}

function renderDealer() {
    if (dealerCards.length === 0) {
        dealerEl.textContent = "Dealer: "
        dealerSumEl.textContent = "Dealer Sum:"
        return
    }

    if (isStanding === true || roundOver === true || hasBlackJack === true) {
        dealerEl.textContent = "Dealer: "

        for (let i = 0; i < dealerCards.length; i++) {
            dealerEl.textContent += dealerCards[i] + " "
        }

        dealerSumEl.textContent = "Dealer Sum: " + dealerSum
        return
    }

    dealerEl.textContent = "Dealer: " + dealerCards[0] + " [Hidden]"
    dealerSumEl.textContent = "Dealer Sum: ?"
}

function renderBoard() {
    renderCards()
    renderDealer()
    sumEl.textContent = "Sum: " + sum
    messageEl.textContent = message
    renderPlayer()
    renderStartButton()
}

function finishRound(result, endMessage, chipDelta) {
    roundOver = true
    isAlive = false
    lastRoundResult = result
    message = endMessage
    player.chips += chipDelta

    renderBoard()
}

function startGame() {
    cards = [getRandomCard(), getRandomCard()]
    dealerCards = [getRandomCard(), getRandomCard()]
    sum = cards[0] + cards[1]
    dealerSum = dealerCards[0] + dealerCards[1]

    hasBlackJack = false
    isAlive = true
    isStanding = false
    roundOver = false
    lastRoundResult = ""
    message = "Do you want to draw a new card or stand?"

    renderBoard()
    renderGame()
}

function renderGame() {
    renderBoard()

    if (roundOver === true) {
        return
    }

    if (sum < 21) {
        message = "Do you want to draw a new card or stand?"
        messageEl.textContent = message
        return
    }

    if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
        isStanding = true
        messageEl.textContent = message
        renderDealer()
        dealerPlay()
        return
    }

    finishRound("loss", "You're out of the game!", -10)
}

function newCard() {
    if (isAlive === true && hasBlackJack === false && isStanding === false && roundOver === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
    }
}

function stand() {
    if (isAlive === true && roundOver === false) {
        isStanding = true
        message = "Dealer is playing..."
        messageEl.textContent = message
        dealerPlay()
    }
}

function dealerPlay() {
    while (dealerSum < 17) {
        let card = getRandomCard()
        dealerCards.push(card)
        dealerSum += card
    }

    renderDealer()
    compareHands()
}

function compareHands() {
    if (sum > 21) {
        finishRound("loss", "You busted. Dealer wins.", -10)
    } else if (dealerSum > 21) {
        finishRound("win", "Dealer busted. You win!", 10)
    } else if (sum > dealerSum) {
        finishRound("win", "You win!", 10)
    } else if (sum < dealerSum) {
        finishRound("loss", "Dealer wins.", -10)
    } else {
        finishRound("push", "Push. Nobody wins.", 0)
    }
}

function setPlayerName() {
    let nameInput = document.getElementById("name-el").value.trim()
    player.name = nameInput
    renderPlayer()
}

renderPlayer()
renderStartButton()
renderBoard()