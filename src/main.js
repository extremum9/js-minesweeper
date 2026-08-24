import { LEVELS, Minesweeper } from './minesweeper';
import { getBackgroundImageUrl, getCellPosition, padNumberWithZeros } from './utilities';

const SELECTORS = {
  LEVELS: '.js-levels',
  MINE_COUNTER: '.js-mine-counter',
  RESET_BUTTON: '.js-reset-button',
  TIMER: '.js-timer',
  BOARD: '.js-board'
};
const STATE_CLASSES = {
  ACTIVE: 'active',
  REVEALED: 'revealed',
  CELL: 'cell',
  MINE: 'mine',
  NUMBER: 'number'
};
const IMAGE_FILENAMES = {
  SMILEY_FACE: 'smiley-face.png',
  COOL_FACE: 'cool-face.png',
  DEAD_FACE: 'dead-face.png',
  FLAG: 'flag.png',
  MINE: 'mine.png',
  WRONG_MINE: 'wrong-mine.png'
};

const MAX_DISPLAY_TIME = 999;

const minesweeper = new Minesweeper();
let seconds = 0;
let timerId = null;

const levelsElement = document.querySelector(SELECTORS.LEVELS);
levelsElement.children[0].classList.add(STATE_CLASSES.ACTIVE);
const mineCounterElement = document.querySelector(SELECTORS.MINE_COUNTER);
const resetButtonElement = document.querySelector(SELECTORS.RESET_BUTTON);
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
  mineCounterElement.textContent = padNumberWithZeros(minesweeper.mineCount);
  resetButtonElement.style.backgroundImage = getBackgroundImageUrl(IMAGE_FILENAMES.SMILEY_FACE);
  boardElement.style.pointerEvents = '';
  boardElement.style.setProperty('--board-rows', minesweeper.rows);
  boardElement.style.setProperty('--board-columns', minesweeper.columns);
  resetTimer();
  drawBoard();
};

resetGame();

levelsElement.addEventListener('click', (event) => {
  const target = event.target;
  const level = target.dataset.level;
  if (level) {
    levelsElement.querySelector(`.${STATE_CLASSES.ACTIVE}`)?.classList.remove(STATE_CLASSES.ACTIVE);
    target.classList.add(STATE_CLASSES.ACTIVE);
    resetGame(LEVELS[level]);
  }
});

resetButtonElement.addEventListener('click', () => resetGame());

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
        return (cellElement.style.backgroundImage = getBackgroundImageUrl(
          IMAGE_FILENAMES.WRONG_MINE
        ));
      }

      cellElement.classList.add(STATE_CLASSES.REVEALED);
      if (mine) {
        if (currentRow === row && currentColumn === column) {
          cellElement.classList.add(STATE_CLASSES.MINE);
        }
        cellElement.style.backgroundImage = getBackgroundImageUrl(IMAGE_FILENAMES.MINE);
      } else if (adjacentMines > 0) {
        cellElement.classList.add(`${STATE_CLASSES.NUMBER}-${adjacentMines}`);
        cellElement.textContent = `${adjacentMines}`;
      }
    }
  );

  if (minesweeper.gameOver) {
    stopTimer();
    resetButtonElement.style.backgroundImage = getBackgroundImageUrl(
      minesweeper.gameWon ? IMAGE_FILENAMES.COOL_FACE : IMAGE_FILENAMES.DEAD_FACE
    );
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
  target.style.backgroundImage = flagged ? getBackgroundImageUrl(IMAGE_FILENAMES.FLAG) : '';
  mineCounterElement.textContent = padNumberWithZeros(minesweeper.mineCount);
});
