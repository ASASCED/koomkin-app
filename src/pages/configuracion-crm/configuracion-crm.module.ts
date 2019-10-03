import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracionCrmPage } from './configuracion-crm';

@NgModule({
  declarations: [
    ConfiguracionCrmPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracionCrmPage),
  ],
})
export class ConfiguracionCrmPageModule {}
