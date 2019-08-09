import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MasBriefPage } from './mas-brief';

@NgModule({
  declarations: [
    MasBriefPage,
  ],
  imports: [
    IonicPageModule.forChild(MasBriefPage),
  ],
})
export class MasBriefPageModule {}
