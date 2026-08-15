export const LEVELS = {
  BEGINNER: { rows: 9, columns: 9, mines: 10 },
  INTERMEDIATE: { rows: 16, columns: 16, mines: 40 },
  EXPERT: { rows: 16, columns: 30, mines: 99 }
};

export class Minesweeper {
  constructor(
    rows = LEVELS.BEGINNER.rows,
    columns = LEVELS.BEGINNER.columns,
    totalMines = LEVELS.BEGINNER.mines
  ) {
    this.reset({ rows, columns, totalMines });
  }

  reset({ rows = this.rows, columns = this.columns, totalMines = this.totalMines }) {
    this.rows = rows;
    this.columns = columns;
    this.totalMines = totalMines;
    this.firstClick = true;
    this.gameOver = false;
    this.board = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, column) => ({
        row,
        column,
        mine: false,
        flagged: false,
        revealed: false,
        adjacentMines: 0
      }))
    );
  }

  reveal(row, column) {
    const cell = this.board[row][column];
    if (cell.revealed || cell.flagged || this.gameOver) {
      return { cellsToUpdate: [] };
    }

    if (this.firstClick) {
      this.firstClick = false;
      this.#placeMines(row, column);
      this.#calculateAdjacentMines();
    }
    cell.revealed = true;

    if (cell.mine) {
      const mines = this.#getMines();
      this.gameOver = true;

      return { cellsToUpdate: mines };
    }

    return { cellsToUpdate: this.#floodFill(row, column) };
  }

  #floodFill(row, column) {
    const cellsToUpdate = [];
    const stack = [[row, column]];
    while (stack.length) {
      const position = stack.pop();
      const currentRow = position[0];
      const currentColumn = position[1];
      const currentCell = this.board[currentRow][currentColumn];
      cellsToUpdate.push(currentCell);

      if (currentCell.adjacentMines === 0) {
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
            const cell = this.board[currentRow + rowOffset]?.[currentColumn + columnOffset];
            if (cell && !cell.revealed && !cell.flagged) {
              cell.revealed = true;
              stack.push([cell.row, cell.column]);
            }
          }
        }
      }
    }

    return cellsToUpdate;
  }

  #placeMines(row, column) {
    let placed = 0;
    while (placed < this.totalMines) {
      const randomRow = Math.floor(Math.random() * this.rows);
      const randomColumn = Math.floor(Math.random() * this.columns);
      if (
        this.#cellMath([row, column], [randomRow, randomColumn]) ||
        this.#hasMine(randomRow, randomColumn)
      ) {
        continue;
      }
      this.board[randomRow][randomColumn].mine = true;
      placed++;
    }
  }

  #calculateAdjacentMines() {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (this.#hasMine(row, column)) {
          for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
              const cell = this.board[row + rowOffset]?.[column + columnOffset];
              if (cell && !cell.mine) {
                cell.adjacentMines++;
              }
            }
          }
        }
      }
    }
  }

  #getMines() {
    return this.board.reduce(
      (accumulator, cells) => [...accumulator, ...cells.filter((cell) => cell.mine)],
      []
    );
  }

  #hasMine(row, column) {
    return this.board[row][column].mine;
  }

  #cellMath(cellPositionA, cellPositionB) {
    return cellPositionA[0] === cellPositionB[0] && cellPositionA[1] === cellPositionB[1];
  }
}
