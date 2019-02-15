import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-lead',
  templateUrl: 'lead.html',
})
export class LeadPage implements OnInit {

  leadActual;
  apiUrl = 'http://localhost:4859';

  CALLING= 'http://www.koomkin.com:4829/twilio_api/api/v1/forward-app-lead/?idLead=';
  AUDIO = 'http://www.koomkin.com:4829/twilio_api/api/v1/data-app/0/?idLead='
  apiUrl3 = 'http://189.205.233.70:4829/twilio_api/api/v1/forward-app/?idLead='
  public color = ''
  public clasifica;
  public clasificacion;
  public califica;
  public calificacion;
  public noleidos;

  page: string = "Lead";
  isAndroid: boolean = false;

  constructor(public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public http: HttpClient) {
    this.leadActual = navParams.data;
  }

  ngOnInit(){
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
      this.http.get(this.apiUrl3 + this.leadActual.uuid).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  public getAudio() {
    return new Promise(resolve => {
      this.http.get(this.AUDIO + this.leadActual.uuid).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  public changeClassification(classification: string) {
    switch (classification) {
      case 'V': {
        this.leadActual.clasificaLead = 'V';
        this.clasifica = 'Vendido';
        break;
      }
      case 'D': {
        this.leadActual.clasificaLead = 'D';
        this.clasifica = 'Descartado'
        break;
      }
      case 'P': {
        this.leadActual.clasificaLead = 'P';
        this.clasifica = 'En proceso de venta'
        break;
      }
      case 'C': {
        this.leadActual.clasificaLead = 'S';
        this.clasifica = 'Sin Contacto'
        break;
      }
      default:
        this.clasifica = ''
    }
    const body = {
      clave: this.leadActual.clave,
      classification: this.clasifica
    }

    this.http.get(this.apiUrl + "/clasificaLead/" + body.clave + '/' + body.classification)
      .subscribe(data => {
        this.clasificacion = data[0].clasificaLead;
        console.log(this.clasificacion);

      },
      err => {
        console.log("Error occured");
      });

  }

  public callingLead() {
    this.http.get(this.CALLING + this.leadActual.uuid).subscribe(data => {
      console.log('llamando');
    });
  }

  public changeLike(classification: string, lead) {
    switch (classification) {
      case 'L': {
        this.leadActual.calificaLead = 'true';
        this.califica = 'l';
        this.leadActual.calificaLead = 'like';
        break;
      }
      case 'DL': {
        this.leadActual.calificaLead = 'false';
        this.califica = 'd';
        this.leadActual.calificaLead = 'dislike';
        break;
      }
      default:
        this.califica = null;
        lead.calificaLead = 'vacio'
    }

    const body = {
      clave: this.leadActual.clave,      
      classification: this.califica
    }
    this.http.get(this.apiUrl + "/calificaLead/" +  body.clave + '/' + body.classification)
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
        console.log(this.calificacion);
      },
        err => {
          console.log("Error occured");
        });

  }
  
}