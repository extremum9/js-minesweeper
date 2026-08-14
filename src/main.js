import { Minesweeper } from './minesweeper';

const SELECTORS = {
  BOARD: '.js-board'
};

const STATE_CLASSES = {
  FLAGGED: 'flagged',
  REVEALED: 'revealed',
  MINE: 'mine',
  NUMBER: 'number'
};
const EMOJI = {
  FLAG: '🚩',
  BOMB: '💣'
};

const minesweeper = new Minesweeper();

const getCellPosition = (cellElement) => ({
  row: +cellElement.dataset.row,
  column: +cellElement.dataset.column
});

const boardElement = document.querySelector(SELECTORS.BOARD);

let cellElements = [];

const drawBoard = () => {
  boardElement.replaceChildren();
  cellElements = Array.from({ length: minesweeper.rows }, () => Array(minesweeper.columns));
  const fragment = new DocumentFragment();
  for (let row = 0; row < minesweeper.rows; row++) {
    for (let column = 0; column < minesweeper.columns; column++) {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.dataset.row = `${row}`;
      cellElement.dataset.column = `${column}`;
      cellElements[row][column] = cellElement;
      fragment.append(cellElement);
    }
  }
  boardElement.append(fragment);
};

const resetGame = (settings) => {
  minesweeper.reset(settings || {});
  boardElement.style.setProperty('--board-rows', minesweeper.rows);
  boardElement.style.setProperty('--board-columns', minesweeper.columns);
  drawBoard();
};

resetGame();

boardElement.addEventListener('click', ({ target }) => {
  const { row, column } = getCellPosition(target);
  minesweeper.reveal(row, column);
});
