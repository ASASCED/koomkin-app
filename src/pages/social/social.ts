import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-social',
  templateUrl: 'social.html',
})
export class SocialPage implements OnInit{

  public vista;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.vista = 'informacion';
  }

  changePage(pagina) {
    this.vista = pagina;
  }


}
