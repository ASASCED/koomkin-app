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
    // // console.log('Hotel');
  }

  ngOnInit(): void {
    

  }

}
