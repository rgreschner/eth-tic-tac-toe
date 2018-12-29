import { Injectable } from '@angular/core';
import { Web3Service } from '../../ethereum-tk';
import { CurrentContractRepository } from './current-contract.repository';
import { createGameBoard } from '../game/game-board.model';
import { ContractClassFactoryService } from './contract-class-factory.service';
import { TransactionDataModel, TransactionReceiptModel } from '../../ethereum-tk';

/**
 * Service encapsulating
 * Tic Tac Toe contract.
 */
@Injectable()
export class ContractApiService {
  /**
   * Public URL of Tic Tac Toe contract manifest.
   */
  static TIC_TAC_TOE_CONTRACT_URL = '/assets/data/TicTacToe.json';

  /**
   * Default values to use in transaction.
   */
  static DEFAULT_TRANSACTION_DATA: TransactionDataModel = {
    gas: 4712388,
    gasPrice: 100000000000
  };

  constructor(
    private _web3Service: Web3Service,
    private _currentContractRepository: CurrentContractRepository,
    private _contractClassFactoryService: ContractClassFactoryService
  ) {}

  /**
   * Create default transaction data for internal use.
   */
  private createDefaultTransactionData(): TransactionDataModel {
    const web3 = this._web3Service.web3;
    const defaultAccount = web3.eth.accounts[0];
    if (!defaultAccount) {
      throw new Error('Invalid sender account address.');
    }
    const txData: TransactionDataModel = {
      from: defaultAccount,
      ...ContractApiService.DEFAULT_TRANSACTION_DATA
    };
    return txData;
  }

  /**
   * Get receipt for transaction hash.
   * @param transactionHash Transaction hash.
   */
  public getTransactionReceipt(
    transactionHash: string
  ): Promise<TransactionReceiptModel> {
    const web3 = this._web3Service.web3;
    return new Promise((resolve, reject) => {
      web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
        if (!!err) {
          return reject(err);
        }
        resolve(receipt);
      });
    });
  }

  /**
   * Deploy new contract instance.
   */
  public async deploy(): Promise<TransactionReceiptModel> {
    const pathToContract = ContractApiService.TIC_TAC_TOE_CONTRACT_URL;
    // TODO: Remove unnecessary duplicate fetch from contract URL.
    const TicTacToe: any = await this._contractClassFactoryService.create(
      pathToContract
    );
    const contractJSON = await this._contractClassFactoryService.loadContract(
      pathToContract
    );
    const data = contractJSON.bytecode;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<any> = new Promise((resolve, reject) =>
      TicTacToe.new({ ...txData, data }, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    const callResult = await callPromise;
    return this.getTransactionReceipt(callResult.transactionHash);
  }

  /**
   * Get game phase.
   */
  public getGamePhase(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<number> = new Promise((resolve, reject) =>
      contractInstance.gamePhase(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }

    /**
   * Get elapsed turns.
   */
  public getElapsedTurns(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<number> = new Promise((resolve, reject) =>
      contractInstance.elapsedTurns(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }

  /**
   * Get list of players who
   * joined the game.
   */
  public getPlayers(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<string[]> = new Promise((resolve, reject) =>
      contractInstance.players(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }

  /**
   * Get winning player of game.
   */
  public getWinner(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<string> = new Promise((resolve, reject) =>
      contractInstance.winner(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }

  /**
   * Get game board.
   */
  public getBoard(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<any> = new Promise((resolve, reject) =>
      contractInstance.board(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise.then(rawGameBoard => {
      const gameBoard = createGameBoard();
      for (let i = 0; i < 9; ++i) {
        const value = rawGameBoard[i].c[0];
        gameBoard.fields[i].value = value;
      }
      return Promise.resolve(gameBoard);
    });
  }

  /**
   * Join game as player.
   */
  public async join(): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<any> = new Promise((resolve, reject) =>
      contractInstance.join(txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }

  /**
   * Perform player turn.
   * @param x X position of field on board.
   * @param y Y position of field on board.
   */
  public playerTurn(x: number, y: number): Promise<any> {
    const contractInstance = this._currentContractRepository.contractInstance;
    const txData = this.createDefaultTransactionData();
    const callPromise: Promise<any> = new Promise((resolve, reject) =>
      contractInstance.playerTurn(x, y, txData, (err, result) => {
        if (!!err) {
          return reject(err);
        }
        resolve(result);
      })
    );
    return callPromise;
  }
}
