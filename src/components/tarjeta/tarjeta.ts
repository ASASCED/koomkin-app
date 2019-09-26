import { Component } from '@angular/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'tarjeta',
  templateUrl: 'tarjeta.html'
})
export class TarjetaComponent {

  public empresa;
  public id;

  constructor(
    public authService: AuthServiceProvider
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

}
