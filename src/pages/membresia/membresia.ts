import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment } from '../../models/Payment';
import { UserProvider } from '../../providers/user/user';
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

  public page: string = "Membresia";
  public pages: Array<string> = ['Membresia', 'Facturacion', 'Servicio'];

  // facturacion
  public paymentData: Payment[];
  public invoiceData: Payment[];
  public dictionary = {};
  public vista;
  public stateId;
  public userFiscal;
  public nombre;
  public paterno;
  public materno;
  public calle;
  public ciudad;
  public cp;
  public colonia;
  public delegacion;
  public email;
  public estado;
  public f_materno;
  public f_paterno;
  public f_email;
  public f_nombre;
  public f_tel;
  public iddatosfiscales;
  public numeroexterior;
  public numerointerior;
  public razon;
  public rfc;
  public telefono;
  public celular;
  public uidf;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
    public modalCtrl: ModalController,
    public userService: UserProvider,
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
    this.vista = 'informacion';
    this.getPaymentData();
    this.initDictionary();
    this.authService.getUserFiscalData(this.id)
      .then(data => {
        this.authService.setUserFiscal(data[0]);
        this.userFiscal = data[0];
        this.nombre = this.userFiscal.NOMBRE;
        this.materno = this.userFiscal.APEMATERNO;
        this.paterno = this.userFiscal.APEPATERNO;
        this.calle = this.userFiscal.CALLE;
        this.ciudad = this.userFiscal.CIUDAD;
        this.cp = this.userFiscal.CODIGOPOSTAL;
        this.colonia = this.userFiscal.COLONIA;
        this.delegacion = this.userFiscal.DELEGACION;
        this.email = this.userFiscal.EMAIL;
        this.estado = this.userFiscal.ESTADO;
        this.f_materno = this.userFiscal.F_APEMATERNO;
        this.f_paterno = this.userFiscal.F_APEPATERNO;
        this.f_email = this.userFiscal.F_EMAIL;
        this.f_nombre = this.userFiscal.F_NOMBRE;
        this.f_tel = this.userFiscal.F_TELEFONO;
        this.iddatosfiscales = this.userFiscal.IDDATOSFISCALES;
        this.empresa = this.userFiscal.NOMEMPRESACOMPRADOR;
        this.numeroexterior = this.userFiscal.NUMEROEXTERIOR;
        this.numerointerior = this.userFiscal.NUMEROINTERNO;
        this.razon = this.userFiscal.RAZON_SOCIAL;
        this.rfc = this.userFiscal.RFC;
        this.telefono = this.userFiscal.TELEFONO;
        this.celular = this.userFiscal.TelefonoCelular;
        this.uidf = this.userFiscal.uidf;
      });
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

  public getState(name: string) {
    let result;
    for (const key in this.dictionary) {
      if (this.dictionary[key] === name) {
        result = key;
        return result;
      }
    }
    return result;
  }

  public initDictionary() {
    this.dictionary[2537] = 'Aguascalientes';
    this.dictionary[2538] = 'Baja California N';
    this.dictionary[2539] = 'Baja California S';
    this.dictionary[2540] = 'Campeche';
    this.dictionary[2541] = 'Chiapas';
    this.dictionary[2542] = 'Chihuahua';
    this.dictionary[2543] = 'Coahuila';
    this.dictionary[2544] = 'Colima';
    this.dictionary[2545] = 'Ciudad de México';
    this.dictionary[2546] = 'Durango';
    this.dictionary[2547] = 'Guanajuato';
    this.dictionary[2548] = 'Guerrero';
    this.dictionary[2549] = 'Hidalgo';
    this.dictionary[2550] = 'Jalisco';
    this.dictionary[2551] = 'Estado de México';
    this.dictionary[2552] = 'Michoacán';
    this.dictionary[2553] = 'Morelos';
    this.dictionary[2554] = 'Nayarit';
    this.dictionary[2555] = 'Nuevo León';
    this.dictionary[2556] = 'Oaxaca';
    this.dictionary[2557] = 'Puebla';
    this.dictionary[2558] = 'Querétaro';
    this.dictionary[2559] = 'Quintana Roo';
    this.dictionary[2560] = 'San Luis Potosí';
    this.dictionary[2561] = 'Sinaloa';
    this.dictionary[2562] = 'Sonora';
    this.dictionary[2563] = 'Tabasco';
    this.dictionary[2564] = 'Tamaulipas';
    this.dictionary[2565] = 'Tlaxcala';
    this.dictionary[2566] = 'Veracruz';
    this.dictionary[2567] = 'Yucatán';
    this.dictionary[2568] = 'Zacatecas';
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  public getPaymentData() {
    this.userService.userRequest('datosPagos?id=' + this.id)
      .then((payments: [Payment]) => {
        this.paymentData = payments;
        // // console.log(this.userFiscal);
        this.invoiceData = this.removeDuplicates(payments.filter(x => x.TieneFactura === '1'));
      })
      .catch(err => {
        console.error(err);
      });
  }

  public removeDuplicates(arr) {
    const filtrado = [];
    arr.forEach(function (itm) {
      let unique = true;
      filtrado.forEach(function (itm2) {
        if (itm.IDPago === itm2.IDPago) unique = false;
      });
      if (unique) filtrado.push(itm);
    });
    return filtrado;
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create('CancelarPage');
    modal.present();
  }

  public updateFiscal() {
    
    let stateId = this.getState(this.userFiscal.ESTADO);
    if (this.stateId !== undefined) {
      stateId = this.stateId;
    }
    const str =
      `actualizarFiscal?razon_social=${this.razon}&n_exterior=${this.numeroexterior}&n_interior=${this.numerointerior}` + `&cp=${this.cp}&calle=${this.calle}&colonia=${this.colonia}&ciudad=${this.ciudad}&delegacion=${this.delegacion}` + `&f_nombre=${this.f_nombre}&f_apaterno=${this.f_paterno}&f_amaterno=${this.f_materno}&f_email=${this.f_email}` +
      `&f_telefono=${this.f_tel}&uid=${this.authService.id}&rfc=${this.rfc}&estado=${stateId}&uidf=${this.uidf}`;
    // // console.log(str);
    this.userService.updateUserData(str)
      .then(res => {
        this.showSuccess();
      })
      .catch(err => {
        this.showError();
      });
  }

  public cambioInformacion() {
    const canal = 'app';
    const tipo = 'fiscales';
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/app/clickCambioInformacion/' + this.id + '/' + canal + '/' + tipo;
      this.http.get(url).subscribe(
        data => {
          resolve();
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  public showSuccess() {
    swal({
      title: 'Se ha guardado tu información con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showError() {
    swal({
      title: 'No se ha podido guardar tu información',
      text: 'Por favor complete los campos requeridos *',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

}
