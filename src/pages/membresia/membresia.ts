import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from './../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-membresia',
  templateUrl: 'membresia.html',
})
export class MembresiaPage {

  public empresa;
  public id;
  public fechaInicio;
  public monto;
  public diasRestantes;
  public dias;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public authService: AuthServiceProvider,
              public provedor: RestProvider) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.getInicioCampana();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembresiaPage');
  }

  public getInicioCampana() {
    this.provedor.getInicioCampana().then(
      data => {
        console.log(data[0]);
        if (data['length'] > 0) {
        this.fechaInicio = data[0].inicioCampana;
        this.dias = data[0].PenultimoDiasPagados;
        this.monto = data[0].Monto;
        this.diasRestantes = data[0].duracion;
        if ( this.diasRestantes == 0) {
          this.diasRestantes = 'Renueva tu campaña';
        }
        console.log(data[0]);
        }
      },
      err => {
        // console.log('error');
      }
    );
  }

}
