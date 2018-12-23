import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from './error-dialog.component';
import { Injectable } from '@angular/core';
import { ErrorDialogDataModel } from './error-dialog-data.model';

/**
 * Service responsible for error dialog
 * display.
 */
@Injectable()
export class ErrorDialogService {
  constructor(private _dialog: MatDialog) {}

  /**
   * Show error dialog.
   * @param error Error to display.
   * @param title Dialog title.
   */
  public show(error: Error, title: string) {
    const data: ErrorDialogDataModel = {
      error,
      title
    };
    const dialog = this._dialog.open(ErrorDialogComponent, {
      width: '480px',
      data
    });
    const afterClosed$ = dialog.afterClosed();
    afterClosed$.subscribe(() => {});
    return afterClosed$.toPromise();
  }
}
