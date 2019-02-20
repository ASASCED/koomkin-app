import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {HttpHeaders} from "@angular/common/http";
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  respuesta = false;

  uuid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalPage');
  }

  closeModal(){
    this.viewCtrl.dismiss();

  }

  ionViewWillLoad(){
    this.uuid = this.navParams.get('uuid');
    // alert(this.uuid);
  }

  public modalChatAction(preferencia: string) {

    //0 inactivo
    //1 chat activo
    //2 me interesa
    //3 no me interesa

    const body = new URLSearchParams();
    body.set('id', this.uuid);
    body.set('chat', preferencia);


    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    const url = 'https://koomkin.com.mx/call-tracking/api/v1/extra-info/';
    return new Promise((resolve, reject) => {
      this.http.post(url ,body.toString() , options)
        .subscribe(data => {
          this.respuesta = true;
          //alert(data);
          return resolve();
        }, err => {
          this.respuesta = true;
          console.log(err);
          //alert(err);
          return resolve(err);
        });
    });
  }

}
