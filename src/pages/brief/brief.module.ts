import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BriefPage } from './brief';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  declarations: [
    BriefPage,
  ],
  imports: [
    IonicPageModule.forChild(BriefPage),
    Ng2GoogleChartsModule
  ]
})
export class BriefPageModule {}
