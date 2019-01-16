import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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
  public linkedIn = 'https://www.linkedin.com/in/daniel-alberto-del-valle-armas-80962b124/';
  public web;
  public twitter;

  constructor(public navCtrl: NavController, public navParams: NavParams,private clipboard: Clipboard,
    public provedor: RestProvider,
    public authService: AuthServiceProvider) {
      this.id = this.authService.id;
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getMailCliente(this.id);
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  copiarAlPortapapeles(caso) {
    switch (caso) {
      case "facebook": { 
        this.clipboard.copy(this.facebook);
        break;
      }
      case "instagram": { 
        this.clipboard.copy(this.instagram);
        break;
      }
      case "linkedIn": { 
        this.clipboard.copy(this.linkedIn);
        break;
      }
      case "twitter": { 
        this.clipboard.copy(this.twitter);
        break;
      }
      case "web": { 
        this.clipboard.copy(this.web);
        break;
      }
      default:
      this.clipboard.copy('vacio');
  } 
}

  getMailCliente(idUsuario) {
    this.provedor.getMailCliente(idUsuario).then(
      data => {
        this.datos = data;
        console.log(this.datos);
        if (this.datos) {
          this.facebook = this.datos[0].facebook;
          this.instagram = this.datos[0].instagram;
          this.linkedIn = this.datos[0].linkedIn;
          this.web = this.datos[0].web;
          this.twitter = this.datos[0].twitter;

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
        //   console.log('error');
       
      }
    );
  }
}
