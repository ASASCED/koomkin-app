import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalComentariosPage } from './modal-comentarios';

@NgModule({
  declarations: [
    ModalComentariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalComentariosPage),
  ],
})
export class ModalComentariosPageModule {}
