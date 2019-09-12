import { Component } from '@angular/core';

@Component({
  selector: 'tarjeta',
  templateUrl: 'tarjeta.html'
})
export class TarjetaComponent {

  text: string;

  constructor() {
    console.log('Hello TarjetaComponent Component');
    this.text = 'Hello World';
  }

}
