import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BriefPage } from './../pages/brief/brief';
import { ReportePage } from './../pages/reporte/reporte';
import { FacturasPage } from './../pages/facturas/facturas';
import { UsuarioPage } from './../pages/usuario/usuario';
import { CancelarPage } from '../pages/cancelar/cancelar';
import { FacturaPage } from '../pages/factura/factura';
import { DatosPage } from '../pages/datos/datos';
import { PreguntaPage } from './../pages/pregunta/pregunta';
import { LoginPage } from './../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: NavController;

  rootPage: any = ReportePage;
    leads = ReportePage;
    reporte = HomePage;
    brief = BriefPage;
    datos = DatosPage;
    facturas = FacturasPage;
    usuario = UsuarioPage;
    factura = FacturaPage;
    cancelar = CancelarPage;
    pregunta = PreguntaPage;
    login = LoginPage;


  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private menuCtrl: MenuController ) {
    this.initializeApp();

    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Leads', component: HomePage },
      { title: 'Reporte', component: ListPage },
      { title: 'Brief', component: BriefPage },    
      { title: 'Reporte', component: ReportePage },
      { title: 'Datos', component: DatosPage },  
      { title: 'Facturas', component: FacturasPage },
      { title: 'Usuario', component: UsuarioPage },
      { title: 'Factura', component: FacturaPage },
      { title: 'Cancelar', component: CancelarPage },
      { title: 'Pregunta', component: PreguntaPage },
      { title: 'Login',component: LoginPage }


    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  pagina(pagina:any){
    this.nav.setRoot(pagina);
    this.menuCtrl.close();
  }
}
