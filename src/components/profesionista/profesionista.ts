import { Component } from '@angular/core';

/**
 * Generated class for the ProfesionistaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profesionista',
  templateUrl: 'profesionista.html'
})
export class ProfesionistaComponent {

  text: string;

  constructor() {
    console.log('Hello ProfesionistaComponent Component');
    this.text = 'Hello World';
  }

}
