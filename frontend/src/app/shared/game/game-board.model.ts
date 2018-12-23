import { GameBoardField } from './game-board-field.model';

/**
 * Game board model.
 */
export interface GameBoard {
  /**
   * Flat list of game board fields.
   */
  fields: GameBoardField[];
}

/**
 * Create game board field for index.
 * Max size should be 9 (3x3).
 * @param index Field index.
 */
const createGameBoardField = (index: number) => {
  return {
    index,
    value: 0
  };
};

/**
 * Create game board.
 */
export const createGameBoard = () => {
  const fields = new Array(9)
    .fill(0)
    .map((_, index) => createGameBoardField(index));
  const board = {
    fields
  };
  return board;
};
