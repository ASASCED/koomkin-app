import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  public monto;
  public diasRestantes;
  public dias;
  public selectedAmount = '250';
  public fechaActual;
  public leadsMesActual;
  public leadsMesPasado;
  public leadsMes;
  public oferta;
  public diasTranscurridos;
  public enabled;

    // reactivar
    public datosMembresia;
    public tarjeta = [];
    public periodo = [];
    public fin = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
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
        this.diasTranscurridos = data[0].duracion;
          if (this.recurrente == true) {
            this.getLeadLastMonth();
          }
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
        }
      );
  } 

  public getLeadLastMonth() {
    this.provedor.getLeadLastMonth()
      .then(
        (data) => {
          if (data[0]) {
            this.leadsMes = data;
            this.leadsMesPasado = this.leadsMes[0].LEADS;
            this.leadsMesActual = this.leadsMes[1].LEADS;
            if (this.leadsMesActual > 0) {
              if (this.diasTranscurridos > 0) {
                this.oferta = this.monto / (( this.leadsMesActual / this.diasTranscurridos) * 30);
              } 
              
              else {
                this.oferta = this.monto / this.leadsMesPasado;
              }
              console.log(this.oferta);
            }
          } else {
            console.log('vacio');
          }
        },
        (error) => {
          // console.log(error);
        });
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
          console.log(data);
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

  public upgradeMembership() {
    this.enabled = 1;
    console.log(this.id, this.idRecurrente, this.uuidRecurrente, this.selectedAmount, this.enabled, 'NULL' );
  }
}
