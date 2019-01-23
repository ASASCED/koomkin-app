import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CancelarPage } from './../cancelar/cancelar';
import { Payment } from '../../models/Payment';
import { UserProvider } from '../../providers/user/user';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { CookieXSRFStrategy } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
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
  public mensaje = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public userService: UserProvider,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public http: HttpClient) {
      this.id = this.authService.id;
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getPaymentData();
    this.initDictionary();
    this.uuid = this.authService.getClientUUID();
    this.mensaje = this.authService.mensajebot;

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
        // console.log(this.userFiscal);
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
    let modal = this.modalCtrl.create(CancelarPage);
    modal.present();
  }

  updateUser() {
    const str =
      `actualizarUsuario?nombre=${this.nombre}&apaterno=${this.paterno}&amaterno=${this.materno}&empresa=`+`${this.empresa}&email=${this.email}&telefono=${this.telefono}&celular=${this.celular}` + `&uid=${this.id}`;
      // console.log(str);
    this.userService.updateUserData(str)
      .then(res => {
        this.mostrarGuardado(
          "Se ha guardado tu información con éxito "
        );
      })
      .catch(err => {
        this.mostrarGuardado(
          "No se ha podido guardar tu información"
        );
      });
  }

  updateMessage(mensaje) {
    
    const body = new URLSearchParams();
    body.set('id', this.uuid);
    body.set('mensaje', mensaje);

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    const url = 'http://www.koomkin.com:4829/twilio_api/api/v1/extra-info/';
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options)
        .subscribe(data => {
          
          return resolve();
        }, err => {
          
          return resolve(err);
        });
    });
  }

  public cambiarMensaje(mensaje) {

    return new Promise((resolve, reject) => {
      const url = "http://www.koomkin.com:4859/cambiarMensaje/" + this.id + '/App/' + mensaje;
      this.http.get(url).subscribe(
        data => {
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public cambioInformacion(tipo) {
    const canal = 'app';

    return new Promise((resolve, reject) => {
      const url = 'http://www.koomkin.com:4859/clickCambioInformacion/' + this.id + '/' + canal + '/' + tipo;
      this.http.get(url).subscribe(
        data => {
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public cambioAnidado() {
    this.cambioInformacion('general');
    this.cambioInformacion('call-tracking');
    this.cambioInformacion('chat-bot');
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

}
