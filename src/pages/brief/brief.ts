import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BriefPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({name:'brief', segment:'brief-1/:param'})
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage {

  titulo:string;
  briefPage=BriefPage;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.titulo = navParams.get('numero');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BriefPage');
  }
  goBack():void{
    this.navCtrl.pop();
  }

}
