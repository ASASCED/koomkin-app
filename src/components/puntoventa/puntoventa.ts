<<<<<<< HEAD
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
=======
import { Component,Input,OnInit } from '@angular/core';

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
export class PuntoventaComponent implements OnInit{
  @Input() usoventa: any;
  @Input() mensajeventa: any;
  @Input() urgenciaventa: any;


  text: string;

  constructor() {
    // console.log('Punto de venta');
  }

  ngOnInit(){

  }

}
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
