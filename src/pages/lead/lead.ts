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
  apiUrl = 'http://localhost:3000';

  CALLING= 'http://www.koomkin.com:4829/twilio_api/api/v1/forward-app-lead/?idLead=';
  apiUrl3 = 'http://189.205.233.70:4829/twilio_api/api/v1/forward-app/?idLead='
  public color = ''
  public clasifica;
  public clasificacion;
  public califica;
  public calificacion;
  public uuid;

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
      this.http.get(this.apiUrl3 + '217355').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  public changeClassification(classification: string) {
    switch (classification) {
      case 'V': {
        this.leadActual.clasificaLead = 'Vendido';
        this.clasifica = 'Vendido';
        break;
      }
      case 'D': {
        this.leadActual.clasificaLead = 'Descartado';
        this.clasifica = 'Descartado'
        break;
      }
      case 'P': {
        this.leadActual.clasificaLead = 'En proceso de venta';
        this.clasifica = 'En proceso de venta'
        break;
      }
      case 'C': {
        this.leadActual.clasificaLead = 'Sin Contacto';
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

  public ColorV(calification: string) {
    calification = this.clasificacion;
    if (calification === 'Vendido') {
      return '#00bcaa';
    } else {
      return '#d1d1d1';
    }
  }

  public ColorP(calification: string) {
    calification = this.clasificacion;
    if (calification === 'En proceso de venta') {
      return '#6B4595';
    } else {
      return '#d1d1d1';
    }
  }

  public ColorC(calification: string) {
    calification = this.clasificacion;
    if (calification === 'Sin Contacto') {
      return '#419BD6';
    } else {
      return '#d1d1d1';
    }
  }

  public ColorD(calification: string) {
    calification = this.clasificacion;
    if (calification === 'Descartado') {
      return '#F2631C';
    } else {
      return '#d1d1d1';
    }
  }

  public callingLead(uuid) {
    console.log(this.uuid);
    this.http.get(this.CALLING + this.uuid).subscribe(data => {
      console.log('llamando');
    });
  }

  public changeLike(classification: string) {
    switch (classification) {
      case 'L': {
        this.leadActual.calificaLead = 'true';
        this.califica = 'l';
        break;
      }
      case 'DL': {
        this.leadActual.calificaLead = 'false';
        this.califica = 'd';
        break;
      }
      default:
        this.califica = null;
    }
    
    const body = {
      clave: this.leadActual.clave,
      classification: this.califica
    }
    this.http.get(this.apiUrl + "/calificaLead/" + body.clave + '/' + body.classification)
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
        console.log(this.calificacion);
      },
      err => {
        console.log("Error occured");
      });

  }
  
}