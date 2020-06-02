import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalHelpPage } from './modal-help';

@NgModule({
  declarations: [
    ModalHelpPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalHelpPage),
  ],
})
export class ModalHelpPageModule {}
