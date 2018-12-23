import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3Service } from '../../ethereum-tk';
import { map, takeUntil } from 'rxjs/operators';
import { PlayGameService } from '../start/play-game.service';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../shared/state/app.state';
import { GameBoard } from '../../shared/game/game-board.model';
import { Player } from '../../shared/game/player.model';
import { Subject } from 'rxjs';
import { ContractState } from '../../shared/state/contract.state';
import { GameState } from '../../shared/state/game.state';
import { ErrorDialogService } from 'src/app/shared/error-handling/error-dialog.service';
import { NGXLogger } from 'ngx-logger';

/**
 * Page for playing TicTacToe.
 */
@Component({
  templateUrl: './play.page.html'
})
export class PlayPage implements OnInit, OnDestroy {
  /**
   * Component destroyed source.
   */
  private _destroySource = new Subject();

  /**
   * Component destroyed observable.
   */
  private _destroy$ = this._destroySource.asObservable();

  /**
   * Game board.
   */
  private _board: GameBoard;

  /**
   * Players.
   */
  private _players: Player[] = [];

  /**
   * Game phase.
   */
  private _gamePhase: number;

  /**
   * Used game contract.
   */
  private _contract: ContractState;

  /**
   * Winner of game.
   */
  private _winner: Player;

  constructor(
    private _logger: NGXLogger,
    private _ngRedux: NgRedux<AppState>,
    private _web3Service: Web3Service,
    private _playGameService: PlayGameService,
    private _errorDialogService: ErrorDialogService
  ) {}

  /**
   * Page init.
   */
  public ngOnInit() {
    this.subscribeOnStore();
  }

  /**
   * Page destroyed.
   */
  public ngOnDestroy() {
    this._destroySource.next(true);
  }

  /**
   * Subscribe on Redux store
   * events.
   */
  private subscribeOnStore() {
    this._ngRedux
      .select(state => state.game)
      .pipe(takeUntil(this._destroy$))
      .subscribe((newGameState: GameState) =>
        this.applyNewGameState(newGameState)
      );
    this._ngRedux
      .select(state => state.contract)
      .pipe(takeUntil(this._destroy$))
      .subscribe((newContractState: ContractState) =>
        this.applyNewContractState(newContractState)
      );
  }

  /**
   * Convert player number to icon class.
   * @param playerNumber Player number.
   */
  private playerNumberToIconClass(playerNumber: number) {
    return playerNumber == 1 ? 'times' : 'circle';
  }

  /**
   * Apply new game state from store.
   * @param newGameState New game state.
   */
  private applyNewGameState(newGameState: GameState) {
    this._gamePhase = newGameState.gamePhase;
    this._board = newGameState.board;
    this._winner = newGameState.winner;
    this._players = newGameState.players.map(
      (address: string, index: number) => {
        const playerNumber = index + 1;
        return {
          address,
          number: playerNumber,
          iconClass: this.playerNumberToIconClass(playerNumber)
        };
      }
    );
  }

  /**
   * Apply new contract state from store.
   * @param newContractState New contract state.
   */
  private applyNewContractState(newContractState: ContractState) {
    this._contract = newContractState;
  }

  /**
   * Refresh account.
   */
  public refreshAccount() {
    this._playGameService.refreshAccount();
  }

  /**
   * Get user's eth account.
   */
  public get myAccount$() {
    return this._web3Service.myAccount$;
  }

  /**
   * Is valid user account.
   */
  public get hasAccount$() {
    return this._web3Service.myAccount$.pipe(map(e => !!e));
  }

  /**
   * Handle clicks on field.
   * @param $event Click event.
   */
  public async onFieldClicked($event) {
    const field: any = $event.field;
    const x = field.index % 3;
    const y = Math.floor(field.index / 3);
    try {
      await this._playGameService.playerTurn(x, y);
    } catch (err) {
      this._logger.error('Error performing player turn.', err);
      this._errorDialogService.show(err, 'Error performing player turn');
    }
  }

  /**
   * Player list.
   */
  public get players() {
    return this._players;
  }

  /**
   * Winning player of game.
   */
  public get winner() {
    return this._winner;
  }

  /**
   * Game board.
   */
  public get board() {
    return this._board;
  }

  /**
   * Game phase.
   */
  public get gamePhase() {
    return this._gamePhase;
  }

  /**
   * Game contract.
   */
  public get contract() {
    return this._contract;
  }

  /**
   * Show warning for invalid contract.
   */
  public get showInvalidContractWarning() {
    return !this._contract || !this._contract.contractAddress;
  }
}
