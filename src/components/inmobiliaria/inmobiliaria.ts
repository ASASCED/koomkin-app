import { Component } from '@angular/core';

/**
 * Generated class for the InmobiliariaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'inmobiliaria',
  templateUrl: 'inmobiliaria.html'
})
export class InmobiliariaComponent {

  text: string;

  constructor() {
    console.log('Hello InmobiliariaComponent Component');
    this.text = 'Hello World';
  }

}
