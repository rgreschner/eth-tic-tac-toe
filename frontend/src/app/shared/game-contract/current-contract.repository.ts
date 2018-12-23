import { Injectable } from '@angular/core';

/**
 * Repository holding current TicTacToe
 * contract instance in memory.
 */
@Injectable()
export class CurrentContractRepository {
  /**
   * Contract instance.
   */
  public contractInstance: any;
}
