<<<<<<< HEAD
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
=======
import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'hotel',
  templateUrl: 'hotel.html'
})
export class HotelComponent implements OnInit{
  @Input() mensajehotel: string;
  @Input() personashotel: string;
  @Input() hotelEntrada: string;
  @Input() hotelSalida: string;

  text: string;

  constructor() {
    // console.log('Hotel');
  }

  ngOnInit(): void {
    

  }

}
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
