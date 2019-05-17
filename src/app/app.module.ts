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
import { FileOpener } from '@ionic-native/file-opener';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MyApp } from './app.component';
import { ReportePageModule } from '../pages/reporte/reporte.module'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from './../providers/rest/rest';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { RelativeTimePipe} from "../pipes/relative-time/relative-time";
import { UserProvider } from '../providers/user/user';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CapitalizePipe } from '../pipes/capitalize/capitalize';
import { Market } from '@ionic-native/market';
import { Transfer } from '@ionic-native/transfer';
import { HTTP } from '@ionic-native/http';
import { Clipboard } from '@ionic-native/clipboard';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReportePageModule,
    Ng2GoogleChartsModule,
    SweetAlert2Module.forRoot(),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      backButtonText: 'Regresar',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md',
      monthNames:['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthShortNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
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
    Clipboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ChatServiceProvider,
    UserProvider,
    File,
    FileOpener,
    Transfer,
    HTTP
  ]
})
export class AppModule {}
