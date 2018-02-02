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

  FbotonOn() {
    var uno = document.getElementById('tel');
    uno.innerHTML = this.leadActual.TELEFONO + ' ID cliente: ' + this.leadActual.clave; 
    console.log(this.leadActual);
  }

}