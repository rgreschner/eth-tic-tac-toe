import { Component, Output } from "@angular/core";
import { Subject } from "rxjs";

/**
 * Component for contract selection.
 */
@Component({
  selector: "contract-input",
  templateUrl: "./contract-input.component.html"
})
export class ContractInputComponent {
  /**
   * Source for input contract address.
   */
  private _selectedSource = new Subject<any>();

  /**
   * Source as mere observable.
   */
  private _selected$ = this._selectedSource.asObservable();

  /**
   * Source for input address.
   */
  @Output()
  public get selected$() {
    return this._selected$;
  }

  /**
   * Submit input address.
   */
  public submit() {
    const contractAddress = this.contractAddress;
    this._selectedSource.next({
      contractAddress
    });
  }

  /**
   * Input address.
   */
  public contractAddress: string;
}
