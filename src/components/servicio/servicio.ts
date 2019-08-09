import { Component,Input } from '@angular/core';

/**
 * Generated class for the ServicioComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'servicio',
  templateUrl: 'servicio.html'
})
export class ServicioComponent {

  @Input() frecuenciaservicio;
  @Input() usoservicio;
  @Input() mensajeservicio;
  @Input() urgenciaservicio;

  text: string;

  constructor() {
    // // console.log('Servicio');
  }

}
