import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-lead',
  templateUrl: 'lead.html',
})
export class LeadPage {

  leadActual;
  apiUrl = 'http://localhost:3000';

  apiUrl3 = 'http://189.205.233.70:4829/twilio_api/api/v1/forward-app/?idLead='

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public http: HttpClient) {
    this.leadActual = navParams.data;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LeadPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  FbotonOn() {
    this.getLlamada();
    var uno = document.getElementById('tel');
    uno.innerHTML = 'Llamando a ' + this.leadActual.NOMBRE;
    console.log(this.leadActual);
  }

  public getLlamada() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl3 + '217355').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  public changeClassification(classification: string) {
    let clasifica
    switch (classification) {
      case 'V': {
        this.leadActual.clasificaLead = 'Vendido';
        clasifica = 'Vendido';
        break;
      }
      case 'D': {
        this.leadActual.clasificaLead = 'Descartado';
        clasifica = 'Descartado'
        break;
      }
      case 'P': {
        this.leadActual.clasificaLead = 'En proceso de venta';
        clasifica = 'En proceso de venta'
        break;
      }
      case 'C': {
        this.leadActual.clasificaLead = 'Sin Contacto';
        clasifica = 'Sin Contacto'
        break;
      }
      default:
      clasifica = ''
    }
    console.log(clasifica);
    const body = {
      clave: this.leadActual.clave,
      classification: clasifica
    }
    console.log(body);

    this.http.post(this.apiUrl + "/clasificaLead", JSON.stringify(body) )
    .subscribe(data => {
      console.log(data);
    },
    err => {
      console.log("Error occured");
    });

  }

  public changeLike(classification: string) {
    let califica
    switch (classification) {
      case 'L': {
        this.leadActual.calificaLead = 'TRUE';
        califica = 'TRUE';
        break;
      }
      case 'DL': {
        this.leadActual.calificaLead = 'FALSE';
        califica = 'FALSE'
        break;
      }
      default:
      califica = ''
    }
    console.log(califica);
    const body = {
      clave: this.leadActual.clave,
      classification: califica
    }
    console.log(body);

    this.http.post(this.apiUrl + "/calificaLead", JSON.stringify(body) )
    .subscribe(data => {
      console.log(data);
    },
    err => {
      console.log("Error occured");
    });

  }

}