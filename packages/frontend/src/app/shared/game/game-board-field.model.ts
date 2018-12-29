/**
 * Game board field model.
 */
export interface GameBoardField {
  /**
   * Index of field in flattened game board array.
   */
  index: number;
  /**
   * Value of field.
   * 0 = Empty
   * 1 = Player #1
   * 2 = Player #2
   */
  value: number;
}
