import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
})

export class ReportePage {

  items: any = [];
  itemExpandHeight: number = 100;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
