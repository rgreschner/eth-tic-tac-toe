import { Component, Input } from '@angular/core';
import { Player } from '../../shared/game/player.model';

/**
 * Component displaying list
 * of players.
 */
@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  /** Player list. */
  @Input() public players: Player[];
}
