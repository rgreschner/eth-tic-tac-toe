import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ErrorDialogDataModel } from './error-dialog-data.model';

/**
 * Component for modal error
 * dialog contents.
 */
@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ErrorDialogDataModel,
    private _dialogRef: MatDialogRef<ErrorDialogComponent>
  ) {}

  /**
   * Close dialog.
   */
  public close() {
    this._dialogRef.close();
  }

  /**
   * Dialog title.
   */
  public get title(): string {
    return this._data.title;
  }

  /**
   * Dialog error.
   */
  public get error(): Error {
    return this._data.error;
  }
}
