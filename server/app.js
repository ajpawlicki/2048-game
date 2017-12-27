const express = require('express');
const app = express();

const {
  initBoard,
  placeTileRandomly,
  moveDown,
  moveUp,
  moveLeft,
  moveRight,
  makeMove
} = require('./game/game-logic');

let gameState = {
  tileCount: 0,
  rows: new Map(),
  cols: new Map(),
  currentMove: {
    boardHasChanged: false,
    mergedRows: new Map(),
    mergedCols: new Map()
  }
};

let board = initBoard();
placeTileRandomly(board, gameState);
placeTileRandomly(board, gameState);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../client'));

app.get('/getBoard', (req, res) => {
  res.send(board);
});

app.post('/postMove', (req, res) => {
  const { move } = req.body;
  const responseData = {}

  try {
    if (move === 40) makeMove(board, gameState, 'down');
    if (move === 38) makeMove(board, gameState, 'up');
    if (move === 37) makeMove(board, gameState, 'left');
    if (move === 39) makeMove(board, gameState, 'right');
  } catch (err) {
    console.error(err);
    responseData.error = err.message;
  }

  res.send(responseData);
});

app.put('/restart', (req, res) => {
  const { size } = req.body;

  board = initBoard(+size);
  gameState = {
    tileCount: 0,
    rows: new Map(),
    cols: new Map(),
    currentMove: {
      boardHasChanged: false,
      mergedRows: new Map(),
      mergedCols: new Map()
    }
  };

  placeTileRandomly(board, gameState);
  placeTileRandomly(board, gameState);

  res.end();
});

app.listen(4000, () => console.log('Listening on port 4000.'));
