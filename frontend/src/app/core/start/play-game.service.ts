import { EventAggregatorService } from '../../shared/events/event-aggregator.service';
import { GameActionTypeEnum } from '../../shared/state/actions/game-action-type.enum';
import { Injectable } from '@angular/core';
import { Web3Service } from '../../ethereum-tk';
import { ContractApiService } from '../../shared/game-contract/contract-api.service';
import { filter } from 'rxjs/operators';
import { ContractActionTypeEnum } from '../../shared/state/actions/contract-action-type.enum';
import { CurrentContractRepository } from '../../shared/game-contract/current-contract.repository';

/**
 * Service representing core game functionality.
 */
@Injectable()
export class PlayGameService {
  constructor(
    private _eventAggregatorService: EventAggregatorService,
    private _web3Service: Web3Service,
    private _contractApiService: ContractApiService,
    private _currentContractRepository: CurrentContractRepository
  ) {
    this.subscribeOnEvents();
  }

  /**
   * Subscribe on events.
   */
  private subscribeOnEvents() {
    this._eventAggregatorService.event$
      .pipe(
        filter(
          (event: any) => event.type == ContractActionTypeEnum.ResetContract
        )
      )
      .subscribe(() => {
        this._currentContractRepository.contractInstance = null;
        this._eventAggregatorService.dispatch({
          type: GameActionTypeEnum.ResetGame
        });
      });
    this._eventAggregatorService.event$
      .pipe(
        filter(
          (event: any) => event.type == ContractActionTypeEnum.DeployNewContract
        )
      )
      .subscribe(() => this.deployNewContract());
  }

  /**
   * Deploy new game contract.
   */
  private async deployNewContract() {
    try {
      const deploymentReceipt = await this._contractApiService.deploy();
      const contractAddress = deploymentReceipt.contractAddress;
      this._eventAggregatorService.dispatch({
        type: ContractActionTypeEnum.DeployNewContractSuccess,
        payload: {
          contractAddress
        }
      });
      this._eventAggregatorService.dispatch({
        type: ContractActionTypeEnum.ApplyContract,
        payload: {
          contractAddress
        }
      });
    } catch (err) {
      this._eventAggregatorService.dispatch({
        type: ContractActionTypeEnum.DeployNewContractFailed,
        payload: { error: err }
      });
    }
  }

  /**
   * Update game phase.
   */
  public async updateGamePhase() {
    const gamePhaseResult: any = await this._contractApiService.getGamePhase();
    const gamePhase = gamePhaseResult.c[0];
    this._eventAggregatorService.dispatch({
      type: GameActionTypeEnum.SetGamePhase,
      payload: {
        gamePhase
      }
    });
  }

  /**
   * Update winning player.
   */
  public async updateWinner() {
    const winner: any = await this._contractApiService.getWinner();
    this._eventAggregatorService.dispatch({
      type: GameActionTypeEnum.SetWinner,
      payload: {
        winner
      }
    });
  }

  /**
   * Update player list.
   */
  public async updatePlayers() {
    const players = await this._contractApiService.getPlayers();
    this._eventAggregatorService.dispatch({
      type: GameActionTypeEnum.SetPlayers,
      payload: {
        players
      }
    });
  }

  /**
   * Update game board.
   */
  public async updateBoard() {
    const board = await this._contractApiService.getBoard();
    this._eventAggregatorService.dispatch({
      type: GameActionTypeEnum.SetBoard,
      payload: {
        board
      }
    });
  }

  /**
   * Join game as player.
   */
  public async join() {
    await this._contractApiService.join();
    await this.updateGamePhase();
    await this.updatePlayers();
    await this.updateWinner();
    await this.updateBoard();
    await this.updateGamePhase();
  }

  /**
   * Perform player turn.
   * @param x X position of field on board.
   * @param y Y position of field on board.
   */
  public async playerTurn(x: number, y: number) {
    await this._contractApiService.playerTurn(x, y);
    await this.updateGamePhase();
    await this.updateBoard();
    await this.updateGamePhase();
    await this.updateWinner();
  }

  /**
   * Refresh player's ethereum account.
   */
  public refreshAccount() {
    this._web3Service.refreshAccount();
  }
}
