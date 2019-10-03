import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {

  Usuario: any = 'UsuarioPage';
  Email: any = 'ConfiguracionCrmPage';
  Social: any = 'ComercialPage';
  Pago: any = 'PagoPage';

  public empresa;
  public id;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

}
