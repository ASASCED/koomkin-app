import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-social',
  templateUrl: 'social.html',
})
export class SocialPage implements OnInit{

  public id;
  public datos;
  public vista;
  public facebook;
  public instagram;
  public linkedIn;
  public web;
  public twitter;
  public saludo;

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
  }

  changePage(pagina) {
    this.vista = pagina;
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
        if (this.datos) {
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
    // console.log('entro');

    const body = new URLSearchParams();
    body.set('id_usuario', this.id);
    body.set('saludo', this.saludo);
    body.set('instagram', this.instagram);
    body.set('facebook', this.facebook);
    body.set('web', this.web);
    body.set('linkedin', this.linkedIn);
    body.set('twitter', this.twitter);
    body.set('tipo', '2');
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://koomkin.com.mx/call-tracking/api/v1/mailing/';
    // console.log(url, body.toString(), options);
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          this.showSuccess();
        },
        err => {
          if (err.status === 200) {
            this.showSuccess();
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
  

