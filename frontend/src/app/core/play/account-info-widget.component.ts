import { Component, Input } from '@angular/core';

/**
 * Component displaying account info.
 */
@Component({
  selector: 'account-info-widget',
  templateUrl: './account-info-widget.component.html'
})
export class AccountInfoWidgetComponent {
  /**
   * Account data.
   */
  @Input() public account = null;
}
