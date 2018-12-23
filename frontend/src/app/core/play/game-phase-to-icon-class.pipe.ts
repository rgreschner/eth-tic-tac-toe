import { GamePhaseEnum } from '../../shared/game/game-phase.enum';
import { PipeTransform, Pipe } from '@angular/core';

/**
 * Pipe converting game phase to CSS icon class.
 */
@Pipe({
  name: 'gamePhaseToIconClass'
})
export class GamePhaseToIconClassPipe implements PipeTransform {
  /**
   * Fallback value for invalid input data.
   */
  static FALLBACK_VALUE = 'question';

  /**
   * Mapping table for icon classes.
   */
  private _mappings = new Map<GamePhaseEnum, string>();

  /**
   * Set mappings from game phase to icon class.
   */
  private setMappings() {
    this._mappings.set(GamePhaseEnum.Join, 'at');
    this._mappings.set(GamePhaseEnum.TurnPlayer1, 'times');
    this._mappings.set(GamePhaseEnum.TurnPlayer2, 'circle');
    this._mappings.set(GamePhaseEnum.Finished, 'award');
  }

  constructor() {
    this.setMappings();
  }

  /**
   * Convert game phase to icon class.
   * @param mappingKey Game phase to convert.
   * @param args Options.
   */
  public transform(mappingKey: number, ...args: any[]) {
    if (typeof mappingKey !== 'number') {
      return GamePhaseToIconClassPipe.FALLBACK_VALUE;
    }
    if (!this._mappings.has(mappingKey)) {
      return GamePhaseToIconClassPipe.FALLBACK_VALUE;
    }
    return this._mappings.get(mappingKey);
  }
}
