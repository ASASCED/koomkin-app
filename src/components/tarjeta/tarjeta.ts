import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'tarjeta',
  templateUrl: 'tarjeta.html'
})
export class TarjetaComponent implements OnInit {

  public empresa;
  public id;
  public fechaInicio;
  public fechaFin;

  constructor(
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

  ngOnInit() {
    this.getInicioCampana()
  }

  public getInicioCampana() {
    this.provedor.getInicioCampana().then(
      data => {
        if (data['length'] > 0) {
          this.fechaInicio = data[0].UltimaFInicio;
          this.fechaFin = new Date(this.fechaInicio);
          this.fechaFin.setDate(this.fechaFin.getDate() + 30);
          this.fechaFin = this.fechaFin.getFullYear() + '-' + ('0' + (this.fechaFin.getMonth() + 1)).slice(-2) + '-' + ('0' + this.fechaFin.getDate()).slice(-2);
        }
      },
      err => {
        // console.log('error');
      }
    );
  }
}
