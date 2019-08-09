import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({ 
    name: 'dateFormat' 
})
export class MomentPipe implements PipeTransform {
    transform(date: any, args?: any): any {
        let d = new Date(date)
        return moment(d).locale('es').add(5, 'hours').format('DD-MMMM-YYYY HH:mm ')
    }
}