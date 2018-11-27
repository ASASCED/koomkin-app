import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPageIniciarChatPage } from './modal-page-iniciar-chat';

@NgModule({
  declarations: [
    ModalPageIniciarChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPageIniciarChatPage),
  ],
})
export class ModalPageIniciarChatPageModule {}
