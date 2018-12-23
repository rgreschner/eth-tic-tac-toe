import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from '../../ethereum-tk';
import { take } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

/**
 * Factory responsible for creation of
 * contract class objects.
 */
@Injectable()
export class ContractClassFactoryService {
  constructor(
    private _logger: NGXLogger,
    private _web3Service: Web3Service,
    private _httpClient: HttpClient
  ) {}

  /**
   * Load contract from JSON.
   * @param path Path to contract JSON.
   */
  public async loadContract(path: string) {
    this._logger.debug(`Loading contract from ${path}.`);
    const result: any = await this._httpClient
      .get(path)
      .pipe(take(1))
      .toPromise();
    this._logger.debug(`Loaded contract from ${path}.`);
    return result;
  }

  /**
   * Create contract class from JSON.
   * @param path Path to contract JSON.
   */
  public async create(path: string) {
    this._logger.debug(`Creating contract from ${path}.`);
    const web3 = this._web3Service.web3;
    const contractJSON = await this.loadContract(path);
    const contractABI = contractJSON.abi;
    // Actually create contract from ABI.
    const ContractClass = web3.eth.contract(contractABI);
    this._logger.debug(`Created contract from ${path}.`);
    return ContractClass;
  }
}
