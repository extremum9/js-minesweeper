import { LEVELS, Minesweeper } from './minesweeper';
import { getCellPosition, padNumberWithZeros } from './utilities';

const SELECTORS = {
  LEVELS: '.js-levels',
  MINE_COUNT: '.js-mine-count',
  SMILEY_BUTTON: '.js-smiley-button',
  TIMER: '.js-timer',
  BOARD: '.js-board'
};
const STATE_CLASSES = {
  REVEALED: 'revealed',
  CELL: 'cell',
  MINE: 'mine',
  INCORRECT_FLAG: 'incorrect-flag',
  NUMBER: 'number'
};
const EMOJI = {
  FLAG: '🚩',
  BOMB: '💣',
  SMILE: '🙂',
  COOL_FACE: '😎',
  SKULL: '💀'
};

const MAX_DISPLAY_TIME = 999;

const minesweeper = new Minesweeper();
let seconds = 0;
let timerId = null;

const levelsElement = document.querySelector(SELECTORS.LEVELS);
const mineCountElement = document.querySelector(SELECTORS.MINE_COUNT);
mineCountElement.textContent = padNumberWithZeros(minesweeper.mineCount);
const smileyButtonElement = document.querySelector(SELECTORS.SMILEY_BUTTON);
smileyButtonElement.textContent = EMOJI.SMILE;
const timerElement = document.querySelector(SELECTORS.TIMER);
const boardElement = document.querySelector(SELECTORS.BOARD);
let cellElements = [];

const startTimer = () => {
  if (timerId) {
    return;
  }
  timerId = setInterval(() => {
    seconds++;
    if (seconds <= MAX_DISPLAY_TIME) {
      timerElement.textContent = padNumberWithZeros(seconds);
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerId);
  timerId = null;
};

const resetTimer = () => {
  stopTimer();
  seconds = 0;
  timerElement.textContent = padNumberWithZeros(seconds);
};

const drawBoard = () => {
  boardElement.replaceChildren();
  cellElements = Array.from({ length: minesweeper.rows }, () => Array(minesweeper.columns));
  const fragment = new DocumentFragment();
  for (let row = 0; row < minesweeper.rows; row++) {
    for (let column = 0; column < minesweeper.columns; column++) {
      const cellElement = document.createElement('div');
      cellElement.className = STATE_CLASSES.CELL;
      cellElement.dataset.row = `${row}`;
      cellElement.dataset.column = `${column}`;
      cellElements[row][column] = cellElement;
      fragment.append(cellElement);
    }
  }
  boardElement.append(fragment);
};

const resetGame = (settings = {}) => {
  minesweeper.reset(settings);
  mineCountElement.textContent = padNumberWithZeros(minesweeper.mineCount);
  smileyButtonElement.textContent = EMOJI.SMILE;
  boardElement.style.pointerEvents = '';
  boardElement.style.setProperty('--board-rows', minesweeper.rows);
  boardElement.style.setProperty('--board-columns', minesweeper.columns);
  resetTimer();
  drawBoard();
};

resetGame();

levelsElement.addEventListener('click', (event) => {
  const level = event.target.dataset.level;
  if (level) {
    resetGame(LEVELS[level]);
  }
});

smileyButtonElement.addEventListener('click', () => resetGame());

boardElement.addEventListener('click', (event) => {
  if (minesweeper.gameOver) {
    return;
  }

  const target = event.target;
  if (!target.classList.contains(STATE_CLASSES.CELL)) {
    return;
  }

  startTimer();

  const { row, column } = getCellPosition(target);
  const { cellsToUpdate } = minesweeper.reveal(row, column);
  if (!cellsToUpdate.length) {
    return;
  }

  cellsToUpdate.forEach(
    ({ row: currentRow, column: currentColumn, mine, flagged, adjacentMines }) => {
      const cellElement = cellElements[currentRow][currentColumn];
      if (flagged) {
        return cellElement.classList.add(STATE_CLASSES.INCORRECT_FLAG);
      }

      cellElement.classList.add(STATE_CLASSES.REVEALED);
      if (mine) {
        if (currentRow === row && currentColumn === column) {
          cellElement.classList.add(STATE_CLASSES.MINE);
        }
        cellElement.textContent = EMOJI.BOMB;
      } else if (adjacentMines > 0) {
        cellElement.classList.add(`${STATE_CLASSES.NUMBER}-${adjacentMines}`);
        cellElement.textContent = `${adjacentMines}`;
      }
    }
  );

  if (minesweeper.gameOver) {
    stopTimer();
    smileyButtonElement.textContent = minesweeper.gameWon ? EMOJI.COOL_FACE : EMOJI.SKULL;
    boardElement.style.pointerEvents = 'none';
  }
});

boardElement.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  if (minesweeper.gameOver) {
    return;
  }

  const target = event.target;
  if (
    !target.classList.contains(STATE_CLASSES.CELL) ||
    target.classList.contains(STATE_CLASSES.REVEALED)
  ) {
    return;
  }

  const { row, column } = getCellPosition(target);
  const flagged = minesweeper.toggleFlag(row, column);
  target.textContent = flagged ? EMOJI.FLAG : '';
  mineCountElement.textContent = padNumberWithZeros(minesweeper.mineCount);
});
