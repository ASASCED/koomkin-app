import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
})

export class ReportePage {

  items: any = [];
  itemExpandHeight: number = 300;
  leads;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provedor:RestProvider) {
    this.items = [
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false},
      {expanded: false}
  ];
  }

  getLeads(){
    this.provedor.getLeadsMeses()
    .then(
      (data)=> {
        this.leads = data;
        console.log(this.leads);
      },
      (error)=> {
        console.log(error);
      });
  }

  expandItem(item){
    this.items.map((listItem) => {
      if(item == listItem){
        listItem.expanded = !listItem.expanded;
      } else {
          listItem.expanded = false;
        }
      return listItem;
    });  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportePage');
  }



}
