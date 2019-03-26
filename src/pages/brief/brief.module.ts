import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BriefPage } from './brief';

@NgModule({
  declarations: [
    BriefPage,
  ],
  imports: [
    IonicPageModule.forChild(BriefPage),
  ],
})
export class BriefPageModule {}

