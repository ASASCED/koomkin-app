import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmPage } from './crm';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    CrmPage
  ],
  imports: [
    IonicPageModule.forChild(CrmPage),
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
})
export class CrmPageModule { }
