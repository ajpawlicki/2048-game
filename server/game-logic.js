function initBoard(n = 4) {
  const board = [];

  for (let i = 0; i < n; i++) {
    board[i] = [];

    for (let j = 0; j < n; j++) {
      board[i][j] = null;
    }
  }

  return board;
};

const piecesPlacedLegend = {
  count: 0,
  rows: new Map(),
  cols: new Map()
};

function placeTileRandomly(board, piecesPlacedLegend, n = 4) {
  if (piecesPlacedLegend.count === (n * n)) return null;
  
  let row = null;
  let col = null;
  
  while (!isValidBoardCoord(board, row, col) || isOccupiedAtCoord(board, row, col)) {
    row = getRandomBtwnZeroAndN(n);
    col = getRandomBtwnZeroAndN(n);
  }

  board[row][col] = getTwoOrFour();

  piecesPlacedLegend.count++;
  piecesPlacedLegend.rows.set(row, true);
  piecesPlacedLegend.cols.set(col, true);
};

function isOccupiedAtCoord(board, row, col) {
  return isValidBoardCoord(board, row, col) && board[row][col] !== null;
};

function isVacantAtCoord(board, row, col) {
  return isValidBoardCoord(board, row, col) && board[row][col] === null;
};

function isValidBoardCoord (board, row, col) {
  return board[row] && (board[row][col] || board[row][col] === null);
};

function getRandomBtwnZeroAndN(n) {
  return Math.floor(Math.random() * n);
};

function getTwoOrFour() {
  return Math.random() < 0.8 ? 2 : 4;
};

function moveDown(board, piecesPlacedLegend, n = 4) {
  const { cols } = piecesPlacedLegend;

  for (let [col] of cols) {
    for (let row = n - 1; row >= 0; row--) {
      if (board[row][col] !== null) moveTileDown(board, row, col);
    }
  }
};

function moveTileDown(board, row, col) {

};

function moveRight() {

};

function checkForLoser() {

};

module.exports = {
  initBoard,
  placeTileRandomly,
  isOccupiedAtCoord,
  isVacantAtCoord,
  isValidBoardCoord,
  getRandomBtwnZeroAndN,
  getTwoOrFour,
  moveDown
};
