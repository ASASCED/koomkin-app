import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
})

export class ReportePage implements OnInit{
  
  items: any = [];
  itemExpandHeight: number = 200;
  leads;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider) {
    
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
        this.leads = data;
        console.log(this.leads);
      },
      (error) => {
        console.log(error);
      });
  }

  doInfinite(infiniteScroll) {
    console.log('Cargando Leads');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.items.push( this.items.length );
      }

      console.log('Se acabaron de cargar los Leads');
      infiniteScroll.complete();
    }, 500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportePage');
  }

}
