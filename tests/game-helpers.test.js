const {
  initBoard,
  placeTileRandomly,
  moveDown,
} = require('../server/game/game-logic');

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
} = require('../server/game/game-helpers');

describe('Testing 2048 game helper functions', () => {

  describe('isValidBoardCoord', () => {
    it('Returns true for a valid row and col', () => {
      const board = initBoard(4);

      expect(isValidBoardCoord(board, 0, 0)).toBeTruthy();
      expect(isValidBoardCoord(board, 0, 3)).toBeTruthy();
      expect(isValidBoardCoord(board, 1, 2)).toBeTruthy();
      expect(isValidBoardCoord(board, 2, 1)).toBeTruthy();
      expect(isValidBoardCoord(board, 3, 3)).toBeTruthy();
    });

    it('Returns false for an invalid row', () => {
      const board = initBoard(4);

      expect(isValidBoardCoord(board, -1, 0)).toBeFalsy();
      expect(isValidBoardCoord(board, 4, 0)).toBeFalsy();
      expect(isValidBoardCoord(board, 10, 0)).toBeFalsy();
    });

    it('Returns false for an invalid col', () => {
      const board = initBoard(4);

      expect(isValidBoardCoord(board, 1, -1)).toBeFalsy();
      expect(isValidBoardCoord(board, 2, 4)).toBeFalsy();
      expect(isValidBoardCoord(board, 3, 100)).toBeFalsy();
    });
  });
  
  describe('isOccupiedAtCoord', () => {
    it('Returns true given a valid coordinate that has a number', () => {
      const board = initBoard(4);
      board[0][0] = 2;
      board[1][2] = 4;
      board[3][0] = 2;

      expect(isOccupiedAtCoord(board, 0, 0)).toBeTruthy();
      expect(isOccupiedAtCoord(board, 1, 2)).toBeTruthy();
      expect(isOccupiedAtCoord(board, 3, 0)).toBeTruthy();
    });

    it('Returns false given a valid coordinate that has null', () => {
      const board = initBoard(4);

      expect(isOccupiedAtCoord(board, 0, 0)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 2, 0)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 3, 2)).toBeFalsy();
    });

    it('Returns false for an invalid row', () => {
      const board = initBoard(4);

      expect(isOccupiedAtCoord(board, -1, 0)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 4, 0)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 10, 0)).toBeFalsy();
    });

    it('Returns false for an invalid col', () => {
      const board = initBoard(4);

      expect(isOccupiedAtCoord(board, 1, -1)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 2, 4)).toBeFalsy();
      expect(isOccupiedAtCoord(board, 3, 100)).toBeFalsy();
    });
  });

  describe('isVacantAtCoord', () => {    
    it('Returns true given a valid coordinate that has null', () => {
      const board = initBoard(4);
      
      expect(isVacantAtCoord(board, 0, 0)).toBeTruthy();
      expect(isVacantAtCoord(board, 2, 0)).toBeTruthy();
      expect(isVacantAtCoord(board, 3, 2)).toBeTruthy();
    });

    it('Returns false given a valid coordinate that has a number', () => {
      const board = initBoard(4);
      board[0][0] = 2;
      board[1][2] = 4;
      board[3][0] = 2;

      expect(isVacantAtCoord(board, 0, 0)).toBeFalsy();
      expect(isVacantAtCoord(board, 1, 2)).toBeFalsy();
      expect(isVacantAtCoord(board, 3, 0)).toBeFalsy();
    });
    
    it('Returns false for an invalid row', () => {
      const board = initBoard(4);

      expect(isVacantAtCoord(board, -1, 0)).toBeFalsy();
      expect(isVacantAtCoord(board, 4, 0)).toBeFalsy();
      expect(isVacantAtCoord(board, 10, 0)).toBeFalsy();
    });

    it('Returns false for an invalid col', () => {
      const board = initBoard(4);

      expect(isVacantAtCoord(board, 1, -1)).toBeFalsy();
      expect(isVacantAtCoord(board, 2, 4)).toBeFalsy();
      expect(isVacantAtCoord(board, 3, 100)).toBeFalsy();
    });
  });

  describe('getRandomBtwnZeroAndN', () => {

  });

  describe('getTwoOrFour', () => {
    it('Returns a number greater than or equal to two', () => {
      expect(getTwoOrFour()).toBeGreaterThanOrEqual(2);
    });

    it('Returns a number less than or equal to four', () => {
      expect(getTwoOrFour()).toBeLessThanOrEqual(4);
    });

    it('Does not return three', () => {
      expect(getTwoOrFour()).not.toBe(3);
    });

    it('Is a whole number', () => {
      expect(getTwoOrFour() % 1).toBe(0);
    });
  });

  describe('getRandomBtwnZeroAndN', () => {
    it('Returns a number greater than or equal to zero', () => {
      for (let i = 0; i < 50; i++) {
        expect(getRandomBtwnZeroAndN(i)).toBeGreaterThanOrEqual(0);
      }
    });

    it('Returns a number less than n', () => {
      for (let i = 1; i < 50; i++) {
        expect(getRandomBtwnZeroAndN(i)).toBeLessThan(i);
      }
    });
  });

  describe('twoMapsDeepEqual', () => {
    it('Detects if two maps are equal', () => {
      const map1 = new Map();
      const map2 = new Map();
      
      map1.set(4, true);
      map2.set(4, true);

      map1.set('AJ', 'Snow');
      map2.set('AJ', 'Snow');

      map1.set('Cubbies', 1);
      map2.set('Cubbies', 1);

      expect(twoMapsDeepEqual(map1, map2)).toBeTruthy();
    });
    
    it('Detects if two maps are not equal', () => {
      const map1 = new Map();
      const map2 = new Map();
      
      map1.set(4, true);
      map2.set(4, true);

      map1.set('Big', 'Blue');
      map2.set('AJ', 'Snow');

      map1.set('Cubbies', 1);
      map2.set('Cubbies', 1);

      expect(twoMapsDeepEqual(map1, map2)).toBeFalsy();
    });

    it('Correctly detects two maps are not equal when first map has an extra key-value pair', () => {
      const map1 = new Map();
      const map2 = new Map();
      
      map1.set(4, true);
      map2.set(4, true);

      map1.set('AJ', 'Snow');

      map1.set('Cubbies', 1);
      map2.set('Cubbies', 1);

      expect(twoMapsDeepEqual(map1, map2)).toBeFalsy();
    });

    it('Correctly detects two maps are not equal when second map has an extra key-value pair', () => {
      const map1 = new Map();
      const map2 = new Map();
      
      map1.set(4, true);
      map2.set(4, true);

      map2.set('AJ', 'Snow');

      map1.set('Cubbies', 1);
      map2.set('Cubbies', 1);

      expect(twoMapsDeepEqual(map1, map2)).toBeFalsy();
    });
  });
});
