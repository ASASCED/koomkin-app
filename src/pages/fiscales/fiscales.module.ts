import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiscalesPage } from './fiscales';

@NgModule({
  declarations: [
    FiscalesPage,
  ],
  imports: [
    IonicPageModule.forChild(FiscalesPage),
  ],
})
export class FiscalesPageModule {}
