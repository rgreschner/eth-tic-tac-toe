import { GameState } from './game.state';
import { INITIAL_APP_STATE } from './INITIAL_APP_STATE';
import { GameActionTypeEnum } from './actions/game-action-type.enum';
import { createGameBoard } from '../game/game-board.model';

/**
 * Reducer for game state.
 * @param state Current state.
 * @param action Action manipulating state.
 */
export const gameReducer = (state: GameState, action: any) => {
  const newState = !state ? INITIAL_APP_STATE.game : { ...state };
  switch (action.type) {
    case GameActionTypeEnum.SetGamePhase:
      newState.gamePhase = action.payload.gamePhase;
      break;
    case GameActionTypeEnum.SetPlayers:
      newState.players = action.payload.players;
      break;
    case GameActionTypeEnum.SetBoard:
      newState.board = action.payload.board;
      break;
    case GameActionTypeEnum.ResetGame:
      delete newState.gamePhase;
      newState.players = [];
      newState.board = createGameBoard();
      break;
    case GameActionTypeEnum.SetWinner:
      const address = action.payload.winner;
      const number = state.players.indexOf(address) + 1;
      newState.winner = {
        address,
        number
      };
      break;
  }
  return newState;
};
