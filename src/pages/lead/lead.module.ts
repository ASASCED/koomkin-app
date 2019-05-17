import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadPage } from './lead';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    LeadPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadPage),
    ComponentsModule,
    PipesModule,
    DirectivesModule
  ],
})
export class LeadPageModule {}
