import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { promisify } from 'es6-promisify';
import { EthereumAccount } from './shared/ethereum-account.model';
import { NGXLogger } from 'ngx-logger';

/**
 * Service providing Web3 access.
 */
@Injectable()
export class Web3Service {
  private _myAccountSource = new BehaviorSubject<EthereumAccount>(null);
  private _myAccount$ = this._myAccountSource.asObservable();
  private _web3: any;
  private _hasWeb3Support = false;

  constructor(private _logger: NGXLogger) {}

  /**
   * Initialize service.
   */
  public initialize() {
    this._logger.info('Initializing Web3...');
    const Web3 = window['Web3'];
    this._hasWeb3Support = !!Web3;
    if (!this._hasWeb3Support) {
      this._logger.warn('No web3 support.');
      return;
    }
    this._web3 = new Web3(window['web3'].currentProvider);
    window['myWeb3'] = this._web3;
    this._web3.eth.getAccountsAsync = promisify(
      this._web3.eth.getAccounts.bind(this._web3.eth)
    );
    this._web3.eth.getBalanceAsync = promisify(
      this._web3.eth.getBalance.bind(this._web3.eth)
    );
    this._web3.eth.sendTransactionAsync = promisify(
      this._web3.eth.sendTransaction.bind(this._web3.eth)
    );
    return this.refreshAccount();
  }

  /**
   * Refresh user's ethereum
   * account info.
   */
  public async refreshAccount() {
    this._logger.info('Refreshing account.');
    const accounts: any[] = await this._web3.eth.getAccountsAsync();
    const account: EthereumAccount = { address: accounts[0] };
    const balance = await this._web3.eth.getBalanceAsync(account.address);
    account.balance = balance.c[0];
    this._logger.info('Refreshed account.');
    this._myAccountSource.next(account);
    return Promise.resolve(account);
  }

  /**
   * User's ethereum account info.
   */
  public get myAccount$(): Observable<EthereumAccount> {
    return this._myAccount$;
  }

  /**
   * Does browser have Web3 Support?
   */
  public get hasWeb3Support(): boolean {
    return this._hasWeb3Support;
  }

  /**
   * Web3 instance.
   */
  public get web3(): any {
    return this._web3;
  }
}
