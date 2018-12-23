import { GameState } from './game.state';
import { ContractState } from './contract.state';

/**
 * Application state.
 */
export interface AppState {
  /**
   * Contract state.
   */
  contract: ContractState;
  /**
   * Game state.
   */
  game: GameState;
}
