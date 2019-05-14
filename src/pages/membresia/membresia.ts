import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  public selectedAmount:any = '250';
  public fechaActual;
  public leadsMesActual;
  public leadsMesPasado;
  public leadsMes;
  public oferta;
  public ofertaLeads;
  public diasTranscurridos;
  public enabled;

  // reactivar
  public datosMembresia;
  public tarjeta = [];
  public periodo = [];
  public fin = [];

  //oferta 

  public primerOferta;
  public segundaOferta;
  public tercerOferta;

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
            let newSelectedAmount = parseInt(this.selectedAmount);
            this.leadsMes = data;
            this.leadsMesPasado = this.leadsMes[0].LEADS;
            this.leadsMesActual = this.leadsMes[1].LEADS;
            if(this.leadsMes.length > 0) {
              if (this.leadsMesActual > 0) {
                this.diasTranscurridos = 30 - parseInt(this.diasRestantes);
                if (this.diasTranscurridos > 0) {
                  this.oferta = Math.round(this.monto / (( this.leadsMesActual / this.diasTranscurridos) * 30));
                  this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
                  this.primerOferta = this.ofertaLeads;
                } 
                else {
                  this.oferta = this.monto / this.leadsMesPasado;
                  this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
                  this.primerOferta = this.ofertaLeads;
                }
              }
            } 
          } else {
            console.log('vacio');
          }
        },
        (error) => {
          // console.log(error);
        });
  } 

  onChangeAmount(oferta) {
    let newSelectedAmount = parseInt(this.selectedAmount);
    switch (oferta) {
      case 'first':
        this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
        this.primerOferta = this.ofertaLeads;
        break;
      case 'second':
        if(this.primerOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          this.segundaOferta = this.ofertaLeads;
        } else {
          this.ofertaLeads = (this.ofertaLeads * 2)
        }
        break;
      case 'three':
        if(this.segundaOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          this.tercerOferta = this.ofertaLeads;
        } else if (this.primerOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          this.ofertaLeads = (this.ofertaLeads * 4)
          this.tercerOferta = this.ofertaLeads; 
        } else {
          this.ofertaLeads = (this.ofertaLeads * 4)
        }        
        break;
      default:
    }
    
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

  public btnUpgradeMembership() {
    let newSelectedAmount = parseInt(this.selectedAmount);
    this.nuevoMonto = this.monto + newSelectedAmount;
    swal({
      title: '¿Estás seguro que deseas mejorar tu membresía?',
      text: 'En tu próximo pago tendrás un cargo de $' + this.nuevoMonto + 'MXN por un periodo de ' + this.periodo + ' días, a la tarjeta con terminación: ' + this.tarjeta,
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#2AB4BC',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.upgradeMembership();
      }
    });
  }  

  public upgradeMembership() {
    this.enabled = 1;
    console.log(this.id, this.idRecurrente, this.uuidRecurrente, this.selectedAmount, this.enabled, 'NULL' );
  }
}
