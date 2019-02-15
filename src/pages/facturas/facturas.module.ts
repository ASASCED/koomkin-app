import { FacturaPage } from '../factura/factura';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasPage } from './facturas';

@NgModule({
  declarations: [
    FacturasPage,
    FacturaPage
  ],
  imports: [
    IonicPageModule.forChild(FacturasPage),
  ],
})
export class FacturasPageModule {}
