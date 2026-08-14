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
    this.board = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({
        mine: false,
        flagged: false,
        revealed: false,
        adjacentMines: 0
      }))
    );
  }

  reveal(clickedCellPosition) {
    if (this.firstClick) {
      this.#placeMines(clickedCellPosition);
      this.firstClick = false;
    }
    const cell = this.board[clickedCellPosition.row][clickedCellPosition.column];
    cell.adjacentMines = this.#calculateAdjacentMines(clickedCellPosition);
  }

  #placeMines(clickedCellPosition) {
    let placed = 0;
    while (placed < this.totalMines) {
      const randomCellPosition = {
        row: Math.floor(Math.random() * this.rows),
        column: Math.floor(Math.random() * this.columns)
      };

      if (
        this.#cellMath(clickedCellPosition, randomCellPosition) ||
        this.#hasMine(randomCellPosition.row, randomCellPosition.column)
      ) {
        continue;
      }

      this.board[randomCellPosition.row][randomCellPosition.column].mine = true;
      placed++;
    }
  }

  #calculateAdjacentMines({ row, column }) {
    let adjacentMines = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        const cell = this.board[row + rowOffset]?.[column + columnOffset];
        if (cell?.mine) {
          adjacentMines++;
        }
      }
    }
    return adjacentMines;
  }

  #hasMine(row, column) {
    return this.board[row][column].mine;
  }

  #cellMath(cellPositionA, cellPositionB) {
    return cellPositionA.row === cellPositionB.row && cellPositionA.column === cellPositionB.column;
  }
}
