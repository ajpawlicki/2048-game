const {
  isBoardFull,
  initBoard
 } = require('../server/game/game-logic');

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
});
