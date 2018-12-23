import { Component, Input } from '@angular/core';
import { PlayGameService } from '../start/play-game.service';
import { NGXLogger } from 'ngx-logger';
import { ErrorDialogService } from 'src/app/shared/error-handling/error-dialog.service';

/**
 * Player list as widget.
 */
@Component({
  selector: 'player-list-widget',
  templateUrl: './player-list-widget.component.html'
})
export class PlayerListWidgetComponent {
  constructor(
    private _logger: NGXLogger,
    private _playGameService: PlayGameService,
    private _errorDialogService: ErrorDialogService
  ) {}

  /**
   * Players to display.
   */
  @Input() public players: string[];

  /**
   * Join as new player.
   */
  public async join() {
    try {
      await this._playGameService.join();
    } catch (err) {
      this._logger.error('Error joining players.', err);
      this._errorDialogService.show(err, 'Error joining players');
    }
  }
}
