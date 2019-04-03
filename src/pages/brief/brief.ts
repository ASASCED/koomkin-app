import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MasBriefPage } from '../mas-brief/mas-brief';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage implements OnInit{

  @ViewChild('loopSlider') sliderComponent: Slides;

  public empresa;
  public id;
  public tipoempresa:any;
  public tipo_empresas: any;
  public tipo_empresa: any;
  public educacion;
  public datos;
  public datosCampania;
  public cp;
  public ciudad;
  public target;
  public mejor;
  public producto;
  public direccion;
  public cat_estados;
  public estado: any = [];
  public estado_cob;
  public latitud;
  public longitud;
  public cuarta;
  public campania;
  public cobertura;
  public cobertura_empresa;
  public cobertura_local;
  public cobertura_estado;  
  public cobertura_region;
  public cobertura_nacional; 
  public editar = 0;
  public idPais = 156;
  public datos_ciudad;
  public IDMembresia;
  public IdProducto;
  public correo1;
  public correo2;
  public correo3;
  public IdSubSector;

  //variables mas info
  public nombre;
  public apaterno;
  public amaterno;
  public fechaNacimiento;
  public puesto;
  public cpDomicilio;
  public aniosEmpresa;
  public nombreComercial;
  public rfcEmpresa;
  public numeroEmpleados;
  public numeroSocios;
  public empresaFamiliar;
  public regimenFiscal;
  public rangoVentasAnuales;
  public ventajaCompetitiva;
  public ingresosAnuales;
  public edad;
  public genero;
  public intereses;
  public sector;
  public categoria;
  public sectores;
  public idCampania;
  public lleno: boolean = false;

  mas_informacion: boolean = false;
  familiar: boolean = false;

  selectedSegment = 'first';

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
          this.getCodigoPostal(this.cp);
          this.ciudad = this.datos[0].Ciudad;
          this.target = this.datos[0].ClientesTarget;
          this.mejor = this.datos[0].Mejor;
          this.producto = this.datos[0].Producto;
          this.direccion = this.datos[0].Direccion;
          this.latitud = this.datos[0].Latitud;
          this.longitud = this.datos[0].Longitud;
          this.cuarta = this.datos[0].TipoCuartaPantalla;
          this.campania = this.datos[0].IDCampania;
          this.cobertura_nacional = this.datos[0].Nacional;
          this.IdProducto = this.datos[0].IdProducto;
          if (this.cobertura_nacional == 1) {
             this.cobertura_empresa = 'Nacional';
          } 
          this.tipoempresa = this.datos[0].TipoEmpresa;

          if(this.tipoempresa == 1) {
            this.tipoempresa = 'Fabricante';
          } else if(this.tipoempresa == 2) {
            this.tipoempresa = 'Distribuidor y Mayorista';
          } else if(this.tipoempresa == 3) {
            this.tipoempresa = 'Minorista o Venta Directa';
          } else if(this.tipoempresa == 4) {
            this.tipoempresa = 'Servicios';
          } else if(this.tipoempresa == 6) {
            this.tipoempresa = 'Profesionista';
          }

          this.correo1 = this.datos[0].Correo1;
          this.correo2 = this.datos[0].Correo2;
          this.correo3 = this.datos[0].Correo3;
          this.IdSubSector = this.datos[0].IdSubSector;
          this.IDMembresia = this.datos[0].IDMembresia;

          this.nombre = this.datos[0].NOMBRE;
          this.apaterno = this.datos[0].APEPATERNO;
          this.amaterno = this.datos[0].APEMATERNO;
          this.fechaNacimiento = this.datos[0].FECHANACIMIENTO;
          this.puesto = this.datos[0].ID_PUESTO;
          this.cpDomicilio = this.datos[0].CodigoPostalDomicilio;
          this.aniosEmpresa = this.datos[0].AniosEmpresa;
          this.educacion = this.datos[0].Educacion;
          this.nombreComercial = this.datos[0].NOMEMPRESACOMPRADOR;
          this.rfcEmpresa = this.datos[0].RFCEMPRESA;
          this.numeroEmpleados = this.datos[0].NumeroEmpleados;
          this.numeroSocios = this.datos[0].NumeroSocios;
          this.empresaFamiliar = this.datos[0].EmpresaFamiliar;
          this.regimenFiscal = this.datos[0].RegimenFiscal;
          this.rangoVentasAnuales = this.datos[0].RangoVentasAnuales;
          this.ventajaCompetitiva = this.datos[0].VentajaCompetitiva;
          this.ingresosAnuales = this.datos[0].ClientesTargetIngresosAnuales;
          this.edad = this.datos[0].ClientesTargetEdad;
          this.genero = this.datos[0].ClientesTargetGenero;
          this.intereses = this.datos[0].ClientesTargetIntereses;
          this.sector = this.datos[0].ClientesTargetSector;
          this.categoria = this.datos[0].ClientesTargetCategoria;
          this.sectores = this.datos[0].ClientesTargetSectores;
          // console.log(this.datos);
          this.getCobertura(idUsuario,this.datos[0].IDCampania);
        },
        err => {
          // console.log('error');
        }
      );
    }

    getCodigoPostal(cp){
      this.provedor.getCodigoPostal(cp).then(
        data => {
          this.datos_ciudad = data;
          if(this.datos_ciudad.length > 0) {
            this.estado_cob = this.datos_ciudad[0].Estado;
            this.cat_estados.forEach(element=> {
              if(element['NOMBRE'] == this.estado_cob) {
                this.estado_cob = element['IDESTADO'];
              }
            });
          }
          this.cobertura_local = 1;
          console.log(this.cobertura_local,this.cobertura_nacional);
        },
        err => {
          // console.log('error');
        }
      );
    }

    getCobertura(idUsuario,campania) {
      this.provedor.getCobertura(idUsuario,campania).then(
        data => {
          this.cobertura = data;
          console.log(this.cobertura );
          if( (this.cuarta == 2 || this.cuarta == 3 || this.cuarta == 5) && this.cobertura.length == 1 && this.cobertura_nacional !== 1  ) {
            this.cobertura_local = 1;
            this.cobertura_empresa = 'Local';
            // console.log(this.cobertura_empresa);
          } else if(this.cobertura.length == 1 && this.cobertura_nacional !== 1 && this.cuarta !== 2 && this.cuarta !== 3 && this.cuarta !== 5 ) {
            this.cobertura_estado = 1;
            this.cobertura_empresa = 'Estado';
            // console.log(this.cobertura_empresa);
          } else if(this.cobertura.length >= 2 && this.cobertura_nacional !== 1 ) {
            this.cobertura_region = 1;
            this.cobertura_empresa = 'Region';
            for(let i = 0; this.cobertura.length > i; i++ ) {
              this.cat_estados.forEach(element=> {
                if(element['IDESTADO'] == this.cobertura[i].IDESTADO) {
                  this.estado.push(element['NOMBRE']);
                  // console.log(element['NOMBRE'],this.estado );
                }
              });
            }
          } 

          this.briefLleno();

        },
        err => {
          // console.log('error');
        }
      );
    }

    getEstados() {
      this.provedor.getEstados().then(
        data => {
          this.cat_estados = data;
          console.log(data);
        },
        err => {
          // console.log('error');
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
          // console.log('error');
        }
      );
    }

    getCP() {
      this.provedor.getEstados().then(
        data => {
          this.cat_estados = data;
          // console.log(data);
        },
        err => {
          // console.log('error');
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

    changeCobertura(tipo) {
      switch (tipo) {
        case 'Local': {
          this.cobertura_empresa = 'Local';
          this.cobertura_local = 1;
          this.cobertura_estado = 0;
          this.cobertura_region = 0;
          this.cobertura_nacional = 0;
          break;
        }
        case 'Estado': {
          this.cobertura_empresa = 'Estado';
          this.cobertura_local = 0;
          this.cobertura_estado = 1;
          this.cobertura_region = 0;
          this.cobertura_nacional = 0;
          break;
        }
        case 'Region': {
          this.cobertura_empresa = 'Region';
          this.cobertura_local = 0;
          this.cobertura_estado = 0;
          this.cobertura_region = 1;
          this.cobertura_nacional = 0;
          break;
        }
        case 'Nacional': {
          this.cobertura_empresa = 'Nacional';
          this.cobertura_local = 0;
          this.cobertura_estado = 0;
          this.cobertura_region = 0;
          this.cobertura_nacional = 1;
          break;
        }
        default:
        this.cobertura_local = 0;
        this.cobertura_estado = 0;
        this.cobertura_region = 0;
        this.cobertura_nacional = 0;
      }
      // console.log('cambio cobertura a', tipo);
    }

    changeTarget(target) {
      this.target = target;
      // console.log(this.target);
    }
    
    enviarInfo() {
      if(this.tipoempresa == 'Fabricante') {
        this.tipo_empresa = 1;
      } else if(this.tipoempresa == 'Distribuidor y Mayorista') {
        this.tipo_empresa = 2;
      } else if(this.tipoempresa == 'Minorista o Venta Directa') {
        this.tipo_empresa = 3;
      } else if(this.tipoempresa == 'Servicios') {
        this.tipo_empresa = 4;
      } else if(this.tipoempresa == 'Profesionista') {
        this.tipo_empresa = 6;
      }
        
      this.provedor.updateBriefInformation(
        this.id,
        this.IdProducto,
        this.producto,
        this.tipo_empresa,
        this.cp,
        this.IDMembresia,
        this.mejor,
        this.target,
        this.correo1,
        this.correo2,
        this.correo3,
        this.IdSubSector).then(
        data => {
          console.log(this.cp);
          this.datosCampania = data;
          this.idCampania = this.datosCampania[0].IDCampania;
          if(this.cobertura_empresa == 'Local') {
            this.cobertura_local = 1;
          } else if(this.cobertura_empresa == 'Estado') {
            this.updateCobertura(this.idCampania,this.estado_cob,this.id);
          } else if(this.cobertura_empresa == 'Region') {
            for(let i = 0; this.estado.length > i; i++ ) {
              this.cat_estados.forEach(element=> {
                if(element['NOMBRE'] == this.estado[i]) {
                  this.estado_cob = element['IDESTADO'];
                }
              });
              this.updateCoberturaRegion(this.idCampania,this.estado_cob,this.id) 
            }
          } else if(this.cobertura_empresa == 'Nacional') {
            this.updateCoberturaNacional(this.idCampania,this.id);
          }
          this.lleno = true;
          this.showSuccess();
        },
        err => {
          this.showError();
        }
      );

    }

    updateCobertura(idCampania,idEstado,idUsuario) {
      this.provedor.updateCobertura(idCampania,idEstado,idUsuario).then(
        data => {
          // console.log(data);
        },
        err => {
          // console.log('error');
        }
      );
    }

    updateCoberturaRegion(idCampania,idEstado,idUsuario) {
      this.provedor.updateCoberturaRegion(idCampania,idEstado,idUsuario).then(
        data => {
         // console.log(data);
        },
        err => {
          // console.log('error');
        }
      );
    }

    updateCoberturaNacional(idCampania,idUsuario) {
      this.provedor.updateCoberturaNacional(idCampania,idUsuario).then(
        data => {
          // console.log(data);
        },
        err => {
          // console.log('error');
        }
      );
    }

    pagina() {
      this.mas_informacion = false;
      this.navCtrl.push(MasBriefPage, 
        { 
          target: this.target,
          fechaNacimiento : this.fechaNacimiento,
          puesto: this.puesto,
          cpDomicilio: this.cpDomicilio,
          aniosEmpresa: this.aniosEmpresa,
          educacion: this.educacion,
          nombreComercial: this.nombreComercial,
          rfcEmpresa: this.rfcEmpresa,
          numeroEmpleados: this.numeroEmpleados,
          numeroSocios: this.numeroSocios,
          empresaFamiliar: this.empresaFamiliar,
          tipoEmpresa: this.tipoempresa,
          rangoVentasAnuales: this.rangoVentasAnuales,
          ventajaCompetitiva: this.ventajaCompetitiva,
          ingresosAnuales: this.ingresosAnuales,
          edad: this.edad,
          genero: this.genero,
          intereses: this.intereses,
          sector: this.sector,
          categoria: this.categoria,
          sectores: this.sectores,
          regimenFiscal: this.regimenFiscal,
          nombre: this.nombre, 
          apaterno: this.apaterno, 
          amaterno: this.amaterno, 
          idCampania: this.idCampania
      });
    }

    briefLleno() {
      // console.log(this.producto,this.tipoempresa,this.cp,this.mejor,this.target,this.cobertura_empresa );
      if((this.producto !== '' && this.tipoempresa !== '' && this.cp !== '' && this.mejor !== '' && this.target !== '' && this.cobertura_empresa !== '') && 
         (this.producto !== undefined && this.tipoempresa !== undefined && this.cp !== undefined && this.mejor !== undefined && this.target !== undefined && this.cobertura_empresa !== undefined) && 
         (this.producto !== null && this.tipoempresa !== null && this.cp !== null && this.mejor !== null && this.target !== null && this.cobertura_empresa !== null) && 
         (this.producto !== 'null' && this.tipoempresa !== 'null' && this.cp !== 'null' && this.mejor !== 'null' && this.target !== 'null' && this.cobertura_empresa !== 'null')) {
           // console.log('entro');
           this.lleno = true;
      }
    }

    public showSuccess() {
      swal({
        title: 'Se ha guardado tu información con éxito',
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        reverseButtons: true,
      });
    }
  
    public showError() {
      swal({
        title: 'No se ha podido guardar tu información',
        text: 'Por favor complete todos los campos',
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        reverseButtons: true
      });
    }
}
