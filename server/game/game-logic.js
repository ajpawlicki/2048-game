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
        let updatedRow = moveTileVertically(board, gameState, row, col, 1);
        rows.set(updatedRow, true);
      }
    }

    currentMove.mergedRows.clear();
  }
};

function moveTileVertically(board, gameState, row, col, rowDelta) {
  const { currentMove } = gameState;
  const { mergedRows } = currentMove;

  while (isVacantAtCoord(board, row + rowDelta, col) || (neighborTilesAreSame(board, row, col, row + rowDelta, col)
    && !mergedRows.has(row) && !mergedRows.has(row + rowDelta))) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row + rowDelta][col]) {
      savedTileNum *= 2;

      gameState.tileCount--;
      mergedRows.set(row + rowDelta, true);
    }

    placeTile(board, row + rowDelta, col, savedTileNum);

    if (!currentMove.boardHasChanged) currentMove.boardHasChanged = true;

    row += rowDelta;
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
        let updatedRow = moveTileVertically(board, gameState, row, col, -1);
        rows.set(updatedRow, true);
      }
    }

    currentMove.mergedRows.clear();
  }
};

function moveLeft(board, gameState) {
  const n = board.length;
  const { cols, rows, currentMove } = gameState;
  cols.clear();

  for (let [row, val] of rows) {
    for (let col = 0; col < n; col++) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedCol = moveTileHorizontally(board, gameState, row, col, -1);
        cols.set(updatedCol, true);
      }
    }

    currentMove.mergedCols.clear();
  }
};

function moveTileHorizontally(board, gameState, row, col, colDelta) {
  const { currentMove } = gameState;
  const { mergedCols } = currentMove;

  while (isVacantAtCoord(board, row, col + colDelta) || (neighborTilesAreSame(board, row, col, row, col + colDelta)
    && !mergedCols.has(col) && !mergedCols.has(col + colDelta))) {
    let savedTileNum = removeTile(board, row, col);
    
    if (savedTileNum === board[row][col + colDelta]) {
      savedTileNum *= 2;

      gameState.tileCount--;
      mergedCols.set(col + colDelta, true);
    }

    placeTile(board, row, col + colDelta, savedTileNum);

    if (!currentMove.boardHasChanged) currentMove.boardHasChanged = true;

    col += colDelta;
  }

  return col;
};

function moveRight(board, gameState) {
  const n = board.length;
  const { cols, rows, currentMove } = gameState;
  cols.clear();

  for (let [row, val] of rows) {
    for (let col = n - 1; col >= 0; col--) {
      if (isOccupiedAtCoord(board, row, col)) {
        let updatedCol = moveTileHorizontally(board, gameState, row, col, 1);
        cols.set(updatedCol, true);
      }
    }

    currentMove.mergedCols.clear();
  }
};

function makeMove(board, gameState, direction) {
  if (!direction) throw new Error("Need to input a direction: 'left', 'right', 'down', or 'up'.");

  const { currentMove } = gameState;

  if (direction === 'left') moveLeft(board, gameState);
  if (direction === 'right') moveRight(board, gameState);
  if (direction === 'up') moveUp(board, gameState);
  if (direction === 'down') moveDown(board, gameState);

  if (currentMove.boardHasChanged) {
    placeTileRandomly(board, gameState);
    
    currentMove.boardHasChanged = false;
  }
};

function isBoardFull(board) {
  
};

function checkForLoser() {

};

module.exports = {
  initBoard,
  placeTileRandomly,
  moveDown,
  moveUp,
  moveLeft,
  moveRight,
  makeMove
};
