import { Component, Input } from '@angular/core';
import { Player } from '../../shared/game/player.model';

/**
 * Component displaying game info.
 */
@Component({
  selector: 'game-info',
  templateUrl: './game-info.component.html'
})
export class GameInfoComponent {
  /**
   * Game contract.
   */
  @Input() public contract: any;

  /**
   * Game phase.
   */
  @Input() public gamePhase: any;

  /**
   * Winner of game.
   */
  @Input() public winner: Player;

  /**
   * Number of elapsed game turns.
   */
  @Input() public elapsedTurns: number;
}
