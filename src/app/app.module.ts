import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NativeAudio } from '@ionic-native/native-audio';
import { StreamingMedia } from '@ionic-native/streaming-media';


import { MyApp } from './app.component';
import { ReportePageModule } from '../pages/reporte/reporte.module'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LeadsPage } from '../pages/leads/leads';
import { PagoPage } from './../pages/pago/pago';
import { FiscalesPage } from '../pages/fiscales/fiscales';
import { FacturasPage } from './../pages/facturas/facturas';
import { DatosPage } from './../pages/datos/datos';
import { UsuarioPage } from './../pages/usuario/usuario';
import { FacturaPage } from './../pages/factura/factura';
import { CancelarPage } from './../pages/cancelar/cancelar';
import { PreguntaPage } from './../pages/pregunta/pregunta';
import { LoginPage } from '../pages/login/login';
import { LeadPage } from '../pages/lead/lead';
import { RestProvider } from './../providers/rest/rest';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    MyApp,
    LeadsPage,
    DatosPage,
    FacturasPage,
    FiscalesPage,
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LeadPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReportePageModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: 'Regresar',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LeadsPage,
    DatosPage,
    FacturasPage,
    FiscalesPage,
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LeadPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    RestProvider,
    AuthServiceProvider,
    NativeAudio,
    StreamingMedia,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
