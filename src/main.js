import { Minesweeper } from './minesweeper';

const SELECTORS = {
  SMILEY_BUTTON: '.js-smiley-button',
  BOARD: '.js-board'
};
const STATE_CLASSES = {
  FLAGGED: 'flagged',
  REVEALED: 'revealed',
  CELL: 'cell',
  MINE: 'mine',
  NUMBER: 'number'
};
const EMOJI = {
  FLAG: '🚩',
  BOMB: '💣',
  SMILE: '🙂',
  SKULL: '💀'
};

const getCellPosition = (cellElement) => ({
  row: +cellElement.dataset.row,
  column: +cellElement.dataset.column
});

const minesweeper = new Minesweeper();

const smileyButtonElement = document.querySelector(SELECTORS.SMILEY_BUTTON);
smileyButtonElement.textContent = EMOJI.SMILE;
const boardElement = document.querySelector(SELECTORS.BOARD);
let cellElements = [];

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

const resetGame = (settings) => {
  minesweeper.reset(settings || {});
  boardElement.style.pointerEvents = '';
  boardElement.style.setProperty('--board-rows', minesweeper.rows);
  boardElement.style.setProperty('--board-columns', minesweeper.columns);
  drawBoard();
};

resetGame();

boardElement.addEventListener('click', ({ target }) => {
  if (!target.classList.contains(STATE_CLASSES.CELL)) {
    return;
  }
  const { row, column } = getCellPosition(target);
  const { cellsToUpdate } = minesweeper.reveal(row, column);
  cellsToUpdate.forEach(({ row: currentRow, column: currentColumn, mine }) => {
    const cellElement = cellElements[currentRow][currentColumn];
    cellElement.classList.add(STATE_CLASSES.REVEALED);
    if (mine) {
      if (currentRow === row && currentColumn === column) {
        cellElement.classList.add(STATE_CLASSES.MINE);
      }
      cellElement.textContent = EMOJI.BOMB;
    }
  });
  if (minesweeper.gameOver) {
    smileyButtonElement.textContent = EMOJI.SKULL;
    boardElement.style.pointerEvents = 'none';
  }
});
