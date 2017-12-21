const express = require('express');
const app = express();

const {
  initBoard,
  placeTileRandomly,
  moveDown,
  moveUp
} = require('./game-logic');

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

  if (move === 40) moveDown(board, gameState);
  if (move === 38) moveUp(board, gameState);
  res.end();
});

app.listen(4000, () => console.log('Listening on port 4000.'));
