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
import { PagoPage } from './../pages/pago/pago';
import { FiscalesPage } from '../pages/fiscales/fiscales';
import { FacturasPage } from './../pages/facturas/facturas';
import { DatosPage } from './../pages/datos/datos';
import { UsuarioPage } from './../pages/usuario/usuario';
import { FacturaPage } from './../pages/factura/factura';
import { CancelarPage } from './../pages/cancelar/cancelar';
import { PreguntaPage } from './../pages/pregunta/pregunta';
import { LoginPage } from '../pages/login/login';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReportePage,
    LeadsComponent,
    DatosPage,
    FacturasPage,
    FiscalesPage,
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LoginPage
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
    LeadsComponent,
    DatosPage,
    FacturasPage,
    FiscalesPage,
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
