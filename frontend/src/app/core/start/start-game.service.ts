import { EventAggregatorService } from '../../shared/events/event-aggregator.service';
import { Router } from '@angular/router';
import { GameActionTypeEnum } from '../../shared/state/actions/game-action-type.enum';
import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PlayGameService } from './play-game.service';

@Injectable()
export class StartGameService {
  constructor(
    private _eventAggregatorService: EventAggregatorService,
    private _playGameService: PlayGameService,
    private _router: Router
  ) {
    this.subscribeOnEvents();
  }

  /**
   * Subscribe on events.
   */
  private subscribeOnEvents() {
    this._eventAggregatorService.event$
      .pipe(filter((event: any) => event.type == GameActionTypeEnum.StartGame))
      .subscribe(() => this.startGame());
  }

  /**
   * Start new game.
   */
  public async startGame() {
    await this._playGameService.updateGamePhase();
    await this._playGameService.updateBoard();
    await this._playGameService.updatePlayers();
    await this._playGameService.updateWinner();
    this._router.navigate(['/play']);
  }
}
