import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreemiumPage } from './freemium';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    FreemiumPage,
  ],
  imports: [
    IonicPageModule.forChild(FreemiumPage)
  ],
  providers: [
    InAppBrowser
  ]
})
export class FreemiumPageModule {}
