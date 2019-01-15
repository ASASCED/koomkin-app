import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage implements OnInit {

  public vista;
  public saludo;
  public slogan;
  public id;
  public email;
  public datos;
  public pdf;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider) {
      this.id = this.authService.id;
      this.email = this.authService.email;
      this.pdf = this.id + '.pdf'
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getMailCliente(this.id );
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

}
