import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BriefPage } from './../pages/brief/brief';
import { ReportePage } from './../pages/reporte/reporte';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: NavController;

  rootPage: any = HomePage;
    leads = HomePage;
    reporte = ReportePage;
    brief = BriefPage;


  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Leads', component: HomePage },
      { title: 'Reporte', component: ListPage },
      { title: 'Brief', component: BriefPage },    
      { title: 'Reporte', component: ReportePage }     
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
  }
}
