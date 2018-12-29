import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Component for game board display of
 * 3x3 fields.
 */
@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  /**
   * Source for field clicked events.
   */
  private _fieldClickedSource = new Subject();

  /**
   * Field clicked event observable.
   */
  private _fieldClicked$ = this._fieldClickedSource.asObservable();

  /**
   * Handle field clicks.
   * @param $event Click event.
   */
  public onFieldClicked($event) {
    this._fieldClickedSource.next($event);
  }

  /**
   * Game board data.
   */
  @Input() public gameBoard;

  /**
   * Field clicked event observable.
   */
  @Output()
  public get fieldClicked$() {
    return this._fieldClicked$;
  }
}
