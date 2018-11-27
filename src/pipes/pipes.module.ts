import { NgModule } from '@angular/core';
import { RelativeTimePipe } from './relative-time/relative-time';
import { CapitalizePipe } from './capitalize/capitalize';
@NgModule({
	declarations: [RelativeTimePipe,CapitalizePipe],
	imports: [],
	exports: [RelativeTimePipe,CapitalizePipe]
})
export class PipesModule {}
