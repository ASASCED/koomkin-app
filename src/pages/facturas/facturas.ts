import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FacturaPage } from '../factura/factura';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})


export class FacturasPage {
  
  public empresa;
  public id;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public authService: AuthServiceProvider) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
}
  navegarPagina() {
    this.navCtrl.push(FacturaPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacturasPage');
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(FacturaPage);
    modal.present();
  }

}
