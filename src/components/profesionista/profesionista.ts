<<<<<<< HEAD
import { Component } from '@angular/core';

/**
 * Generated class for the ProfesionistaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profesionista',
  templateUrl: 'profesionista.html'
})
export class ProfesionistaComponent {

  text: string;

  constructor() {
    console.log('Hello ProfesionistaComponent Component');
    this.text = 'Hello World';
  }

}
=======
import { Component,Input, OnInit } from '@angular/core';

/**
 * Generated class for the ProfesionistaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profesionista',
  templateUrl: 'profesionista.html'
})
export class ProfesionistaComponent implements OnInit{
  @Input() mensajeprofesionista: any;
  @Input() usoprofesionista: any;
  @Input() fechaCitaP: any;
  @Input() horaCitaP: any;
  @Input() urgenciaprofesionista: any;

  text: string;

  constructor() {
   // console.log('profesionista');
  }

  ngOnInit(){
  //  console.log(this.fechaCitaP);

  }
}
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
