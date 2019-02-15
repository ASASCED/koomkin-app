<<<<<<< HEAD
import { Component } from '@angular/core';

/**
 * Generated class for the ProveedorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'proveedor',
  templateUrl: 'proveedor.html'
})
export class ProveedorComponent {

  text: string;

  constructor() {
    console.log('Hello ProveedorComponent Component');
    this.text = 'Hello World';
  }

}
=======
import { Component,Input,OnInit } from '@angular/core';

/**
 * Generated class for the ProveedorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'proveedor',
  templateUrl: 'proveedor.html'
})
export class ProveedorComponent implements OnInit{
  @Input() frecuenciaproveedor;
  @Input() usoproveedor;
  @Input() mensajeproveedor;
  @Input() mensaje;
  @Input() unidadesproveedor;
  @Input() cantidadproveedor;
  @Input() envioproveedor;
  @Input() urgenciaproveedor;

  text: string;

  constructor() {
    // console.log('Proveedor');
  }

  ngOnInit(){
    // console.log(this.usoproveedor,typeof(this.usoproveedor));
  }

}
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
