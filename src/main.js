const LEVELS = {
  BEGINNER: { rows: 9, columns: 9, mines: 10 }
};
const SELECTORS = {
  BOARD: '.js-board'
};

const boardElement = document.querySelector(SELECTORS.BOARD);
boardElement.style.setProperty('--board-rows', LEVELS.BEGINNER.rows);
boardElement.style.setProperty('--board-columns', LEVELS.BEGINNER.columns);

const createBoard = (rows, columns) => {
  const board = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row = [];
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const cell = { mine: false, flagged: false, revealed: false };
      row.push(cell);
    }
    board.push(row);
  }

  return board;
};

const board = createBoard(LEVELS.BEGINNER.rows, LEVELS.BEGINNER.columns);
