import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalNotificationPage } from './modal-notification';

@NgModule({
  declarations: [
    ModalNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalNotificationPage),
  ],
})
export class ModalNotificationPageModule {}
