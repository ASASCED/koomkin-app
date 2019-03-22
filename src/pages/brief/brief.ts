import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage implements OnInit{

  public empresa;
  public id;
  public tipoempresa = 'Selecionar tipo';
  public tipo_empresas: any;
  public datos;
  public cp;
  public ciudad;
  public target;
  public mejor;
  public producto;
  public direccion;
  public estado;
  public latitud;
  public longitud;
  public cuarta;
  public campania;
  public cobertura;
  public cobertura_local;
  public cobertura_estado;  
  public cobertura_region;
  public cobertura_nacional; 
  public editar = 0;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public provedor: RestProvider,
      public authService: AuthServiceProvider,
      public alertCtrl: AlertController,
    ) {
      this.empresa = this.authService.empresa;
      this.id = this.authService.id;
    }


    ngOnInit() {
      this.getBriefInformation(this.id);
      this.getEstados();
      this.getEmpresas();
    }

    getBriefInformation(idUsuario) {
      this.provedor.getBriefInformation(idUsuario).then(
        data => {
          this.datos = data;
          this.cp = this.datos[0].CP;
          this.ciudad = this.datos[0].Ciudad;
          this.target = this.datos[0].ClientesTarget;
          this.target = 'Particulares';
          this.mejor = this.datos[0].Mejor;
          this.producto = this.datos[0].Producto;
          this.direccion = this.datos[0].Direccion;
          this.estado = this.datos[0].Estado;
          this.latitud = this.datos[0].Latitud;
          this.longitud = this.datos[0].Longitud;
          this.cuarta = this.datos[0].TipoCuartaPantalla;
          this.campania = this.datos[0].IDCampania;
          this.cobertura_nacional = this.datos[0].Nacional;   
          console.log(this.datos);
          this.getCobertura(idUsuario,this.datos[0].IDCampania);
        },
        err => {
          //   // console.log('error');
        }
      );
    }

    getCobertura(idUsuario,campania) {
      this.provedor.getCobertura(idUsuario,campania).then(
        data => {
          this.cobertura = data;
          if( (this.cuarta == 2 || this.cuarta == 3 || this.cuarta == 5) && this.cobertura_nacional !== 1  ) {
            console.log('LOCAL');
            this.cobertura_local = 1;
          } else if(this.cobertura.length >= 2 && this.cobertura_nacional !== 1 ) {
            console.log('REGION');
            this.cobertura_region = 1;
          } else if(this.cobertura == 1 && this.cobertura_nacional !== 1 ) {
            console.log('ESTADO');
            this.cobertura_estado = 1;
          }
          console.log(this.cobertura);
        },
        err => {
          //   // console.log('error');
        }
      );
    }

    getEstados() {
      this.provedor.getEstados().then(
        data => {
          // console.log(data);
        },
        err => {
          //   // console.log('error');
        }
      );
    }

    getEmpresas() {
      this.provedor.getEmpresas().then(
        data => {
          let empresas = data;
          this.tipo_empresas = empresas;
          // console.log(this.tipo_empresas);
        },
        err => {
          //   // console.log('error');
        }
      );
    }

    changeEdit(numero) {
      if(numero == 0) {
        this.editar = 1;
      } else if(numero == 1) {
        this.editar = 0;
      }
    }

    
}
