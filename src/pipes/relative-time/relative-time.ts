import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as esLocale from 'date-fns/locale/es';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: string, ...args) {
    let date = (new Date(value).getTime() - 1*40000);
    return distanceInWordsToNow(date,{ addSuffix: true , includeSeconds:false, locale : esLocale });
  }

}
