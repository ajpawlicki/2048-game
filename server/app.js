const express = require('express');
const app = express();

const {
  initBoard,
  placeTileRandomly,
  moveDown,
  moveUp
} = require('./game-logic');

let piecesPlacedLegend = {
  count: 0,
  rows: new Map(),
  cols: new Map(),
  currentMove: {
    boardHasChanged: false
  }
};

let board = initBoard();
placeTileRandomly(board, piecesPlacedLegend);
placeTileRandomly(board, piecesPlacedLegend);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../client'));

app.get('/getBoard', (req, res) => {
  res.send(board);
});

app.post('/postMove', (req, res) => {
  const { move } = req.body;

  if (move === 40) moveDown(board, piecesPlacedLegend);
  if (move === 38) moveUp(board, piecesPlacedLegend);
  res.end();
});

app.listen(4000, () => console.log('Listening on port 4000.'));
