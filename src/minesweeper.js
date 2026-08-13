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
    this.board = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ mine: false, flagged: false, revealed: false }))
    );
  }

  placeMines(targetCell) {
    let placed = 0;
    while (placed < this.totalMines) {
      const randomCell = {
        rowIndex: Math.floor(Math.random() * this.rows),
        columnIndex: Math.floor(Math.random() * this.columns)
      };

      if (this.#cellMath(targetCell, randomCell) || this.#hasMine(randomCell)) {
        continue;
      }

      this.board[randomCell.rowIndex][randomCell.columnIndex].mine = true;
      placed++;
    }
  }

  #hasMine({ rowIndex, columnIndex }) {
    return this.board[rowIndex][columnIndex].mine;
  }

  #cellMath(cellA, cellB) {
    return cellA.rowIndex === cellB.rowIndex && cellA.columnIndex === cellB.columnIndex;
  }
}
