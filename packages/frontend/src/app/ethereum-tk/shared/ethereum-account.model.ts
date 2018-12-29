/**
 * Domain model for ethereum accoonts.
 */
export interface EthereumAccount {
  /** Account's address. */
  address: string;
  /** Account's balance. */
  balance?: number;
}
