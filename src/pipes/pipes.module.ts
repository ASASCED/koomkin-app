import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { CapitalizePipe } from './capitalize/capitalize';
import { MomentPipe } from './moment/moment';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		RelativeTimePipe,
		CapitalizePipe,
		MomentPipe
	],
	imports: [
		IonicModule
	],
	exports: [
		RelativeTimePipe,
		CapitalizePipe,
		MomentPipe
	]
})
export class PipesModule {}
