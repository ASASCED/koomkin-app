import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from './../../providers/rest/rest';
import { getDate } from 'date-fns';

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
  public selectedSegment = 'first';
  public fechaActual;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public authService: AuthServiceProvider,
              public provedor: RestProvider) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.getInicioCampana();
    this.getDiasRestantes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembresiaPage');
  }

  public getInicioCampana() {
    this.provedor.getInicioCampana().then(
      data => {
        console.log(data[0]);
        if (data['length'] > 0) {
        this.fechaInicio = data[0].FInicio;
        this.dias = data[0].PenultimoDiasPagados;
        this.monto = data[0].Monto;
        console.log(data[0]);
        }
      },
      err => {
        // console.log('error');
      }
    );
  }

  public getDiasRestantes() {
    this.provedor.getDiasRestantes()
      .then(
        (data) => {
          if (data[0]) {
            let result = data[0].DIAS_RESTANTES;
            console.log(result);
            if (result > 0) {
              this.diasRestantes = result + ' días';
            } else {
              this.diasRestantes = 'Renueva tu campaña';
            }
          } else {
            this.diasRestantes = "Renueva tu campaña";
          }
        },
        (error) => {
          // console.log(error);
        });
  } 

}
