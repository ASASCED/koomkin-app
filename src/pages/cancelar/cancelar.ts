import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { PreguntaPage } from './../pregunta/pregunta';

@IonicPage()
@Component({
  selector: 'page-cancelar',
  templateUrl: 'cancelar.html',
})
export class CancelarPage {

  nombre: string = "";
  edad: number = 0;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    public modalCtrl: ModalController) {

    this.nombre = this.navParams.get("nombre");
    this.edad = this.navParams.get("edad");

    // console.log(this.nombre, this.edad);

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  mostrar_pregunta() {
    let modal = this.modalCtrl.create(PreguntaPage);
    modal.present();
  }



}
