import { Component,Input, OnInit } from '@angular/core';

/**
 * Generated class for the MedicoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'medico',
  templateUrl: 'medico.html'
})
export class MedicoComponent implements OnInit {

  @Input() mensajemedico: any;
  @Input() generoM: any;
  @Input() edadM: any;
  @Input() fechaCitaM: any;
  @Input() horaCitaM: any;
  @Input() urgenciamedico: any;

  text: string;

  constructor() {
    // // console.log('Medico');
  }

  ngOnInit(): void {}

}
