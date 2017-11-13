import { Component } from '@angular/core';

import { BriefPage } from './../brief/brief';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  briefPage = BriefPage;

  /*constructor(public navCtrl: NavController) {

  }

  goBrief():void{
    this.navCtrl.push(BriefPage, 1);
  }*/

}
