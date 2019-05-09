import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FacturasPage, PagoPage, UsuarioPage } from '../index.paginas';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SocialPage } from '../social/social';
import { EmailPage } from '../email/email';
import { MembresiaPage } from '../membresia/membresia';

@IonicPage()
@Component({
  selector: 'page-datos-financieros',
  templateUrl: 'datos-financieros.html',
})
export class DatosFinancierosPage {

  Facturas: any;
  Pago: any;
  Usuario: any;
  Email: any;
  Social: any;
  Membresia: any;

  public empresa;
  public id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {

    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.Facturas = FacturasPage;
    this.Pago = PagoPage;
    this.Usuario = UsuarioPage;
    this.Social = SocialPage;
    this.Email = EmailPage;
    this.Membresia = MembresiaPage;
  }

}
