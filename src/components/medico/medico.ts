import { Component } from '@angular/core';

/**
 * Generated class for the MedicoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'medico',
  templateUrl: 'medico.html'
})
export class MedicoComponent {

  text: string;

  constructor() {
    console.log('Hello MedicoComponent Component');
    this.text = 'Hello World';
  }

}
