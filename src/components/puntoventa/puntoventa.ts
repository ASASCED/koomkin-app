import { Component } from '@angular/core';

/**
 * Generated class for the PuntoventaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'puntoventa',
  templateUrl: 'puntoventa.html'
})
export class PuntoventaComponent {

  text: string;

  constructor() {
    console.log('Hello PuntoventaComponent Component');
    this.text = 'Hello World';
  }

}
