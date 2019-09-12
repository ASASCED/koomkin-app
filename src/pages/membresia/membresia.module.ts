import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MembresiaPage } from './membresia';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MembresiaPage,
  ],
  imports: [
    IonicPageModule.forChild(MembresiaPage),
    ComponentsModule
  ],
})
export class MembresiaPageModule {}
