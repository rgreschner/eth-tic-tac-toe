import { AppState } from './app.state';
import { createGameBoard } from '../game/game-board.model';

/**
 * Initial app state.
 */
export const INITIAL_APP_STATE: AppState = {
  contract: {
    contractAddress: ''
  },
  game: {
    board: createGameBoard(),
    gamePhase: null,
    elapsedTurns: null,
    players: [],
    winner: null
  }
};
