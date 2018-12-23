import { Component, Input } from '@angular/core';
import { GamePhaseEnum } from '../../shared/game/game-phase.enum';
import { Player } from '../../shared/game/player.model';

/**
 * Component displaying game phase informatio.
 */
@Component({
  selector: 'game-phase-display',
  templateUrl: './game-phase-display.component.html'
})
export class GamePhaseDisplayComponent {
  /**
   * Game phase.
   */
  @Input() public gamePhase: GamePhaseEnum;

  /**
   * Winning player.
   */
  @Input() public winner: Player;

  /**
   * Get GamePhaseEnum in component.
   */
  public get GamePhaseEnum(): any {
    return GamePhaseEnum;
  }
}
