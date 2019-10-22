import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NavParams } from 'ionic-angular';
/**
 * Generated class for the FreemiumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-freemium',
  templateUrl: 'freemium.html',
})

export class FreemiumPage {
  public briefId;
  
  constructor(public iab: InAppBrowser,
              public navParams: NavParams) {
                
    this.briefId = navParams.get('brief');
  }

  ionViewDidLoad() {
  }

  goToWorkPlan(){
    // produccion `https://www.koomkin.com.mx/payment/details?id_brief=${this.briefId}`
    const browser = this.iab.create(`http://localhost:4200/details?id_brief=${this.briefId}`);
    browser.show();

  }
}
