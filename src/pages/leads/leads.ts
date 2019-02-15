import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LeadPage } from '../lead/lead';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-leads',
  templateUrl: 'leads.html',
})

export class LeadsPage implements OnInit {

  leads:any = [];
  leadsfiltro;
  page = 1;
  selectedLike;
  public califica;
  public calificacion;
  public clave;
  public noleidos;
  public id;
  public empresa;
  apiUrl = 'http://www.koomkin.com:4859';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public modalCtrl: ModalController,
    public http: HttpClient,    
    public authService: AuthServiceProvider) {
      this.empresa = this.authService.empresa;
      this.id = this.authService.id;
  }

  ngOnInit() {
    this.getLeadsReport();
  }

  public getLeadsReport() {
    this.provedor.getLeadsReport()
      .then(
        (data) => {
          this.leads = data;
          this.leadsfiltro = this.leads;
          for (let k in this.leads) {
            this.leads[k].FECHA = this.leads[k].FECHA.substring(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
            this.leads[k].NOMBRE = this.leads[k].NOMBRE.substring(0, 16);
            this.leads[k].EMPRESA = this.leads[k].EMPRESA.substring(0, 30);
            if (this.leads[k].calificaLead == 'True') {
              this.leads[k].calificaLead = "like";
            } else if (this.leads[k].calificaLead == 'False') {
              this.leads[k].calificaLead = "dislike";
            } else {
              this.leads[k].calificaLead = "vacio";
            }
            if (this.leads[k].leido == 'True' || this.leads[k].leido == true) {
              this.leads[k].leido = "leido";
            } else
              this.leads[k].leido = "noleido";
            if (this.leads[k].clasificaLead == 'En proceso de venta') {
              this.leads[k].clasificaLead = "P";
            } else if (this.leads[k].clasificaLead == 'Descartado') {
              this.leads[k].clasificaLead = "D";
            } else if (this.leads[k].clasificaLead == 'Vendido') {
              this.leads[k].clasificaLead = "V";
            } else if (this.leads[k].clasificaLead == 'Sin Contacto') {
              this.leads[k].clasificaLead = "S";
            } else {
              this.leads[k].clasificaLead = "banda";
            }
          }
          this.checkNoleidos();
          console.log(this.leadsfiltro);
        },
        (error) => {
          console.log(error);
        });
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
       /* for (var i = 0; i < 10; i++) {
          this.leads.push( this.leads.length );
        }*/
        console.log('Async operation has ended');
        resolve();
      }, 500);
    })
  }

  public changeLike(classification: string, lead) {
    switch (classification) {
      case 'L': {
        this.leads.calificaLead = 'true';
        this.califica = 'l';
        lead.calificaLead = 'like';
        break;
      }
      case 'DL': {
        this.leads.calificaLead = 'false';
        this.califica = 'd';
        lead.calificaLead = 'dislike';
        break;
      }
      default:
        this.califica = null;
        lead.calificaLead = 'vacio'
    }

    const body = {
      classification: this.califica
    }
    //console.log(lead.clave);
    this.http.get(this.apiUrl + "/calificaLead/" + lead.clave + '/' + body.classification)
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
        //console.log(this.calificacion);
      },
        err => {
          console.log("Error occured");
        });
  }

  ionViewDidLoad() {
  }

  verLead(lead) {
    this.navCtrl.push(LeadPage, lead);
  }

  public changeLeido(lead) {
    //console.log(lead);
    const url = this.apiUrl + "/leerLead/" + lead.clave + '/' + lead.ID;
    this.http.get(url).subscribe(data => {
      this.noleidos = data[0].NoLeidos;
      if (this.noleidos > 99) {
        this.noleidos = "99+";
      }
      lead.leido = "leido";
    },
      err => {
        //console.log("Error occured");
      });
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(LeadPage);
    modal.present();
  }

  public checkNoleidos() {
    const url = this.apiUrl + '/leerLead/0/' + this.id;
    this.http.get(url).subscribe(data => {
      this.noleidos = data[0].NoLeidos;
      if (this.noleidos > 99) {
        this.noleidos = "99+";
      }
    },
      err => {
        //console.log("Error occured");
      });
  }
}