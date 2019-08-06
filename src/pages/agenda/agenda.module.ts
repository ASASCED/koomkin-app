import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaPage } from './agenda';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    AgendaPage,
  ],
  imports: [
    IonicPageModule.forChild(AgendaPage),
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
})
export class AgendaPageModule {}
