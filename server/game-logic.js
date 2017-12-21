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
  cols: new Map(),
  currentMove: {
    boardHasChanged: false
  }
};

function placeTileRandomly(board, piecesPlacedLegend) {
  const n = board.length;
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

function isValidBoardCoord(board, row, col) {
  return board[row] && (board[row][col] || board[row][col] === null);
};

function getRandomBtwnZeroAndN(n) {
  return Math.floor(Math.random() * n);
};

function getTwoOrFour() {
  return Math.random() < 0.8 ? 2 : 4;
};

function removeTile(board, row, col) {
  if (!isValidBoardCoord(board, row, col)) throw new Error('Not a valid coordinate.');
  
  const savedNum = board[row][col];
  board[row][col] = null;

  return savedNum;
};

function placeTile(board, row, col, num) {
  if (!isValidBoardCoord(board, row, col)) throw new Error('Not a valid coordinate.');
  board[row][col] = num;
};

function neighborTilesAreSame(board, row1, col1, row2, col2) {
  return isOccupiedAtCoord(board, row1, col1)
    && isOccupiedAtCoord(board, row2, col2)
    && board[row1][col1] === board[row2][col2];
};

function twoMapsDeepEqual(map1, map2) {
  if (map1.size !== map2.size) return false;

  for (let [key1, val1] of map1) {
    if (map2.get(key1) !== val1) return false;
  }

  for (let [key2, val2] of map2) {
    if (map1.get(key2) !== val2) return false;
  }

  return true;
};

function moveDown(board, piecesPlacedLegend) {
  const n = board.length;
  const { cols, rows, currentMove } = piecesPlacedLegend;
  const updatedRows = new Map();

  for (let [col] of cols) {
    for (let row = n - 1; row >= 0; row--) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedRow = moveTileDown(board, row, col, piecesPlacedLegend); 
        updatedRows.set(updatedRow, true);
      }
    }
  }

  piecesPlacedLegend.rows = updatedRows;
  
  if (currentMove.boardHasChanged) {
    placeTileRandomly(board, piecesPlacedLegend);
    
    currentMove.boardHasChanged = false;
  }
};

function moveTileDown(board, row, col, piecesPlacedLegend) {
  const { currentMove } = piecesPlacedLegend;
  let mergedFlag = false;

  while (isVacantAtCoord(board, row + 1, col)
    || (neighborTilesAreSame(board, row, col, row + 1, col) && !mergedFlag)) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row + 1][col]) {
      savedTileNum *= 2;
      mergedFlag = true;

      piecesPlacedLegend.count--;
    }

    placeTile(board, row + 1, col, savedTileNum);

    if (!currentMove.boardHasChanged) currentMove.boardHasChanged = true;

    row++;
  }

  return row;
};

function moveUp(board, piecesPlacedLegend) {
  const n = board.length;
  const { cols, rows } = piecesPlacedLegend;
  const updatedRows = new Map();

  for (let [col] of cols) {
    for (let row = 0; row < n; row++) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedRow = moveTileUp(board, row, col); 
        updatedRows.set(updatedRow, true);
      }
    }
  }
  
  piecesPlacedLegend.rows = updatedRows;
};

function moveTileUp(board, row, col) {
  let mergedFlag = false;

  while (isVacantAtCoord(board, row - 1, col)
    || (neighborTilesAreSame(board, row, col, row - 1, col) && !mergedFlag)) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row - 1][col]) {
      savedTileNum *= 2;
      mergedFlag = true;
    }

    placeTile(board, row - 1, col, savedTileNum);

    row--;
  }

  return row;
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
  twoMapsDeepEqual,
  moveDown,
  moveUp,
};
