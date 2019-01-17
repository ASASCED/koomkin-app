import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html'
})
export class EmailPage implements OnInit {
  public vista;
  public saludo;
  public slogan;
  public id;
  public email;
  public datos;
  public pdf;

  apiUrl3 = 'http://18.235.164.159/call-tracking/api/v1/mailing/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public http: HttpClient
  ) {
    this.id = this.authService.id;
    this.email = this.authService.email;
    this.pdf = this.id + '.pdf';
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getMailCliente(this.id);
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  copiarAlPortapapeles(id_elemento) {
    const aux = document.createElement('input');
    aux.setAttribute('value', document.getElementById(id_elemento).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  }

  getMailCliente(idUsuario) {
    this.provedor.getMailCliente(idUsuario).then(
      data => {
        this.datos = data;
        console.log(this.datos);
        if (this.datos) {
          this.saludo = this.datos[0].SaludoCorreo;
          this.slogan = this.datos[0].Slogan;
        }
      },
      err => {
        //   console.log('error');
      }
    );
  }

  chooseFile() {
    (async () => {
      const file = await (<any>window).chooser.getFile('application/pdf');
      var formData = new FormData();
      var blob = new Blob([file.data],{type: file.mediaType});
      formData.append(file.name,blob,file.name);

     const headers = {
       headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
     };

     this.http.post(this.apiUrl3, formData, headers).subscribe(data => {
         console.log(data);
       },
       err => {
         console.log('Error', err);
       }
     );
    })();
  }
}