import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lead',
  templateUrl: 'lead.html',
})
export class LeadPage {

  leadActual;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController, 
              public navParams: NavParams) {
      this.leadActual = navParams.data;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LeadPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
