import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-garanty',
  templateUrl: 'modal-garanty.html',
})
export class ModalGarantyPage {


  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams  ) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  
}
