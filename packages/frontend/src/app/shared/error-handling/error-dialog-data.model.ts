/**
 * Domain model class for
 * error dialog data.
 */
export interface ErrorDialogDataModel {
  /**
   * Error to display.
   */
  error: Error;
  /**
   * Dialog title.
   */
  title: string;
}
