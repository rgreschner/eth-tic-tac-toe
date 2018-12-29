import { INITIAL_APP_STATE } from './INITIAL_APP_STATE';
import { ContractState } from './contract.state';
import { ContractActionTypeEnum } from './actions/contract-action-type.enum';

/**
 * Reducer for contract state.
 * @param state Current state.
 * @param action Action manipulating state.
 */
export const contractReducer = (state: ContractState, action: any) => {
  const newState = !state ? INITIAL_APP_STATE.contract : { ...state };
  switch (action.type) {
    case ContractActionTypeEnum.ApplyContract:
      newState.contractAddress = action.payload.contractAddress;
      break;
    case ContractActionTypeEnum.ResetContract:
      delete newState.contractAddress;
      break;
  }
  return newState;
};
