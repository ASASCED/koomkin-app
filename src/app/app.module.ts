import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BriefPageModule } from '../pages/brief/brief.module'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReportePage } from '../pages/reporte/reporte';
import { LeadsComponent } from './../components/leads/leads';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReportePage,
    LeadsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BriefPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ReportePage,
    LeadsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
