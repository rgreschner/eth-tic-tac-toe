/**
 * Domain model class for transaction
 * receipts coming from Web3.
 */
export interface TransactionReceiptModel {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  gasUsed: number;
  cumulativeGasUsed: number;
  contractAddress: string;
  logs: any[];
  status: string;
  logsBloom: string;
}
