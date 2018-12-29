import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContractActionTypeEnum } from '../../shared/state/actions/contract-action-type.enum';
import { EventAggregatorService } from '../../shared/events/event-aggregator.service';
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../shared/state/app.state';
import { ContractState } from '../../shared/state/contract.state';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ErrorDialogService } from '../../shared/error-handling/error-dialog.service';
import { Web3Service } from '../../ethereum-tk';
import { NGXLogger } from 'ngx-logger';

/**
 * Start game page.
 */
// TODO: Improve state management, refactor from bool to enum?
@Component({
  templateUrl: './start.page.html'
})
export class StartPage implements OnInit, OnDestroy {
  /**
   * Page destroyed source.
   */
  private _destroySource = new Subject();

  /**
   * Page destroyed observable.
   */
  private _destroy$ = this._destroySource.asObservable();

  /**
   * Is new contract deployed?
   */
  private _isNewContractDeployed = false;

  constructor(
    private _logger: NGXLogger,
    private _ngRedux: NgRedux<AppState>,
    private _eventAggregatorService: EventAggregatorService,
    private _errorDialogService: ErrorDialogService,
    private _web3Service: Web3Service
  ) {}

  /**
   * Page init.
   */
  public ngOnInit() {
    this.subscribeOnEvents();
  }

  /**
   * Page destroyed.
   */
  public ngOnDestroy() {
    this._destroySource.next(true);
  }

  /**
   * Subscribe on events.
   */
  private subscribeOnEvents() {
    this._eventAggregatorService.event$
      .pipe(
        filter(
          (event: any) =>
            event.type == ContractActionTypeEnum.DeployNewContractSuccess
        ),
        takeUntil(this._destroy$)
      )
      .subscribe((event: any) => {
        this._isNewContractDeployed = true;
      });
    this._eventAggregatorService.event$
      .pipe(
        filter(
          (event: any) =>
            event.type == ContractActionTypeEnum.DeployNewContractFailed
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(async (event: any) => {
        const err = event.payload.error;
        this._logger.error('Error deploying contract.', err);
        await this._errorDialogService.show(err, 'Error deploying contract');
        this.isDeployingNewContract = false;
      });
    this._ngRedux
      .select(state => state.contract)
      .pipe(takeUntil(this._destroy$))
      .subscribe((newContractState: ContractState) => {
        this.isContractInstanceSet = !!newContractState.contractAddress;
      });
  }

  /**
   * Authorize DApp using MetaMask's enable.
   */
  public async authorizeDApp() {
    this.isAuthorizingDApp = true;
    try {
      await (window as any).ethereum.enable();
    } catch (err) {
      if (typeof err == 'string') {
        err = new Error(err);
      }
      this._logger.error('Error authorizing DApp.', err);
      this._errorDialogService.show(err, 'Error authorizing DApp');
    }
    this.isAuthorizingDApp = false;
  }

  /**
   * Handle contract selected.
   * @param $event Event data.
   */
  public async onContractSelected($event: any) {
    const contractAddress = $event.contractAddress;
    const applyContractAction = {
      type: ContractActionTypeEnum.ApplyContract,
      payload: {
        contractAddress
      }
    };
    this._eventAggregatorService.dispatch({ ...applyContractAction });
  }

  /**
   * Reset used game contract.
   */
  public resetContract() {
    this._eventAggregatorService.dispatch({
      type: ContractActionTypeEnum.ResetContract
    });
  }

  /**
   * Deploy new game contract.
   */
  public deployNewContract() {
    this.isDeployingNewContract = true;
    this._eventAggregatorService.dispatch({
      type: ContractActionTypeEnum.DeployNewContract
    });
  }

  /**
   * Is game contract instance set?
   */
  public isContractInstanceSet = false;

  /**
   * Is deployment of new contract in progress?
   */
  public isDeployingNewContract = false;

  /**
   * Is authorization of DApp in progess?
   */
  public isAuthorizingDApp = false;

  /**
   * Is new game contract deployed?
   */
  public get isNewContractDeployed() {
    return this._isNewContractDeployed;
  }

  /**
   * Has browser Web3 support?
   */
  public get hasWeb3Support(): boolean {
    return this._web3Service.hasWeb3Support;
  }
}
