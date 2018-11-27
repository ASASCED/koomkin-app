import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpHeaders} from "@angular/common/http";
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-modal-eficiency',
  templateUrl: 'modal-eficiency.html',
})
export class ModalEficiencyPage {

  respuesta = false;

  uuid : any;
  image: any;
  title: any;
  message: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public viewCtrl: ViewController) {

  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  ionViewWillLoad(){
    this.image = this.navParams.get('imagen');
    this.title = this.navParams.get('titulo');
    this.message = this.navParams.get('mensaje');
  }

}
