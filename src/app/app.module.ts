import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { File } from '@ionic-native/file';
import { StreamingMedia } from '@ionic-native/streaming-media'
import { SwipeSegmentDirective } from '../directives/swipe-segment/swipe-segment';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import {FileOpener } from '@ionic-native/file-opener';
//import {FileChooser} from '@ionic-native/file-chooser';
//import {FilePath} from '@ionic-native/file-path';

//import { OneSignal } from '@ionic-native/onesignal';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { MyApp } from './app.component';
import { ReportePageModule } from '../pages/reporte/reporte.module'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LeadsPage } from '../pages/leads/leads';
import { PagoPage } from './../pages/pago/pago';
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
import { HotelComponent } from '../components/hotel/hotel';
import { RestauranteComponent } from '../components/restaurante/restaurante';
import { InmobiliariaComponent } from '../components/inmobiliaria/inmobiliaria';
import { ProfesionistaComponent } from '../components/profesionista/profesionista';
import { MedicoComponent } from '../components/medico/medico';
import { PuntoventaComponent } from '../components/puntoventa/puntoventa';
import { ProveedorComponent } from '../components/proveedor/proveedor';
import { ServicioComponent } from '../components/servicio/servicio';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { RelativeTimePipe} from "../pipes/relative-time/relative-time";
import { UserProvider } from '../providers/user/user';
//import { PushnotificationProvider } from '../providers/pushnotification/pushnotification';
import { BannerComponent } from '../components/banner/banner';
import { ModalNotificationPage } from '../pages/modal-notification/modal-notification';
import { InicioPage } from '../pages/inicio/inicio';
import { EficienciaPage } from '../pages/eficiencia/eficiencia';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CapitalizePipe } from '../pipes/capitalize/capitalize';
import { Market } from '@ionic-native/market';
import { ModalSurveyPage } from '../pages/modal-survey/modal-survey';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

@NgModule({
  declarations: [
    MyApp,
    LeadsPage,
    DatosPage,
    FacturasPage,
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LeadPage,
    LoginPage,
    InicioPage,
    EficienciaPage,
    HotelComponent,
    PuntoventaComponent,
    MedicoComponent,
    InmobiliariaComponent,
    ServicioComponent,
    ProfesionistaComponent,
    RestauranteComponent,
    ProveedorComponent,
    BannerComponent,
    SwipeSegmentDirective,
    RelativeTimePipe,
    CapitalizePipe,
    ModalNotificationPage,
    ModalSurveyPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReportePageModule,
    Ng2GoogleChartsModule,
    IonicStorageModule.forRoot(),
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
    PagoPage,
    UsuarioPage,
    FacturaPage,
    CancelarPage,
    PreguntaPage,
    LeadPage,
    LoginPage,
    InicioPage,
    EficienciaPage,
    HotelComponent,
    PuntoventaComponent,
    MedicoComponent,
    InmobiliariaComponent,
    ServicioComponent,
    ProfesionistaComponent,
    RestauranteComponent,
    ProveedorComponent,
    BannerComponent,
    ModalNotificationPage,
    ModalSurveyPage
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    RestProvider,
    AuthServiceProvider,
    UserProvider,
    StreamingMedia,
    ScreenOrientation,
    Market,
   // OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChatServiceProvider,
    UserProvider,
    File,
    FileOpener,
    //FileChooser,
    //FilePath,
    Transfer,
    //PushnotificationProvider
  ]
})
export class AppModule {}
