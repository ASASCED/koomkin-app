import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadsPage } from './leads';
import { LeadsComponent } from '../../components/leads/leads';

@NgModule({
  declarations: [
    LeadsPage,
    LeadsComponent
  ],
  imports: [
    IonicPageModule.forChild(LeadsPage),
  ],
})
export class LeadsPageModule {}
