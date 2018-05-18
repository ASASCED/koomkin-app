import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LeadPage } from '../lead/lead';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-leads',
  templateUrl: 'leads.html',
})

export class LeadsPage implements OnInit {

  items: any = [];
  itemExpandHeight: number = 200;
  leads;
  page = 1;
  user;
  selectedLike;
  public califica;
  public calificacion;
  public clave;

  apiUrl = 'http://localhost:3000';


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public modalCtrl: ModalController,
    public http: HttpClient) {
  }

  ngOnInit() {
    this.getLeadsReport();
  }

  public getLeadsReport() {
    this.provedor.getLeadsReport()
      .then(
        (data) => {
          this.leads = data;
          //console.log(this.leads);
          for (let k in this.leads) {
            this.leads[k].FECHA = this.leads[k].FECHA.substring(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
            this.leads[k].NOMBRE = this.leads[k].NOMBRE.substring(0, 16);
            this.leads[k].EMPRESA = this.leads[k].EMPRESA.substring(0, 35);

            if(this.leads[k].calificaLead == 'True'){
              this.leads[k].calificaLead = "like";
            }else if(this.leads[k].calificaLead == 'False'){
              this.leads[k].calificaLead = "dislike";
            } else{
              this.leads[k].calificaLead = "vacio";
            }
            if(this.leads[k].clasificaLead == 'En proceso de venta'){
              this.leads[k].clasificaLead = "P";
            }else if(this.leads[k].clasificaLead == 'Descartado'){
              this.leads[k].clasificaLead = "D";
            }else if(this.leads[k].clasificaLead == 'Vendido'){
              this.leads[k].clasificaLead = "V";
            }else if(this.leads[k].clasificaLead == 'Sin Contacto'){
              this.leads[k].clasificaLead = "S";
            } else{
              this.leads[k].clasificaLead = "banda";
            }
          }
        },
        (error) => {
          console.log(error);
        });
  }

  

  doInfinite(infiniteScroll) {
    console.log('Cargando Leads');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.items.push(this.items.length);
      }
      console.log('Se acabaron de cargar los Leads');
      infiniteScroll.complete();
    }, 500);
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
    console.log(lead.clave);
    this.http.get(this.apiUrl + "/calificaLead/" + lead.clave + '/' + body.classification)
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
        console.log(this.calificacion);
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

  mostrar_modal() {
    let modal = this.modalCtrl.create(LeadPage);
    modal.present();
  }

}