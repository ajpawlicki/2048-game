const {
  isBoardFull,
  initBoard,
  moveDown,
  moveUp,
  moveLeft,
  moveRight,
  checkForLoser
 } = require('../server/game/game-logic');

 const { placeTile } = require('../server/game/game-helpers');

describe('Testing 2048 game logic functions', () => {
  
  describe('isBoardFull', () => {
    it('Checks empty board', () => {
      const board = initBoard();

      expect(isBoardFull(board)).toBeFalsy();
    });

    it('Checks full board', () => {
      const board = initBoard();

      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
          board[i][j] = 2;
        }
      }
      
      expect(isBoardFull(board)).toBeTruthy();
    });

    it('Checks board occupied with some tiles', () => {
      const board = initBoard();

      board[0][1] = 4;
      board[1][3] = 2;
      board[2][1] = 4;
      board[3][3] = 2;

      expect(isBoardFull(board)).toBeFalsy();
    });
  });

  describe('moveDown', () => {
    it('Moves one piece down and correctly updates game state', () => {
      const board = initBoard();
      const gameState = {
        rows: new Map(),
        cols: new Map(),
        currentMove: {
          mergedRows: new Map(),
          mergedCols: new Map()
        }
      };

      gameState.rows.set(0, true);
      gameState.cols.set(0, true);

      placeTile(board, 0, 0, 2);
      
      moveDown(board, gameState);

      const expected = initBoard();
      placeTile(expected, 3, 0, 2);

      expect(board).toEqual(expected);
      expect(gameState.rows.has(0)).toBeFalsy();
      expect(gameState.rows.has(3)).toBeTruthy();
      expect(gameState.cols.has(0)).toBeTruthy();
    });

    it('Does not change board if all tiles are at the bottom and no vertically adjacent tiles have the same value', () => {
      const board = initBoard();
      const gameState = {
        rows: new Map(),
        cols: new Map(),
        currentMove: {
          mergedRows: new Map(),
          mergedCols: new Map()
        }
      };

      gameState.cols.set(0, true);
      gameState.cols.set(1, true);
      gameState.cols.set(2, true);
      gameState.cols.set(3, true);

      placeTile(board, 3, 0, 2);
      placeTile(board, 2, 0, 4);
      placeTile(board, 3, 1, 8);
      placeTile(board, 3, 2, 8);
      placeTile(board, 2, 2, 16);
      placeTile(board, 1, 2, 4);
      placeTile(board, 0, 2, 2);
      
      moveDown(board, gameState);

      const expected = initBoard();
      placeTile(expected, 3, 0, 2);
      placeTile(expected, 2, 0, 4);
      placeTile(expected, 3, 1, 8);
      placeTile(expected, 3, 2, 8);
      placeTile(expected, 2, 2, 16);
      placeTile(expected, 1, 2, 4);
      placeTile(expected, 0, 2, 2);

      expect(board).toEqual(expected);
    });

    it('Merges two equal number tiles in the same column and moves merged tile down', () => {
      const board = initBoard();
      const gameState = {
        rows: new Map(),
        cols: new Map(),
        currentMove: {
          mergedRows: new Map(),
          mergedCols: new Map()
        }
      };

      placeTile(board, 0, 2, 4);
      placeTile(board, 2, 2, 4);

      gameState.cols.set(2, true);

      moveDown(board, gameState);

      const expected = initBoard();
      placeTile(expected, 3, 2, 8);

      expect(board).toEqual(expected);
      expect(gameState.rows.has(3)).toBeTruthy();
      expect(gameState.rows.has(0)).toBeFalsy();
      expect(gameState.rows.has(2)).toBeFalsy();
    });

    it('Only merges two tiles closest to the bottom out of three equal value tiles in the same column', () => {
      const board = initBoard();
      const gameState = {
        rows: new Map(),
        cols: new Map(),
        currentMove: {
          mergedRows: new Map(),
          mergedCols: new Map()
        }
      };

      placeTile(board, 0, 3, 2);
      placeTile(board, 2, 3, 2);
      placeTile(board, 3, 3, 2);

      gameState.cols.set(3, true);

      moveDown(board, gameState);

      const expected = initBoard();
      placeTile(expected, 3, 3, 4);
      placeTile(expected, 2, 3, 2);

      expect(board).toEqual(expected);
      expect(gameState.rows.has(3)).toBeTruthy();
      expect(gameState.rows.has(2)).toBeTruthy();
      expect(gameState.rows.has(0)).toBeFalsy();
    });

    it('Does not merge a tile that already has been merged in the current move', () => {
      const board = initBoard();
      const gameState = {
        rows: new Map(),
        cols: new Map(),
        currentMove: {
          mergedRows: new Map(),
          mergedCols: new Map()
        }
      };

      placeTile(board, 0, 3, 4);
      placeTile(board, 1, 3, 2);
      placeTile(board, 2, 3, 2);
      placeTile(board, 3, 3, 4);

      gameState.cols.set(3, true);

      moveDown(board, gameState);

      const expected = initBoard();
      placeTile(expected, 1, 3, 4);
      placeTile(expected, 2, 3, 4);
      placeTile(expected, 3, 3, 4);

      expect(board).toEqual(expected);
      expect(gameState.rows.has(0)).toBeFalsy();
      expect(gameState.rows.has(1)).toBeTruthy();
      expect(gameState.rows.has(2)).toBeTruthy();
      expect(gameState.rows.has(3)).toBeTruthy();
    });
  });

  describe('checkForLoser', () => {
    it('Returns false if board is empty', () => {
      const board = initBoard();

      expect(checkForLoser(board)).toBeFalsy();
    });

    it('Returns false if board has a vacant spot', () => {
      const board = initBoard(2);
      placeTile(board, 0, 0, 2);
      placeTile(board, 0, 1, 4);
      placeTile(board, 1, 0, 4);

      expect(checkForLoser(board)).toBeFalsy();
    });

    it('Returns false if board is full but has adjacent tiles that can be merged', () => {
      const board = initBoard(2);
      placeTile(board, 0, 0, 2);
      placeTile(board, 0, 1, 2);
      placeTile(board, 1, 0, 2);
      placeTile(board, 1, 1, 2);

      expect(checkForLoser(board)).toBeFalsy();
    });

    it('Correctly detects a losing condition', () => {
      const board = initBoard(2);
      placeTile(board, 0, 0, 2);
      placeTile(board, 0, 1, 4);
      placeTile(board, 1, 0, 8);
      placeTile(board, 1, 1, 2);

      expect(checkForLoser(board)).toBeTruthy();
    });
  });

});
