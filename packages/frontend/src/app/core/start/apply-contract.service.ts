import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../shared/state/app.state';
import { INITIAL_APP_STATE } from '../../shared/state/INITIAL_APP_STATE';
import { ContractState } from '../../shared/state/contract.state';
import { ContractClassFactoryService } from '../../shared/game-contract/contract-class-factory.service';
import { CurrentContractRepository } from '../../shared/game-contract/current-contract.repository';
import { GameActionTypeEnum } from '../../shared/state/actions/game-action-type.enum';
import { EventAggregatorService } from '../../shared/events/event-aggregator.service';

/**
 * Service applyng contract to state
 * from address.
 */
@Injectable()
export class ApplyContractService {
  /**
   * Public URL of Tic Tac Toe contract manifest.
   */
  static TIC_TAC_TOE_CONTRACT_URL = '/assets/data/TicTacToe.json';

  /**
   * Address of previously used contract.
   * */
  private _previousContractAddress = INITIAL_APP_STATE.contract.contractAddress;

  constructor(
    private _ngRedux: NgRedux<AppState>,
    private _eventAggregatorService: EventAggregatorService,
    private _contractFactoryService: ContractClassFactoryService,
    private _currentContractRepository: CurrentContractRepository
  ) {}

  /**
   *  Initialize service.
   *  */
  public initialize() {
    this._ngRedux
      .select(state => state.contract)
      .subscribe((newContractState: ContractState) => {
        if (this._previousContractAddress == newContractState.contractAddress) {
          return;
        }
        this.applyNewContractAt(newContractState.contractAddress);
      });
  }

  /**
   * Apply new contract at address.
   * @param contractAddress Address of contract to use.
   */
  private async applyNewContractAt(contractAddress: string) {
    this._previousContractAddress = contractAddress;
    const TicTacToe = await this._contractFactoryService.create(
      ApplyContractService.TIC_TAC_TOE_CONTRACT_URL
    );
    const contractInstance = TicTacToe.at(contractAddress);
    const contractWasAppliedAction = {
      type: GameActionTypeEnum.StartGame
    };
    this._currentContractRepository.contractInstance = contractInstance;
    this._eventAggregatorService.dispatch({ ...contractWasAppliedAction });
  }
}
