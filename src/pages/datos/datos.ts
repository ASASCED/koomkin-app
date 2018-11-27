import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FacturasPage, PagoPage, UsuarioPage } from '../index.paginas';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {

  Facturas: any;
  Pago: any;
  Usuario: any;
  public empresa;
  public id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {

    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.Facturas = FacturasPage;
    this.Pago = PagoPage;
    this.Usuario = UsuarioPage;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatosPage');
  }

}
