import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-comercial',
  templateUrl: 'comercial.html',
})
export class ComercialPage implements OnInit{

  public id;
  public datos;
  public vista;
  public facebook;
  public instagram;
  public linkedIn;
  public web;
  public twitter;
  public saludo;
  public proceso = 'Guardar';
  public clientes = 'Guardar';
  public redes = 'Guardar';
  public objetivo = 'Guardar';

  // Proceso Comercial

  public distribucionOffline;
  public distribucionOnline;
  public quienVende;
  public numeroVendedores;
  public tipoVendedores;
  public crmDiferente;

  // Clientes Nuevos

  public clientesNuevos;
  public tipoPublicidad;
  public publicidadTracicional;
  public publicidadDigital;

  // Objetivo Campaña

  public campaniaObjetivo

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public http: HttpClient) {
      this.id = this.authService.id;
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getMailCliente(this.id);
    this.getBriefSettingsInformation();
  }

  changeTengo(red) {
    if (red == 'facebook') {
      this.facebook = 'No cuento con esta red';
    } else if (red == 'instagram') {
      this.instagram = 'No cuento con esta red';
    } else if (red == 'linkedIn') {
      this.linkedIn = 'No cuento con esta red';
    } else if (red == 'web') {
      this.web = 'No cuento con esta red';
    } else if (red == 'twitter') {
      this.twitter = 'No cuento con esta red';
    }
  }

  getMailCliente(idUsuario) {
    this.provedor.getMailCliente(idUsuario).then(
      data => {
        this.datos = data;
        // console.log(this.datos);
        if (this.datos[0]) {
          this.facebook = this.datos[0].facebook;
          this.instagram = this.datos[0].instagram;
          this.linkedIn = this.datos[0].linkedin;
          this.web = this.datos[0].web;
          this.twitter = this.datos[0].twitter;
          this.saludo = this.datos[0].saludo;

          if (this.facebook == null || this.facebook == '') {
            this.facebook = 'No cuento con esta red';
          } 
          
          if (this.instagram == null || this.instagram == '') {
            this.instagram = 'No cuento con esta red';
          } 
          
          if (this.linkedIn == null || this.linkedIn == '') {
            this.linkedIn = 'No cuento con esta red';
          } 
          
          if (this.web == null || this.web == '') {
            this.web = 'No cuento con esta red';
          } 
          
          if (this.twitter == null || this.twitter == '') {
            this.twitter = 'No cuento con esta red';
          }
          
        }
      },
      err => {
        //   // console.log('error');
       
      }
    );
  }

  changeInfo() {

    const body = new URLSearchParams();
    body.set('id_usuario', this.id);
    body.set('instagram', this.instagram);
    body.set('facebook', this.facebook);
    body.set('web', this.web);
    body.set('linkedin', this.linkedIn);
    body.set('twitter', this.twitter);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/mailing/update_social_media/';
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          this.showSuccess();
        },
        err => {
          if (err.status === 200) {
            this.showSuccess();
            this.redes = "Guardar"
          } else {
            this.showError();

          }
        }
      );
  }

  public cambioInformacion() {
    const canal = 'app';
    const tipo = 'redes-sociales';
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

  changeSeller(seller) {
    this.quienVende = seller;
  }

  changeCRM(crm) {
    this.crmDiferente = crm;
  }
  
  changeNewClients(nuevos) {
    this.clientesNuevos = nuevos;
  }

  changeMarketing(marketing) {
    this.tipoPublicidad = marketing;
  }

  changeMarketingTradicional(tradicional) {
    this.publicidadTracicional = tradicional;
  }

  changeMarketingDigital(digital) {
    this.publicidadDigital = digital;
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

  public getBriefSettingsInformation() {
    return new Promise((resolve, reject) => {

      const url = "https://www.koomkin.com.mx/api/app/getBriefSettingsInformation/" + this.id;

      this.http.get(url).subscribe(
        data => {
          console.log(data);
          this.distribucionOffline = data[0].DistribucionOffline;
          this.distribucionOnline = data[0].DistribucionOnline;
          this.quienVende = data[0].QuienVende;
          this.numeroVendedores = data[0].NumeroVendedores;
          this.tipoVendedores = data[0].TipoVendedores;
          this.crmDiferente = data[0].CrmDiferente;
          this.clientesNuevos = data[0].ClientesNuevos;
          this.tipoPublicidad = data[0].TipoPublicidad;
          this.publicidadTracicional = data[0].PublicidadTradicional;
          this.publicidadDigital = data[0].PublicidadDigital;
          resolve();
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  registrarProcesoComercial() {

    const body = new URLSearchParams();
    body.set("idUsuario", this.id);
    body.set("distribucionOnline", this.distribucionOnline);
    body.set("distribucionOffline", this.distribucionOffline);
    body.set("quienVende", this.quienVende);
    body.set("numeroVendedores", this.numeroVendedores);
    body.set("tipoVendedores", this.tipoVendedores);
    body.set("crmDiferente", this.crmDiferente);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = "https://www.koomkin.com.mx/api/app/registrarProcesoComercial/";

    console.log(url, body.toString());
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve(data);
        },
        err => {
          return resolve(err);
        }
      );
    });
  }

  registrarClientesNuevos() {
    
    const body = new URLSearchParams();
    body.set("idUsuario", this.id);
    body.set("clientesNuevos", this.clientesNuevos);
    body.set("tipoPublicidad", this.tipoPublicidad);
    body.set("publicidadTracicional", this.publicidadTracicional);
    body.set("publicidadDigital", this.publicidadDigital);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = "https://www.koomkin.com.mx/api/app/registrarClientesNuevos/";
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve(data);
        },
        err => {
          return resolve(err);
        }
      );
    });
  }

  registrarObjetivoCampania() {
    
    const body = new URLSearchParams();
    body.set("idUsuario", this.id);
    body.set("campaniaObjetivo", this.campaniaObjetivo);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = "https://www.koomkin.com.mx/api/app/registrarObjetivoCampania/";
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve(data);
        },
        err => {
          return resolve(err);
        }
      );
    });
  }

  changeEdit(variable) {

    switch(variable) {
      case "proceso": {
        if (this.proceso == 'Guardar') {
          this.proceso = 'Editar';
        } 
        break;
      }

      case "clientes": {
        if (this.clientes == 'Guardar') {
          this.clientes = 'Editar';
        } 
        break;
      }

      case "redes": {
        if (this.redes == 'Guardar') {
          this.redes = 'Editar';
        } 
        break;
      }

      case "objetivo": {
        if (this.objetivo == 'Guardar') {
          this.objetivo = 'Editar';
        } 
        break;
      }

      default:
        
    }
  }


}
  

