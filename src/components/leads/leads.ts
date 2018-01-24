import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'leads',
  templateUrl: 'leads.html'
})
export class LeadsComponent {

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  @Input('expanded') expanded;
  @Input('expandHeight') expandHeight;

  constructor(public renderer: Renderer) {

  }

  ngAfterViewInit(){
      this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px' + '!important');   
  }
}
