import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadsPage } from './leads';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    LeadsPage
  ],
  imports: [
    IonicPageModule.forChild(LeadsPage),
    ComponentsModule,
    PipesModule
  ],
})
export class LeadsPageModule { }
