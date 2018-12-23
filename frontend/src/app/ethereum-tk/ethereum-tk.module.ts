import { NgModule } from '@angular/core';
import { EthereumUIModule } from './ui/ethereum-ui.module';
import { COMPONENTS } from './ui/ng-components.const';
import { SERVICES } from './ng-services.const';

const IMPORTS = [EthereumUIModule];

/**
 * Ethereum Toolkit Module.
 */
@NgModule({
  imports: [...IMPORTS],
  providers: [...SERVICES],
  exports: [...COMPONENTS]
})
export class EthereumTkModule {}
