import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportePage } from './reporte';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  declarations: [
    ReportePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportePage),
    Ng2GoogleChartsModule
  ]
})
export class ReportePageModule {}
