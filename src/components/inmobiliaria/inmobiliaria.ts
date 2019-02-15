<<<<<<< HEAD
import { Component } from '@angular/core';

/**
 * Generated class for the InmobiliariaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'inmobiliaria',
  templateUrl: 'inmobiliaria.html'
})
export class InmobiliariaComponent {

  text: string;

  constructor() {
    console.log('Hello InmobiliariaComponent Component');
    this.text = 'Hello World';
  }

}
=======
import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'inmobiliaria',
  templateUrl: 'inmobiliaria.html'
})
export class InmobiliariaComponent implements OnInit{
  @Input() mensajeinmobiliaria: any;
  @Input() personasinmobiliaria: any;
  @Input() edadinmobiliaria: any;
  @Input() fechaCitainmobiliaria: any;
  @Input() horaCitainmobiliaria: any;
  @Input() urgenciainmobiliaria: any;

  text: string;

  constructor() {
    // console.log('inmobiliaria');
  }

  ngOnInit(): void {

  }

}
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
