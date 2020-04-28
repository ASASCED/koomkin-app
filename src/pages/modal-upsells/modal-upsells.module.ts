import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUpsellsPage } from './modal-upsells';

@NgModule({
  declarations: [
    ModalUpsellsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalUpsellsPage),
  ],
})
export class ModalUpsellsPageModule {}
