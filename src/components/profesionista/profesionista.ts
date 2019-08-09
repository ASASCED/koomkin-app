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
   // // console.log('profesionista');
  }

  ngOnInit(){
  //  // console.log(this.fechaCitaP);

  }
}
