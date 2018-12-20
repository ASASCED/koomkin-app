import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSurveyPage } from './modal-survey';

@NgModule({
  declarations: [
    ModalSurveyPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalSurveyPage),
  ],
})
export class ModalSurveyPageModule {}
