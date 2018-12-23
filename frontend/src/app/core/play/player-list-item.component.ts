import { Component, Input } from '@angular/core';
import { Player } from '../../shared/game/player.model';

/**
 * Player list item.
 */
@Component({
  selector: 'player-list-item',
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.scss']
})
export class PlayerListItemComponent {
  /**
   * Player to display.
   */
  @Input() public player: Player;
  /**
   * Eth null address constant.
   */
  public readonly NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
}
