import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportePage } from './reporte';
import { LeadsComponent } from '../../components/leads/leads';

@NgModule({
  declarations: [
    ReportePage,
    LeadsComponent
  ],
  imports: [
    IonicPageModule.forChild(ReportePage),
  ],
})
export class ReportePageModule {}
