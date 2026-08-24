export const getCellPosition = (cellElement) => ({
  row: +cellElement.dataset.row,
  column: +cellElement.dataset.column
});

export const getBackgroundImageUrl = (filename) => `url("/images/${filename}")`;

export const padNumberWithZeros = (value, length = 3) => `${value}`.padStart(length, '0');
