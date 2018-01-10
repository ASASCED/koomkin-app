import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FacturasPage,PagoPage,UsuarioPage } from '../index.paginas';


@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {

  Facturas: any;
  Pago: any;
  Usuario:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.Facturas = FacturasPage;
    this.Pago = PagoPage;
    this.Usuario = UsuarioPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatosPage');
  }

}
