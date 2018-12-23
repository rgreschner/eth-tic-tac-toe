/**
 * Domain model class for transaction
 * data used in Web3.
 */
export interface TransactionDataModel {
  /**
   *  Amount of gas used in computations.
   */
  gas: number;
  /**
   *  Gas price used for computations.
   */
  gasPrice: number;
  /**
   *  Sender address.
   */
  from?: string;
}
