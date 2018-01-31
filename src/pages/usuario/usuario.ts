import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { CancelarPage } from './../cancelar/cancelar';


@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuarioPage');
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(CancelarPage);
    modal.present();
  }

}
