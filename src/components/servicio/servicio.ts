import { Component } from '@angular/core';

/**
 * Generated class for the ServicioComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'servicio',
  templateUrl: 'servicio.html'
})
export class ServicioComponent {

  text: string;

  constructor() {
    console.log('Hello ServicioComponent Component');
    this.text = 'Hello World';
  }

}
