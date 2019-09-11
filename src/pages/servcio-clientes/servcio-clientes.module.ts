import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServcioClientesPage } from './servcio-clientes';

@NgModule({
  declarations: [
    ServcioClientesPage,
  ],
  imports: [
    IonicPageModule.forChild(ServcioClientesPage),
  ],
})
export class ServcioClientesPageModule {}
