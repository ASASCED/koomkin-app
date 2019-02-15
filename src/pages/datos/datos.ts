import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FacturasPage, PagoPage, UsuarioPage } from '../index.paginas';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
<<<<<<< HEAD
=======
import { SocialPage } from '../social/social';
import { EmailPage } from '../email/email';
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {

  Facturas: any;
  Pago: any;
  Usuario: any;
<<<<<<< HEAD
=======
  Email: any;
  Social: any;

>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
  public empresa;
  public id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {

    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.Facturas = FacturasPage;
    this.Pago = PagoPage;
    this.Usuario = UsuarioPage;
<<<<<<< HEAD

=======
    this.Social = SocialPage;
    this.Email = EmailPage;
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatosPage');
  }

}
