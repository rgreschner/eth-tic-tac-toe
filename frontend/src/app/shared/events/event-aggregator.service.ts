import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * Event aggregator.
 */
@Injectable()
export class EventAggregatorService {
  private _eventSource = new Subject();
  private _event$ = this._eventSource.asObservable();

  /**
   * Dispatch new event.
   * @param event Event to dispatch.
   */
  public dispatch(event: any) {
    this._eventSource.next(event);
  }

  /**
   * Event observable.
   */
  public get event$() {
    return this._event$;
  }
}
