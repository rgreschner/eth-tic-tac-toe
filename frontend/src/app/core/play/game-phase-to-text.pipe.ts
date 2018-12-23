import { GamePhaseEnum } from '../../shared/game/game-phase.enum';
import { PipeTransform, Pipe } from '@angular/core';

/**
 * Pipe converting game phase to text.
 */
@Pipe({
  name: 'gamePhaseToText'
})
export class GamePhaseToTextPipe implements PipeTransform {
  /**
   * Fallback value for invalid input data.
   */
  static FALLBACK_VALUE = 'Unknown';

  /**
   * Mapping table for icon classes.
   */
  private _mappings = new Map<GamePhaseEnum, string>();

  /**
   * Set default texts.
   */
  private setDefaultTexts() {
    for (const key of Object.keys(GamePhaseEnum)) {
      const value = GamePhaseEnum[key];
      if (typeof value === 'number') {
        continue;
      }
      const typedKey = parseInt(key, 10) as GamePhaseEnum;
      this._mappings.set(typedKey, value);
    }
  }

  /**
   * Set mappings from game phase to text.
   */
  private setTexts() {
    this._mappings.set(GamePhaseEnum.Join, 'Players Joining');
    this._mappings.set(GamePhaseEnum.TurnPlayer1, 'Player #1 Turn');
    this._mappings.set(GamePhaseEnum.TurnPlayer2, 'Player #2 Turn');
    this._mappings.set(GamePhaseEnum.Finished, 'Game Finished');
  }

  constructor() {
    this.setDefaultTexts();
    this.setTexts();
  }

  /**
   * Convert game phase to text.
   * @param mappingKey Game phase to convert.
   * @param args Options.
   */
  public transform(mappingKey: number, ...args: any[]) {
    if (typeof mappingKey !== 'number') {
      return GamePhaseToTextPipe.FALLBACK_VALUE;
    }
    if (!this._mappings.has(mappingKey)) {
      return GamePhaseToTextPipe.FALLBACK_VALUE;
    }
    return this._mappings.get(mappingKey);
  }
}
