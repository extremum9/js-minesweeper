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
}
