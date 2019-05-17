import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-datos-financieros',
  templateUrl: 'datos-financieros.html',
})
export class DatosFinancierosPage {

  Pago: any = 'PagoPage';
  Membresia: any = 'MembresiaPage';

  public empresa;
  public id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {

    this.empresa = this.authService.empresa;
    this.id = this.authService.id;

  }

}
