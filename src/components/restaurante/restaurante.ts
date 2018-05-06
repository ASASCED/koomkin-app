import { Component } from '@angular/core';

/**
 * Generated class for the RestauranteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'restaurante',
  templateUrl: 'restaurante.html'
})
export class RestauranteComponent {

  text: string;

  constructor() {
    console.log('Hello RestauranteComponent Component');
    this.text = 'Hello World';
  }

}
