import { Component, Input } from '@angular/core';
import { EthereumAccount } from '../shared/ethereum-account.model';

/**
 * Component displaying
 * Ethereum account info.
 */
// TODO: Refactor/move.
@Component({
  selector: 'account-info',
  templateUrl: './account-info.component.html'
})
export class AccountInfoComponent {
  /**
   * Account to display info for.
   */
  @Input() public account: EthereumAccount = null;
}
