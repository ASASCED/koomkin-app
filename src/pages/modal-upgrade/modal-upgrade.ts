import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-upgrade',
  templateUrl: 'modal-upgrade.html',
})
export class ModalUpgradePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController
    ) {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
