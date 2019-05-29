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
    public http: HttpClient,
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.recurrente = this.authService.recurrente;
    this.idRecurrente = this.authService.idRecurrente;
    this.uuidRecurrente = this.authService.uuidRecurrente;
   // this.idRecurrente = 1026;
   // this.uuidRecurrente = 'a565d7c9-f5b1-40ed-9a63-eea3418f9a2e';
    this.getLastUpdateMembership();
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
            if(this.leadsMes.length == 1) {
              this.leadsMesActual = this.leadsMes[0].LEADS;
            } else if (this.leadsMes.length == 2) {
              this.leadsMesPasado = this.leadsMes[0].LEADS;
              this.leadsMesActual = this.leadsMes[1].LEADS;
            }
            if (this.leadsMesActual > 0) {
              if(parseInt(this.diasRestantes) > 30) {
                this.diasTranscurridos = 61 - parseInt(this.diasRestantes);
              } else {
                this.diasTranscurridos = 30 - parseInt(this.diasRestantes);
              }
              if (this.diasTranscurridos > 0) {
                let estimado = (( this.leadsMesActual / this.diasTranscurridos) * 30);
                console.log('Pago',this.monto);
                console.log('Estimado de leads',estimado);
                this.oferta = Math.round(this.monto / estimado);
                console.log('Costo por lead',this.oferta)
                this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
                console.log('Nueva inversión',newSelectedAmount);
                console.log('Clientes Potenciales',this.ofertaLeads);
                this.primerOferta = this.ofertaLeads;
                if( this.ofertaLeads < 4) {
                  this.ofertaLeads = 4;
                }
              } else {
                this.oferta = this.monto / this.leadsMesPasado;
                this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
                this.primerOferta = this.ofertaLeads;
                if( this.ofertaLeads < 4) {
                  this.ofertaLeads = 4;
                }
              }
            }
            console.log(this.ofertaLeads );
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
        if( this.ofertaLeads < 4) {
          this.ofertaLeads = 4;
        }
        this.primerOferta = this.ofertaLeads;
        break;
      case 'second':
        if(this.primerOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          if( this.ofertaLeads < 8 ) {
            this.ofertaLeads = 8;
          } else if (this.ofertaLeads >= 12){
            this.ofertaLeads = 8;
          }
        } else {
          this.ofertaLeads = (this.primerOferta * 2)
          if( this.ofertaLeads < 8) {
            this.ofertaLeads = 8;
          } else if (this.ofertaLeads >= 12 && this.primerOferta < 8){
            this.ofertaLeads = 8;
          }
          this.segundaOferta = this.ofertaLeads;
        }
        break;
      case 'three':
        if(this.segundaOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          this.tercerOferta = this.ofertaLeads;
          if( this.ofertaLeads < 12) {
            this.ofertaLeads = 12;
          }  else if (this.ofertaLeads >= 16){
            this.ofertaLeads = 12;
          }
        } else if (this.primerOferta == 0) {
          this.ofertaLeads = Math.round(newSelectedAmount/this.oferta);
          this.ofertaLeads = (this.ofertaLeads * 2)
          this.tercerOferta = this.ofertaLeads; 
          if( this.ofertaLeads < 12) {
            this.ofertaLeads = 12;
          } else if (this.ofertaLeads >= 16){
            this.ofertaLeads = 12;
          }
        } else {
          this.ofertaLeads = (this.segundaOferta * 2)
          if( this.ofertaLeads < 12) {
            this.ofertaLeads = 12;
          } else if (this.ofertaLeads >= 16 && this.segundaOferta < 12){
            this.ofertaLeads = 12;
          }
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
      title: 'Confirma el incremento de $' + newSelectedAmount + 'MXN',
      text: 'Además tomaremos este monto para tu nueva Membresía',
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#2AB4BC',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.getUpgradeMembership();
        this.getInsertUpgradeMembresia();
      }
    });
  }  

  public immediateUpsell() {
    const cuerpo = `{'user_id': '${this.id}', 'upsell_id': '${this.id}'}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/immediateUpsell';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          console.log(resolve);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  public getUpgradeMembership() {
    this.provedor.getUpdateMembership(this.idRecurrente, this.uuidRecurrente, this.selectedAmount) 
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  
  public btnCancelMembership() {
    swal({
      title: '¿Estás seguro que deseas cancelar tu última inversión de $' + this.montoUpgrade + 'MXN ?',
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#2AB4BC',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.getCancelUpgradeMembership();
      }
    });
  }  

  public getCancelUpgradeMembership() {
    this.provedor.getCancelUpdateMembership(this.idRecurrente) 
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getLastUpdateMembership() {
    this.provedor.getLastUpdateMembership(this.idRecurrente,this.uuidRecurrente) 
      .then(
        (data) => {
          console.log(data);
          if(data[0]) {
            this.tieneUpgrade = data[0].Enabled;
            this.montoUpgrade = data[0].Amount;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getInsertUpgradeMembresia() {
    let acceso = 'pagina';

    this.provedor.getInsertUpgradeMembresia(this.id, this.idRecurrente, acceso)
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
