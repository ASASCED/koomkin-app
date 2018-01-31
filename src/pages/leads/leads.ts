import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LeadPage } from '../lead/lead';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.getLeadsReport();
  }

  expandItem(item) {
    this.items.map((listItem) => {
      if (item == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }

  public getLeadsReport() {
    this.provedor.getLeadsReport()
      .then(
      (data) => {
        let itemAux
        this.leads = data;

        for (let k in this.leads) {
          this.leads[k].FECHA = this.leads[k].FECHA.substring(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
          if (this.leads[k].NOMBRE.split(" ").length > 1) {
            this.leads[k].NOMBRE = this.leads[k].NOMBRE.split(" ")[0] + " " + this.leads[k].NOMBRE.split(" ")[1];
            if (this.leads[k].NOMBRE.split("-").length > 1) {
              itemAux.NOMBRE = itemAux.NOMBRE.split("-")[0].capitalize;
            }
          }
          this.leads[k].EMPRESA = this.leads[k].EMPRESA.substring(0, 40);
        }

        console.log(this.leads);
      },
      (error) => {
        console.log(error);
      });
  }

  public capitalize = function () {
    return this.toLowerCase().replace(/(^|\s)([a-z])/g,
      function (m, p1, p2) {
        return p1 + p2.toUpperCase();
      });
  };


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

  ionViewDidLoad() {
  }

  mostrar_modal(){
    let modal = this.modalCtrl.create( LeadPage );
    modal.present();
  }

}