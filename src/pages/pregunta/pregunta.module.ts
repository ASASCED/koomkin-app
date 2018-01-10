import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreguntaPage } from './pregunta';

@NgModule({
  declarations: [
    PreguntaPage,
  ],
  imports: [
    IonicPageModule.forChild(PreguntaPage),
  ],
})
export class PreguntaPageModule {}
