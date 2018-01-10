import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelarPage } from './cancelar';

@NgModule({
  declarations: [
    CancelarPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelarPage),
  ],
})
export class CancelarPageModule {}
