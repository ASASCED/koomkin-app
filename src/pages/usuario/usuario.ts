import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  App
} from "ionic-angular";
import { CancelarPage } from "./../cancelar/cancelar";
import { Payment } from "../../models/Payment";
import { UserProvider } from "../../providers/user/user";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import swal from 'sweetalert2';
import { ModalSurveyPage } from '../../pages/modal-survey/modal-survey';

@IonicPage()
@Component({
  selector: "page-usuario",
  templateUrl: "usuario.html"
})
export class UsuarioPage implements OnInit {
  public paymentData: Payment[];
  public invoiceData: Payment[];
  public dictionary = {};
  public vista;
  public stateId;

  public id;
  public fakeUserId = 8925;
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
  public empresa;
  public numeroexterior;
  public numerointerior;
  public razon;
  public rfc;
  public telefono;
  public celular;
  public uidf;
  public uuid;
  public mensaje = "";
  public recurrente;
  public cancelar;
  public dias;
  public notificacion;
  public idReporteBanner;
  public uuidPase;
  public tipo;

  // reactivar
  public datosMembresia;
  public monto = [];
  public tarjeta = [];
  public periodo = [];
  public fin = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public userService: UserProvider,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public app: App
  ) {
    this.id = this.authService.id;
    this.recurrente = this.authService.recurrente;
    console.log( this.recurrente);
    this.tipo = "13";
    this.cancelar = this.authService.cancelar;
    console.log( this.cancelar);

  }

  ngOnInit() {
    this.vista = "informacion";
    this.getPaymentData();
    this.initDictionary();
    this.infoCard();
    this.uuid = this.authService.getClientUUID();
    this.mensaje = this.authService.mensajebot;

    this.authService.getUserFiscalData(this.id).then(data => {
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
    this.dictionary[2537] = "Aguascalientes";
    this.dictionary[2538] = "Baja California N";
    this.dictionary[2539] = "Baja California S";
    this.dictionary[2540] = "Campeche";
    this.dictionary[2541] = "Chiapas";
    this.dictionary[2542] = "Chihuahua";
    this.dictionary[2543] = "Coahuila";
    this.dictionary[2544] = "Colima";
    this.dictionary[2545] = "Ciudad de México";
    this.dictionary[2546] = "Durango";
    this.dictionary[2547] = "Guanajuato";
    this.dictionary[2548] = "Guerrero";
    this.dictionary[2549] = "Hidalgo";
    this.dictionary[2550] = "Jalisco";
    this.dictionary[2551] = "Estado de México";
    this.dictionary[2552] = "Michoacán";
    this.dictionary[2553] = "Morelos";
    this.dictionary[2554] = "Nayarit";
    this.dictionary[2555] = "Nuevo León";
    this.dictionary[2556] = "Oaxaca";
    this.dictionary[2557] = "Puebla";
    this.dictionary[2558] = "Querétaro";
    this.dictionary[2559] = "Quintana Roo";
    this.dictionary[2560] = "San Luis Potosí";
    this.dictionary[2561] = "Sinaloa";
    this.dictionary[2562] = "Sonora";
    this.dictionary[2563] = "Tabasco";
    this.dictionary[2564] = "Tamaulipas";
    this.dictionary[2565] = "Tlaxcala";
    this.dictionary[2566] = "Veracruz";
    this.dictionary[2567] = "Yucatán";
    this.dictionary[2568] = "Zacatecas";
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  public getPaymentData() {
    this.userService
      .userRequest("/datosPagos?id=" + this.id)
      .then((payments: [Payment]) => {
        this.paymentData = payments;
        // // console.log(this.userFiscal);
        this.invoiceData = this.removeDuplicates(
          payments.filter(x => x.TieneFactura === "1")
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  public removeDuplicates(arr) {
    const filtrado = [];
    arr.forEach(function(itm) {
      let unique = true;
      filtrado.forEach(function(itm2) {
        if (itm.IDPago === itm2.IDPago) unique = false;
      });
      if (unique) filtrado.push(itm);
    });
    return filtrado;
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(CancelarPage);
    modal.present();
  }

  updateUser() {
    const str =
      `actualizarUsuario?nombre=${this.nombre}&apaterno=${
        this.paterno
      }&amaterno=${this.materno}&empresa=` +
      `${this.empresa}&email=${this.email}&telefono=${this.telefono}&celular=${
        this.celular
      }` +
      `&uid=${this.id}`;
    // // console.log(str);
    this.userService
      .updateUserData(str)
      .then(res => {
       // this.mostrarGuardado("Se ha guardado tu información con éxito ");
        this.showSuccess();
      })
      .catch(err => {
       // this.mostrarGuardado("No se ha podido guardar tu información");
       this.showError();
      });
  }

  updateMessage(mensaje) {
    const body = new URLSearchParams();
    body.set("id", this.uuid);
    body.set("mensaje", mensaje);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = "hhttps://koomkin.com.mx/call-tracking/api/v1/extra-info/";
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve();
        },
        err => {
          return resolve(err);
        }
      );
    });
  }

  public cambiarMensaje(mensaje) {
    return new Promise((resolve, reject) => {
      const url =
        "https://www.koomkin.com.mx/api/app/cambiarMensaje/" +
        this.id +
        "/App/" +
        mensaje;
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

  public cambioInformacion(tipo) {
    const canal = "app";

    return new Promise((resolve, reject) => {
      const url = "https://www.koomkin.com.mx/api/app/clickCambioInformacion/" + this.id + "/" + canal + "/" + tipo;
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

  public cambioAnidado() {
    this.cambioInformacion("general");
    this.cambioInformacion("call-tracking");
    this.cambioInformacion("chat-bot");
  }

  mostrarGuardado(title) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      buttons: [
        {
          text: "Ok",
          handler: data => {
            //this.page = 'Lead';
            //this.content.resize();
          }
        }
      ]
    });
    alert.present();
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

  mostrar_encuesta() {
  // this.navCtrl.setRoot(ModalSurveyPage, { tipo: this.tipo });
    this.app.getRootNav().setRoot(ModalSurveyPage, { tipo: this.tipo }); 
  }

  public btnReactivar() {
    swal({
      title: '¿Estás seguro que deseas reactivar tu Membresía?',
      text: 'Vamos a realizarte el cobro de $' + this.monto + 'MXN por un periodo de ' + this.periodo + ' días a la tarjeta con terminación: ' + this.tarjeta,
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.reinstateMembershipOP();
      }
    });
  }  

  public reinstateMembershipOP () {
    const cuerpo = `{'idusuario': '${this.id}'}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/reinstateRecurringPayments';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          console.log(data);
          if (data['result'] == 'OK') {
            this.showSuccessReinstate();
            resolve();
          } else if (data['result'] == 'error') {
              this.showErrorReinstate();
          }
          resolve();
        },
        err => {
            console.log(err);
            this.showErrorReinstate();
        }
      );
    });
  }

  public showSuccessReinstate() {
    swal({
      title: 'Se ha reactivado su suscripción con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showErrorReinstate() {
    swal({
      title: 'No se ha podido reactivar su suscripción',
      text: 'Por favor comuniquese a Servicio a Cliente para más información',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
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
            this.monto = data['amount'];
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
