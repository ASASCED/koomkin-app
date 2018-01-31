import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from './../pages/login/login';
import { LeadsPage } from './../pages/leads/leads';
import { LeadPage } from './../pages/lead/lead';
import { ReportePage } from './../pages/reporte/reporte';
import { UsuarioPage } from './../pages/usuario/usuario';
import { FacturasPage } from './../pages/facturas/facturas';
import { FacturaPage } from '../pages/factura/factura';
import { DatosPage } from '../pages/datos/datos';
import { CancelarPage } from '../pages/cancelar/cancelar';
import { PreguntaPage } from './../pages/pregunta/pregunta';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: NavController;

  rootPage: any = LoginPage;
  leads = LeadsPage;
  reporte = ReportePage;
  datos = DatosPage;
  facturas = FacturasPage;
  usuario = UsuarioPage;
  factura = FacturaPage;
  cancelar = CancelarPage;
  pregunta = PreguntaPage;
  login = LoginPage;
  lead = LeadPage;


  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private menuCtrl: MenuController) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Reporte', component: ReportePage },
      { title: 'Leads', component: LeadsPage },
      { title: 'Datos', component: DatosPage },
      { title: 'Facturas', component: FacturasPage },
      { title: 'Usuario', component: UsuarioPage },
      { title: 'Factura', component: FacturaPage },
      { title: 'Cancelar', component: CancelarPage },
      { title: 'Pregunta', component: PreguntaPage },
      { title: 'Lead', component: LeadPage },
      { title: 'Login', component: LoginPage }
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

  pagina(pagina: any) {
    this.nav.setRoot(pagina);
    this.menuCtrl.close();
  }
}
