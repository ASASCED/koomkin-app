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
    // // console.log('inmobiliaria');
  }

  ngOnInit(): void {

  }

}
