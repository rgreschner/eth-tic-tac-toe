import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './core/home/home.page';
import { StartPage } from './core/start/start.page';
import { PlayPage } from './core/play/play.page';
import { AppState } from './shared/state/app.state';
import {
  NgReduxModule,
  NgRedux,
  DevToolsExtension
} from '@angular-redux/store';
import { INITIAL_APP_STATE } from './shared/state/INITIAL_APP_STATE';
import { rootReducer } from './shared/state/root.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DevPage } from './core/dev/dev.page';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';

library.add(fas);

const appRoutes: Routes = [
  { path: 'play', component: PlayPage },
  { path: 'start', component: StartPage },
  { path: 'home', component: HomePage },
  { path: 'dev', component: DevPage },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

const IMPORTS = [
  LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
  BrowserAnimationsModule,
  FontAwesomeModule,
  CoreModule,
  FormsModule,
  NgReduxModule,
  RouterModule.forRoot(appRoutes)
];

/**
 * Application module.
 */
@NgModule({
  imports: [...IMPORTS],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>, devTools: DevToolsExtension) {
    let enhancers = [];
    if (devTools.isEnabled()) {
      enhancers = [...enhancers, devTools.enhancer()];
    }
    ngRedux.configureStore(rootReducer, INITIAL_APP_STATE, [], enhancers);
  }
}
