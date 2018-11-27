import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EficienciaPage } from './eficiencia';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  declarations: [
    EficienciaPage,
  ],
  imports: [
    IonicPageModule.forChild(EficienciaPage),
    Ng2GoogleChartsModule
  ],
})
export class EficienciaPageModule {}
