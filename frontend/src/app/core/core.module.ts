import { NgModule } from '@angular/core';
import { StartupService } from './startup/startup.service';
import { HttpClientModule } from '@angular/common/http';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameBoardFieldComponent } from './game-board/game-board-field.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutMainComponent } from './layout/layout-main.component';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home/home.page';
import { RouterModule } from '@angular/router';
import { StartPage } from './start/start.page';
import { PlayPage } from './play/play.page';
import { HeaderComponent } from './header/header.component';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { ApplyContractService } from './start/apply-contract.service';
import { EventAggregatorService } from '../shared/events/event-aggregator.service';
import { AppState } from '../shared/state/app.state';
import { StartGameService } from './start/start-game.service';
import { PlayGameService } from './start/play-game.service';
import { PlayerListComponent } from './play/player-list.component';
import { PlayerListItemComponent } from './play/player-list-item.component';
import { DevComponent } from './dev/dev.component';
import { MatDialogModule } from '@angular/material';
import { ErrorDialogComponent } from '../shared/error-handling/error-dialog.component';
import { GameInfoComponent } from './play/game-info.component';
import { GamePhaseDisplayComponent } from './play/game-phase-display.component';
import { GamePhaseToTextPipe } from './play/game-phase-to-text.pipe';
import { PlayerListWidgetComponent } from './play/player-list-widget.component';
import { AccountInfoWidgetComponent } from './play/account-info-widget.component';
import { GamePhaseToIconClassPipe } from './play/game-phase-to-icon-class.pipe';
import { SharedModule } from '../shared/shared.module';
import { DevPage } from './dev/dev.page';
import { EthereumTkModule } from '../ethereum-tk';

const IMPORTS = [
  CommonModule,
  NgReduxModule,
  FontAwesomeModule,
  FormsModule,
  RouterModule,
  HttpClientModule,
  MatDialogModule,
  EthereumTkModule,
  SharedModule
];

const PIPES = [DevPage, GamePhaseToTextPipe, GamePhaseToIconClassPipe];

const COMPONENTS = [
  HeaderComponent,
  GameBoardComponent,
  GameBoardFieldComponent,
  LayoutMainComponent,
  PlayerListItemComponent,
  PlayerListComponent,
  DevComponent,
  GameInfoComponent,
  GamePhaseDisplayComponent,
  PlayerListWidgetComponent,
  AccountInfoWidgetComponent
];

const PAGES = [StartPage, HomePage, PlayPage];

const SERVICES = [
  StartupService,
  StartGameService,
  PlayGameService
];

/**
 * Core module.
 */
@NgModule({
  imports: [...IMPORTS],
  declarations: [...PIPES, ...COMPONENTS, ...PAGES],
  providers: [...SERVICES],
  exports: [LayoutMainComponent]
})
export class CoreModule {
  constructor(
    startupService: StartupService,
    applyContractService: ApplyContractService,
    eventAggregatorService: EventAggregatorService,
    ngRedux: NgRedux<AppState>,
    startGameService: StartGameService,
    playGameService: PlayGameService
  ) {
    startupService.initialize();
    applyContractService.initialize();
    eventAggregatorService.event$.subscribe((action: any) =>
      ngRedux.dispatch(action)
    );
  }
}
