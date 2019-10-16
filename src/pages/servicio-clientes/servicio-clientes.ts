import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-servicio-clientes',
  templateUrl: 'servicio-clientes.html',
})
export class ServicioClientesPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicioClientesPage');
  }

  launchMessenger() {
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open('https://m.me/Koomkin', "_system", "location=no");
    });
  }

  launchWA() {
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open('https://wa.me/525585268341', "_system", "location=no");
    });
  }

}
