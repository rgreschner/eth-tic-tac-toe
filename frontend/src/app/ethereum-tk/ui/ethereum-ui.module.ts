import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { COMPONENTS } from './ng-components.const';

const IMPORTS = [CommonModule, FontAwesomeModule, FormsModule];

/**
 * Ethereum Toolkit UI Module.
 */
@NgModule({
  imports: [...IMPORTS],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class EthereumUIModule {}
