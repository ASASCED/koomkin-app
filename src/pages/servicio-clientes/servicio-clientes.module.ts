import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicioClientesPage } from './servicio-clientes';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ServicioClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicioClientesPage),
    ComponentsModule
  ],
})
export class ServicioClientesPageModule {}
