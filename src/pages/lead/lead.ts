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
      this.http.get(this.apiUrl3 + this.leadActual.clave).subscribe(data => {
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
        clasifica = 'Vendido'
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
      case 'P': {
        this.leadActual.clasificaLead = 'Sin Contacto';
        clasifica = 'Sin Contacto'
        break;
      }

    }

    const json = {
      clave: this.leadActual.clave,
      classification: clasifica
    }
    this.http.post(this.apiUrl + "/clasificaLead", json).subscribe(data => {

    })

  }
}