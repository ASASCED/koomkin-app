import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgregarLeadPage } from './agregar-lead';

@NgModule({
  declarations: [
    AgregarLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(AgregarLeadPage),
  ],
})
export class AgregarLeadPageModule {}
