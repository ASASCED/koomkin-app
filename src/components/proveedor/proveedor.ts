import { Component } from '@angular/core';

/**
 * Generated class for the ProveedorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'proveedor',
  templateUrl: 'proveedor.html'
})
export class ProveedorComponent {

  text: string;

  constructor() {
    console.log('Hello ProveedorComponent Component');
    this.text = 'Hello World';
  }

}
