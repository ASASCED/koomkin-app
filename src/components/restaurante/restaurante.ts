import { Component,Input, OnInit } from '@angular/core';

/**
 * Generated class for the RestauranteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'restaurante',
  templateUrl: 'restaurante.html'
})
export class RestauranteComponent implements OnInit {

  @Input() fechaCitarestaurante;
  @Input() horaCitarestaurante;
  @Input() mensajerestaurante;
  @Input() personasrestaurante;

  text: string;

  constructor() {
    // console.log('Restaurante');
  }

  ngOnInit(){
   // console.log(this.horaCitarestaurante,this.fechaCitarestaurante);
  }

}
