import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagoPage } from './pago';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PagoPage,
  ],
  imports: [
    IonicPageModule.forChild(PagoPage),
    ComponentsModule
  ],
})
export class PagoPageModule {}
