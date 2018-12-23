import { NgModule } from '@angular/core';
import { ErrorDialogService } from './error-handling/error-dialog.service';
import { MatDialogModule } from '@angular/material';
import { ErrorDialogComponent } from './error-handling/error-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractApiService } from './game-contract/contract-api.service';
import { ContractClassFactoryService } from './game-contract/contract-class-factory.service';
import { ApplyContractService } from '../core/start/apply-contract.service';
import { CurrentContractRepository } from './game-contract/current-contract.repository';
import { EventAggregatorService } from './events/event-aggregator.service';

const IMPORTS = [
  CommonModule,
  FontAwesomeModule,
  FormsModule,
  MatDialogModule
];

const COMPONENTS = [
  ErrorDialogComponent
];

const SERVICES = [
  ErrorDialogService,
  ContractApiService,
  ContractClassFactoryService,
  ApplyContractService,
  CurrentContractRepository,
  EventAggregatorService
];

/**
 * Module containing shared functionality.
 */
@NgModule({
  imports: [...IMPORTS],
  declarations: [...COMPONENTS],
  providers: [...SERVICES],
  entryComponents: [ErrorDialogComponent],
  exports: [...COMPONENTS]
})
export class SharedModule {}
