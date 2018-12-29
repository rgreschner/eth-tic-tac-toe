import { Player } from '../game/player.model';
import { GameBoard } from '../game/game-board.model';
import { GamePhaseEnum } from '../game/game-phase.enum';

/**
 * Game state.
 */
export interface GameState {
  /**
   * List of players.
   */
  players: string[];
  /**
   * Game board.
   */
  board: GameBoard;
  /**
   * Game phase.
   */
  gamePhase: GamePhaseEnum;
  /**
   * Winning player.
   */
  winner: Player;
  /**
   * Number of elapsed game turns.
   */
  elapsedTurns: number;
}
