import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FacturaPage } from '../factura/factura';

@IonicPage()
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})
export class FacturasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    
  }

 navegarPagina(){
   this.navCtrl.push(FacturaPage);
 }

 ionViewDidLoad() {
  console.log('ionViewDidLoad FacturasPage');
}

mostrar_modal(){
  let modal = this.modalCtrl.create( FacturaPage );
  modal.present();
}

}
