import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadPage } from './lead';

@NgModule({
  declarations: [
    LeadPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadPage),
  ],
})
export class LeadPageModule {}
