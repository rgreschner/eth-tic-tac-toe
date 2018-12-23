import { Component, Input } from '@angular/core';

/**
 * Component for Ethereum address
 * display.
 */
@Component({
  selector: 'ethereum-address',
  templateUrl: './ethereum-address.component.html'
})
export class EthereumAddressComponent {
  /**
   * Displayed value.
   */
  @Input()
  public value: any;
}
