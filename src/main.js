import { Minesweeper } from './minesweeper';

const SELECTORS = {
  BOARD: '.js-board'
};

const minesweeper = new Minesweeper();

const boardElement = document.querySelector(SELECTORS.BOARD);

let cellElements = [];

const drawBoard = () => {
  boardElement.replaceChildren();
  cellElements = Array.from({ length: minesweeper.rows }, () => Array(minesweeper.columns));
  const fragment = new DocumentFragment();
  for (let rowIndex = 0; rowIndex < minesweeper.rows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < minesweeper.columns; columnIndex++) {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      cellElement.dataset.row = `${rowIndex}`;
      cellElement.dataset.column = `${columnIndex}`;
      cellElements[rowIndex][columnIndex] = cellElement;
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
