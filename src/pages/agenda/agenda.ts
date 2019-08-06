import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaPage');
  }

}
