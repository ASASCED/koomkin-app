import { NgModule } from '@angular/core';
import { SwipeSegmentDirective } from './swipe-segment/swipe-segment';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		SwipeSegmentDirective
	],
	imports: [
		IonicModule
	],
	exports: [
		SwipeSegmentDirective
	]
})
export class DirectivesModule {}
