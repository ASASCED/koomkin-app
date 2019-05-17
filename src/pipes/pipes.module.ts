import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { CapitalizePipe } from './capitalize/capitalize';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		RelativeTimePipe,
		CapitalizePipe
	],
	imports: [
		IonicModule
	],
	exports: [
		RelativeTimePipe,CapitalizePipe
	]
})
export class PipesModule {}
