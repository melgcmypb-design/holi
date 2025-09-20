const EMOJIS = ['😀', '🤣', '😂', '😉', '😊', '🥰']
const CARDS = [...EMOJIS, ...EMOJIS];

const gameBoard = document.getElementById ('game-board');
const movesElement = document.getElementById ('moves');
const timerElement = document.getElementById ('timer');
const scoreElement = document.getElementById ('score');
const startStopBtn = document.getElementById ('start-stop-btn');
const gameInfo = document.getElementById ('game-info');

let gameState = {
    flippedCards: [],
    moves: 0,
    score: 0,
    timer: 0,
    intervalid: null,
    isGameRunning: false,
}


const shuffleArray = (Arr) => {
    for (let i = Arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [Arr[i], Arr[j]] = [Arr[j], Arr[i]];
    }
}


const createCard = (emoji) => {
    const card = document.createElement ('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.addEventListener('click', ()=> flipCard(card))
    return card;
}

const flipCard = (card) => {
    if(!gameState.isGameRunning || gameState.flippedCards.length >= 2 || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    gameState.flippedCards.push(card);

    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateMovesDisplay();
        setTimeout(checkMatch, 500);
    }
}


const checkMatch = () => {
    const [card1, card2] = gameState.flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // gameState.score = gameState.score + 10;
        gameState.score += 10;
        updateScoreDisplay();
        if(document.querySelectorAll('.flipped').length === CARDS.length) {
            endGame();
        }
    } else {
        [card1, card2].forEach((card) => {
            card.classList.remove('flipped');
            card.textContent = '';
        })
    }
    gameState.flippedCards = [];
}


const updateMovesDisplay = () => movesElement.textContent = `Movimientos: ${gameState.moves}`;
const updateScoreDisplay = () => scoreElement.textContent = `Puntuacion: ${gameState.score}`;
const updateTimerDisplay = () => timerElement.textContent = `Tiempo: ${gameState.timer}`;

const startTimer = () => {
    gameState.intervalid = setInterval(() => {
        gameState.timer++;
        updateTimerDisplay();
    }, 1000);
}


const StartGame = () => {
    gameState = { ...gameState, flippedCards: [], score: 0, moves: 0, timer: 0, isGameRunning: true };
    shuffleArray(CARDS);
    gameBoard.innerHTML = '';
    CARDS.forEach((emoji)=> gameBoard.appendChild(createCard(emoji)));
    updateMovesDisplay();
    updateScoreDisplay();
    updateTimerDisplay();
    startTimer();

    startStopBtn.textContent = 'Detener juego';
    gameInfo.classList.remove('hidden');

    gameBoard.classList.remove('hidden', 'fade-Out');

}


const stopGame = () => {
    gameState.isGameRunning = false;
    clearInterval(gameState.intervalid);
    startStopBtn.textContent = 'iniciar juego';

    gameInfo.classList.add('hidden');
    gameBoard.classList.add('fade-Out');
    setTimeout(() => gameBoard.classList.add('hidden'), 500);
}


const endGame = () => {
    clearInterval(gameState.intervalid);
    const finalScore = gameState.score + Math.max(0, 1000 - gameState.timer * 10 - gameState.moves * 5);
    alert(`!Juego terminado! Puntuacion final: ${finalScore}`);
    stopGame();
}


const startStopGame = () => gameState.isGameRunning ? stopGame() : StartGame();


startStopBtn.addEventListener('click', startStopGame);