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

module.exports = {
  isOccupiedAtCoord,
  isVacantAtCoord,
  isValidBoardCoord,
  getRandomBtwnZeroAndN,
  getTwoOrFour,
  removeTile,
  placeTile,
  neighborTilesAreSame,
  twoMapsDeepEqual,
};
