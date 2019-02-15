import { Component } from '@angular/core';

@Component({
  selector: 'hotel',
  templateUrl: 'hotel.html'
})
export class HotelComponent {

  text: string;

  constructor() {
    console.log('Hello HotelComponent Component');
    this.text = 'Hello World';
  }



}
