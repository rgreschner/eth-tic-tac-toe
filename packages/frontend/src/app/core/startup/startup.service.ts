import { Injectable } from '@angular/core';
import { Web3Service } from '../../ethereum-tk';

/**
 * Application startup service.
 */
@Injectable()
export class StartupService {
  constructor(private _web3Service: Web3Service) {}

  /**
   * Initialize service.
   */
  public initialize() {
    this._web3Service.initialize();
  }
}
