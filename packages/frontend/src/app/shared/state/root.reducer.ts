import { combineReducers } from 'redux';
import { gameReducer } from './game.reducer';
import { contractReducer } from './contract.reducer';

/**
 * Reducer for app state.
 */
export const rootReducer = combineReducers({
  contract: contractReducer,
  game: gameReducer
});
