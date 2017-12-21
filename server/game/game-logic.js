const {
  isOccupiedAtCoord,
  isVacantAtCoord,
  isValidBoardCoord,
  getRandomBtwnZeroAndN,
  getTwoOrFour,
  removeTile,
  placeTile,
  neighborTilesAreSame,
  twoMapsDeepEqual,
} = require('./game-helpers');

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

const gameState = {
  tileCount: 0,
  rows: new Map(),
  cols: new Map(),
  currentMove: {
    boardHasChanged: false,
    mergedRows: new Map(),
    mergedCols: new Map()
  }
};

function placeTileRandomly(board, gameState) {
  const n = board.length;

  if (gameState.tileCount === (n * n)) {
    // check for loser
    return null;
  }
  
  let row = null;
  let col = null;
  
  while (!isValidBoardCoord(board, row, col) || isOccupiedAtCoord(board, row, col)) {
    row = getRandomBtwnZeroAndN(n);
    col = getRandomBtwnZeroAndN(n);
  }

  board[row][col] = getTwoOrFour();

  gameState.tileCount++;
  gameState.rows.set(row, true);
  gameState.cols.set(col, true);
};

function moveDown(board, gameState) {
  const n = board.length;
  const { cols, rows, currentMove } = gameState;
  rows.clear();

  for (let [col, val] of cols) {
    for (let row = n - 1; row >= 0; row--) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedRow = moveTileDown(board, row, col, gameState);
        rows.set(updatedRow, true);
      }
    }

    currentMove.mergedRows.clear();
  }
  
  if (currentMove.boardHasChanged) {
    placeTileRandomly(board, gameState);
    
    currentMove.boardHasChanged = false;
  }
};

function moveTileDown(board, row, col, gameState) {
  const { currentMove } = gameState;
  const { mergedRows } = currentMove;

  while (isVacantAtCoord(board, row + 1, col) || (neighborTilesAreSame(board, row, col, row + 1, col)
    && !mergedRows.has(row) && !mergedRows.has(row + 1))) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row + 1][col]) {
      savedTileNum *= 2;

      gameState.tileCount--;
      mergedRows.set(row + 1, true);
    }

    placeTile(board, row + 1, col, savedTileNum);

    if (!currentMove.boardHasChanged) currentMove.boardHasChanged = true;

    row++;
  }

  return row;
};

function moveUp(board, gameState) {
  const n = board.length;
  const { cols, rows, currentMove } = gameState;
  rows.clear();

  for (let [col, val] of cols) {
    for (let row = 0; row < n; row++) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedRow = moveTileUp(board, row, col, gameState); 
        rows.set(updatedRow, true);
      }
    }

    currentMove.mergedRows.clear();
  }
  
  if (currentMove.boardHasChanged) {
    placeTileRandomly(board, gameState);
    
    currentMove.boardHasChanged = false;
  }
};

function moveTileUp(board, row, col, gameState) {
  const { currentMove } = gameState;
  const { mergedRows } = currentMove;

  while (isVacantAtCoord(board, row - 1, col) || (neighborTilesAreSame(board, row, col, row - 1, col)
    && !mergedRows.has(row) && !mergedRows.has(row - 1))) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row - 1][col]) {
      savedTileNum *= 2;

      gameState.tileCount--;
      mergedRows.set(row - 1, true);
    }

    placeTile(board, row - 1, col, savedTileNum);

    if (!currentMove.boardHasChanged) currentMove.boardHasChanged = true;

    row--;
  }

  return row;
};

function checkForLoser() {

};

module.exports = {
  initBoard,
  placeTileRandomly,
  moveDown,
  moveUp,
};
