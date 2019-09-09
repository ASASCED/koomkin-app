import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-membresia',
  templateUrl: 'membresia.html',
})
export class MembresiaPage {

  public empresa;
  public id;
  public recurrente;
  public idRecurrente;
  public uuidRecurrente;

  public fechaInicio;
  public nuevoMonto;
  public monto;
  public diasRestantes;
  public dias;
  
  public fechaActual;
  public leadsMesActual;
  public leadsMesPasado;
  public leadsMes;
  public oferta;
  public ofertaLeads;
  public diasTranscurridos;

  // reactivar
  public datosMembresia;
  public tarjeta = [];
  public periodo = [];
  public fin = [];

  //oferta 
  public primerOferta;
  public segundaOferta;
  public tercerOferta;

  public tieneUpgrade;
  public montoUpgrade;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.recurrente = this.authService.recurrente;
    this.idRecurrente = this.authService.idRecurrente;
    this.uuidRecurrente = this.authService.uuidRecurrente;
    this.getInicioCampana();
    this.getDiasRestantes();
    this.infoCard();
  }

  public getInicioCampana() {
    this.provedor.getInicioCampana().then(
      data => {
        if (data['length'] > 0) {
        this.fechaInicio = data[0].FInicio;
        this.dias = data[0].PenultimoDiasPagados;
        this.monto = data[0].Monto;
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
            if (result > 0) {
              this.diasRestantes = result + ' días';
            } else {
              this.diasRestantes = 'Renueva tu campaña';
            }
          } else {
            this.diasRestantes = 'Renueva tu campaña';
          }
        },
        (error) => {
          // console.log(error);
        }
      );
  } 


  public infoCard() {
    const cuerpo = `{'user_id': '${this.id}'}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/creditCardData';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          if(data['result'] !== 'error') {
            this.datosMembresia = data;
            this.tarjeta = data['credit_card'];       
            this.periodo = data['period'];
            this.fin = data['end_date'];
          }
        },
        err => {
            console.log(err);
        }
      );
    });
  }

}
