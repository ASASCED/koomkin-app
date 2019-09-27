import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Payment } from '../../models/Payment';
import { UserProvider } from '../../providers/user/user';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-pago',
  templateUrl: 'pago.html',
})
export class PagoPage implements OnInit{

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
    this.authService.getUserFiscalData(this.id)
      .then(data => {
        this.authService.setUserFiscal(data[0]);
        this.userFiscal = data[0];
        this.nombre = this.userFiscal.NOMBRE;
        if(this.nombre == null || this.nombre == 'null' || this.nombre == 'NULL' || this.nombre == 'Null') {
          this.nombre = '';
        }
        this.materno = this.userFiscal.APEMATERNO;
        if(this.materno == null || this.materno == 'null' || this.materno == 'NULL' || this.materno == 'Null') {
          this.materno = '';
        }
        this.paterno = this.userFiscal.APEPATERNO;
        if(this.paterno == null || this.paterno == 'null' || this.paterno == 'NULL' || this.paterno == 'Null') {
          this.paterno = '';
        }
        this.calle = this.userFiscal.CALLE;
        if(this.calle == null || this.calle == 'null' || this.calle == 'NULL' || this.calle == 'Null') {
          this.calle = '';
        }
        this.ciudad = this.userFiscal.CIUDAD;
        if(this.ciudad == null || this.ciudad == 'null' || this.ciudad == 'NULL' || this.ciudad == 'Null') {
          this.ciudad = '';
        }
        this.cp = this.userFiscal.CODIGOPOSTAL;
        if(this.cp == null || this.cp == 'null' || this.cp == 'NULL' || this.cp == 'Null') {
          this.cp = '';
        }
        this.colonia = this.userFiscal.COLONIA;
        if(this.colonia == null || this.colonia == 'null' || this.colonia == 'NULL' || this.colonia == 'Null') {
          this.colonia = '';
        }
        this.delegacion = this.userFiscal.DELEGACION;
        if(this.delegacion == null || this.delegacion == 'null' || this.delegacion == 'NULL' || this.delegacion == 'Null') {
          this.delegacion = '';
        }
        this.email = this.userFiscal.EMAIL;
        this.estado = this.userFiscal.ESTADO;
        if(this.estado == null || this.estado == 'null' || this.estado == 'NULL' || this.estado == 'Null') {
          this.estado = '';
        }
        this.f_materno = this.userFiscal.F_APEMATERNO;
        this.f_paterno = this.userFiscal.F_APEPATERNO;
        this.f_email = this.userFiscal.F_EMAIL;
        this.f_nombre = this.userFiscal.F_NOMBRE;
        this.f_tel = this.userFiscal.F_TELEFONO;
        this.iddatosfiscales = this.userFiscal.IDDATOSFISCALES;
        this.empresa = this.userFiscal.NOMEMPRESACOMPRADOR;
        this.numeroexterior = this.userFiscal.NUMEROEXTERIOR;
        if(this.numeroexterior == null || this.numeroexterior == 'null' || this.numeroexterior == 'NULL' || this.numeroexterior == 'Null') {
          this.numeroexterior = '';
        }
        this.numerointerior = this.userFiscal.NUMEROINTERNO;
        if(this.numerointerior == null || this.numerointerior == 'null' || this.numerointerior == 'NULL' || this.numerointerior == 'Null') {
          this.numerointerior = '';
        }
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
