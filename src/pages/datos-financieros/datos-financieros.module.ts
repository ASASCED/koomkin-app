import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatosFinancierosPage } from './datos-financieros';

@NgModule({
  declarations: [
    DatosFinancierosPage,
  ],
  imports: [
    IonicPageModule.forChild(DatosFinancierosPage),
  ],
})
export class DatosFinancierosPageModule {}
