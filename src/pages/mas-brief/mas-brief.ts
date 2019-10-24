import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, SegmentButton, App } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-mas-brief',
  templateUrl: 'mas-brief.html',
})
export class MasBriefPage implements OnInit {

  @ViewChild('loopSlider') sliderComponent: Slides;

  public empresa;
  public id;
  public target;
  public fechaNacimiento;
  public idpuesto: any;
  public puesto;
  public id_puesto;
  public cpDomicilio;
  public aniosEmpresa;
  public educacion;
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
  public sectores: any;
  public nombre;
  public apaterno;
  public amaterno;
  public editar = 0;
  public idCampania;
  public datos;
  mas_informacion: boolean = false;
  public google;
  public tipoempresa: any;
  public tipo_empresas: any;
  public tipo_empresa: any;
  public cp;
  public ciudad;
  public mejor;
  public producto;
  public productoInicial;
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
  public cobertura_nacional;
  public idPais = 156;
  public datos_ciudad;
  public IDMembresia;
  public IdProducto;
  public correo1;
  public correo2;
  public correo3;
  public IdSubSector;
  public cambio_estado_cob;
  public datosCampania;
  public ticket;
  public ticketfinal;
  public comentarioCierre;
  public idCobertura;
  // Multiples ingresos
  public ingresosArray = [];
  public ultIngresosArray;
  public ingresosBajo;
  public ingresosMedio;
  public ingresosMedioAlto;
  public ingresosAlto;

  // Multiples edades
  public edadArray = [];
  public ultEdadArray;
  public edad18;
  public edad26;
  public edad33;
  public edad41;
  public edad55;

  // Multiples Sectores
  public sectorArray = [];
  public ultSectorArray;
  public privado;
  public gobierno;

  // Multiples Categorias
  public categoriaArray = [];
  public ultCategoriaArray;
  public pyme;
  public corporativo;

  public positions = [
    { id: 1, nombre: 'Socio' },
    { id: 2, nombre: 'Socio-Director' },
    { id: 3, nombre: 'Dir. General' },
    { id: 4, nombre: 'Dir. Comercial' },
    { id: 5, nombre: 'Dir. Marketing' },
    { id: 6, nombre: 'Gerente' },
    { id: 7, nombre: 'Supervisor' },
    { id: 8, nombre: 'Ventas' },
    { id: 9, nombre: 'Marketing' },
    { id: 10, nombre: 'Otro' }
  ];

  public carreras = [
    { id: 1, nombre: 'Preparatoria' },
    { id: 2, nombre: 'Licenciatura' },
    { id: 3, nombre: 'Maestria' }
  ];

  public cat_sectores = [
    { id: 1, nombre: 'Manufactura' },
    { id: 2, nombre: 'Distribuidores' },
    { id: 3, nombre: 'Comercio' },
    { id: 4, nombre: 'Hoteles' },
    { id: 5, nombre: 'Restaurantes' },
    { id: 6, nombre: 'Construcción' },
    { id: 7, nombre: 'Transportes' },
    { id: 8, nombre: 'Educación' },
    { id: 9, nombre: 'Salud' },
    { id: 10, nombre: 'Otro' }
  ];

  selectedSegment = 'zero';

  slides = [
    {
      id: 'zero',
      title: 'Zero Slide'
    },
    {
      id: 'first',
      title: 'First Slide'
    },
    {
      id: 'second',
      title: 'Second Slide'
    },
    {
      id: 'third',
      title: 'Third Slide'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    public app: App,
    public http: HttpClient
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
        console.log(this.datos)
        this.cp = this.datos[0].CP;
        this.getCodigoPostal(this.cp);
        this.ciudad = this.datos[0].Ciudad;
        this.target = this.datos[0].ClientesTarget;
        this.mejor = this.datos[0].Mejor;
        this.producto = this.datos[0].Producto;
        this.productoInicial = this.datos[0].Producto;
        this.direccion = this.datos[0].Direccion;
        this.latitud = this.datos[0].Latitud;
        this.longitud = this.datos[0].Longitud;
        this.cuarta = this.datos[0].TipoCuartaPantalla;
        this.campania = this.datos[0].IDCampania;
        this.google = this.datos[0].PalabrasGoogle;
        if (this.google == 'NULL') {
          this.google = '';
        } 
        this.idCobertura = this.datos[0].IdCobertura; 
        this.cobertura_nacional = this.datos[0].Nacional;
        this.IdProducto = this.datos[0].IdProducto;
        if (this.cobertura_nacional == 1) {
          this.cobertura_empresa = 'Nacional';
        }
        this.tipoempresa = this.datos[0].TipoEmpresa;
        if (this.tipoempresa == 1) {
          this.tipoempresa = 'Fabricante';
        } else if (this.tipoempresa == 2) {
          this.tipoempresa = 'Distribuidor y Mayorista';
        } else if (this.tipoempresa == 3) {
          this.tipoempresa = 'Minorista o Venta Directa';
        } else if (this.tipoempresa == 4) {
          this.tipoempresa = 'Servicios';
        } else if (this.tipoempresa == 6) {
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
        this.genero = this.datos[0].ClientesTargetGenero;
        this.edad = this.datos[0].ClientesTargetEdad;
        this.intereses = this.datos[0].ClientesTargetIntereses;
        this.idpuesto = this.datos[0].ID_PUESTO;
        this.sector = this.datos[0].ClientesTargetSector;
        this.sectores = this.datos[0].ClientesTargetSectores;
        this.categoria = this.datos[0].ClientesTargetCategoria;

        this.positions.forEach(element => {
          if (element['id'] == this.idpuesto) {
            this.idpuesto = element['nombre'];
          }
        });

        if (this.sectores !== null && this.sectores !== 'null' && this.sectores !== undefined && this.sectores !== '') {
          this.sectores = this.sectores.split(',');
        }
    
        if (this.intereses == null || this.intereses == 'null' || this.intereses == undefined || this.intereses == 'NULL') {
          this.intereses = '';
        }
    
        if (this.ingresosAnuales != null && this.ingresosAnuales != undefined && this.ingresosAnuales != 'null' && this.ingresosAnuales != 'null' && this.ingresosAnuales != '') {
    
          if (this.ingresosAnuales.includes('Bajo')) {
            this.ingresosBajo = true;
            this.ingresosArray.push('Bajo');
          }
    
          if (this.ingresosAnuales.includes('Medio')) {
            this.ingresosMedio = true;
            this.ingresosArray.push('Medio');
          }
    
          if (this.ingresosAnuales.includes('Intermedio')) {
            this.ingresosMedioAlto = true;
            this.ingresosArray.push('Intermedio');
          }
    
          if (this.ingresosAnuales.includes('Alto')) {
            this.ingresosAlto = true;
            this.ingresosArray.push('Alto');
          }
        }
    
        if (this.edad !== null && this.edad !== undefined && this.edad !== 'null' && this.edad !== '') {
    
          if (this.edad.includes('18-25 años')) {
            this.edad18 = true;
            this.edadArray.push('18-25 años');
          }
    
          if (this.edad.includes('26-32 años')) {
            this.edad26 = true;
            this.edadArray.push('26-32 años');
          }
    
          if (this.edad.includes('33-40 años')) {
            this.edad33 = true;
            this.edadArray.push('33-40 años');
          }
    
          if (this.edad.includes('41-55 años')) {
            this.edad41 = true;
            this.edadArray.push('41-55 años');
          }
    
          if (this.edad.includes('55-65 años')) {
            this.edad55 = true;
            this.edadArray.push('55-65 años');
          }
        }
    
        if (this.categoria !== null && this.categoria !== undefined && this.categoria !== 'null' && this.categoria !== '') {
          if (this.categoria.includes('PYME')) {
            this.pyme = true;
            this.categoriaArray.push('PYME');
          }
    
          if (this.categoria.includes('Corporativo')) {
            this.corporativo = true;
            this.categoriaArray.push('Corporativo');
          }
        }
    
        if (this.sector !== null && this.sector !== 'null' && this.sector !== undefined && this.sector !== '') {
          if (this.sector.includes('Privado')) {
            this.privado = true;
            this.sectorArray.push('Privado');
          }
    
          if (this.sector.includes('Gobierno')) {
            this.gobierno = true;
            this.sectorArray.push('Gobierno');
          }
        }
    
        if (this.idCampania == undefined) {
          this.getLastCampania();
        }
    
        this.getCobertura(idUsuario, this.datos[0].IDCampania);
      },
      err => {
        // console.log('error');
      }
    );
  }

  updateBriefDatos() {

    this.positions.forEach(element => {
      if (element['nombre'] == this.idpuesto) {
        this.id_puesto = element['id'];
      }
    });

    this.provedor.updateBriefDatos(this.id, this.nombre, this.apaterno, this.amaterno, this.fechaNacimiento, this.id_puesto, this.cpDomicilio, this.aniosEmpresa, this.educacion).then(
      data => {
        console.log('updateBriefDatos');
      },
      err => {
        // console.log('error');
      }
    );
  }

  updateBriefEmpresa() {
    if (this.empresaFamiliar == true) {
      this.empresaFamiliar = 1;
    } else if (this.empresaFamiliar == false) {
      this.empresaFamiliar = 0;
    }
    this.provedor.updateBriefEmpresa(this.id, this.nombreComercial, this.rfcEmpresa, this.numeroEmpleados, this.numeroSocios, this.empresaFamiliar, this.regimenFiscal, this.rangoVentasAnuales, this.ventajaCompetitiva, this.idCampania).then(
      data => {
        console.log('updateBriefEmpresa');
      },
      err => {
        // console.log('error');
      }
    );
  }

  updateBriefClienteParticular() {

    this.ingresosAnuales = this.ingresosArray.join('|');
    this.edad = this.edadArray.join('|');

    this.provedor.updateBriefClienteParticular(this.ingresosAnuales, this.edad, this.genero, this.intereses, this.idCampania).then(
      data => {
        this.showSuccess();
        this.irInicio();
        console.log('updateBriefClienteParticular');
      },
      err => {
        this.showError();
        // console.log('error');
      }
    );
  }

  updateBriefClienteEmpresas() {

    this.categoria = this.categoriaArray.join('|');
    this.sector = this.sectorArray.join('|');

    if (this.intereses == null || this.intereses == 'null' || this.intereses == undefined || this.intereses == 'NULL') {
      this.intereses = '';
    }

    this.provedor.updateBriefClienteEmpresas(this.sector, this.categoria, this.sectores, this.intereses, this.idCampania).then(
      data => {
        this.showSuccess();
        this.irInicio();
        console.log('updateBriefClienteEmpresas');
      },
      err => {
        this.showError();
        // console.log('error');
      }
    );
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);

    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
    this.sliderComponent.slideTo(selectedIndex);
  }

  onChangeSegment(position) {
    console.log(position);
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === position;
    });
    this.sliderComponent.slideTo(selectedIndex);
  }

  onSlideChanged(s: Slides) {
    const currentSlide = this.slides[s.getActiveIndex()];
    this.selectedSegment = currentSlide.id;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  changeRegimen(regimen) {
    this.regimenFiscal = regimen;
  }

  changeRango(rango) {
    this.rangoVentasAnuales = rango;
  }

  changeVentaja(ventaja) {
    this.ventajaCompetitiva = ventaja;
  }

  changeIngresos(ingresos) {
    switch (ingresos) {
      case 'Bajo':
        if (this.ingresosArray.includes('Bajo') == true) {
          let indice = this.ingresosArray.indexOf('Bajo');
          this.ingresosArray.splice(indice, 1);
          this.ultIngresosArray = this.ingresosArray;
          this.ingresosBajo = false;
        } else if (this.ingresosArray.includes('Bajo') == false) {
          this.ultIngresosArray = this.ingresosArray.push(ingresos);
          this.ingresosBajo = true;
        }
        return;

      case 'Medio':
        if (this.ingresosArray.includes('Medio') == true) {
          let indice = this.ingresosArray.indexOf('Medio');
          this.ingresosArray.splice(indice, 1);
          this.ultIngresosArray = this.ingresosArray;
          this.ingresosMedio = false;
        } else if (this.ingresosArray.includes('Medio') == false) {
          this.ultIngresosArray = this.ingresosArray.push(ingresos);
          this.ingresosMedio = true;
        }
        return;

      case 'Intermedio':
        if (this.ingresosArray.includes('Intermedio') == true) {
          let indice = this.ingresosArray.indexOf('Intermedio');
          this.ingresosArray.splice(indice, 1);
          this.ultIngresosArray = this.ingresosArray;
          this.ingresosMedioAlto = false;
        } else if (this.ingresosArray.includes('Intermedio') == false) {
          this.ultIngresosArray = this.ingresosArray.push(ingresos);
          this.ingresosMedioAlto = true;
        }
        return;

      case 'Alto':
        if (this.ingresosArray.includes('Alto') == true) {
          let indice = this.ingresosArray.indexOf('Alto');
          this.ingresosArray.splice(indice, 1);
          this.ultIngresosArray = this.ingresosArray;
          this.ingresosAlto = false;
        } else if (this.ingresosArray.includes('Alto') == false) {
          this.ultIngresosArray = this.ingresosArray.push(ingresos);
          this.ingresosAlto = true;
        }
        return;
      default:

    }
  }

  changeEdad(edad) {
    switch (edad) {
      case '18-25 años':
        if (this.edadArray.includes('18-25 años') == true) {
          let indice = this.edadArray.indexOf('18-25 años');
          this.edadArray.splice(indice, 1);
          this.ultEdadArray = this.edadArray;
          this.edad18 = false;
        } else if (this.edadArray.includes('18-25 años') == false) {
          this.ultEdadArray = this.edadArray.push(edad);
          this.edad18 = true;
        }
        return;

      case '26-32 años':
        if (this.edadArray.includes('26-32 años') == true) {
          let indice = this.edadArray.indexOf('26-32 años');
          this.edadArray.splice(indice, 1);
          this.ultEdadArray = this.edadArray;
          this.edad26 = false;
        } else if (this.edadArray.includes('26-32 años') == false) {
          this.ultEdadArray = this.edadArray.push(edad);
          this.edad26 = true;
        }
        return;

      case '33-40 años':
        if (this.edadArray.includes('33-40 años') == true) {
          let indice = this.edadArray.indexOf('33-40 años');
          this.edadArray.splice(indice, 1);
          this.ultEdadArray = this.edadArray;
          this.edad33 = false;
        } else if (this.edadArray.includes('33-40 años') == false) {
          this.ultEdadArray = this.edadArray.push(edad);
          this.edad33 = true;
        }
        return;

      case '41-55 años':
        if (this.edadArray.includes('41-55 años') == true) {
          let indice = this.edadArray.indexOf('41-55 años');
          this.edadArray.splice(indice, 1);
          this.ultEdadArray = this.edadArray;
          this.edad41 = false;
        } else if (this.edadArray.includes('41-55 años') == false) {
          this.ultEdadArray = this.edadArray.push(edad);
          this.edad41 = true;
        }
        return;

      case '55-65 años':
        if (this.edadArray.includes('55-65 años') == true) {
          let indice = this.edadArray.indexOf('55-65 años');
          this.edadArray.splice(indice, 1);
          this.ultEdadArray = this.edadArray;
          this.edad55 = false;
        } else if (this.edadArray.includes('55-65 años') == false) {
          this.ultEdadArray = this.edadArray.push(edad);
          this.edad55 = true;
        }
        return;

      default:

    }
  }

  changeGenero(genero) {
    this.genero = genero;
  }

  changeSector(sector) {

    switch (sector) {
      case 'Privado':
        if (this.sectorArray.includes('Privado') == true) {
          let indice = this.sectorArray.indexOf('Privado');
          this.sectorArray.splice(indice, 1);
          this.ultSectorArray = this.sectorArray;
          this.privado = false;
        } else if (this.sectorArray.includes('Privado') == false) {
          this.ultSectorArray = this.sectorArray.push(sector);
          this.privado = true;
        }
        return;

      case 'Gobierno':
        if (this.sectorArray.includes('Gobierno') == true) {
          let indice = this.sectorArray.indexOf('Gobierno');
          this.sectorArray.splice(indice, 1);
          this.ultSectorArray = this.sectorArray;
          this.gobierno = false;
        } else if (this.sectorArray.includes('Gobierno') == false) {
          this.ultSectorArray = this.sectorArray.push(sector);
          this.gobierno = true;
        }
        return;

      default:
    }

  }

  changeCategoria(categoria) {

    switch (categoria) {
      case 'PYME':
        if (this.categoriaArray.includes('PYME') == true) {
          let indice = this.categoriaArray.indexOf('PYME');
          this.categoriaArray.splice(indice, 1);
          this.ultCategoriaArray = this.categoriaArray;
          this.pyme = false;
        } else if (this.categoriaArray.includes('PYME') == false) {
          this.ultCategoriaArray = this.categoriaArray.push(categoria);
          this.pyme = true;
        }
        return;

      case 'Corporativo':
        if (this.categoriaArray.includes('Corporativo') == true) {
          let indice = this.categoriaArray.indexOf('Corporativo');
          this.categoriaArray.splice(indice, 1);
          this.ultCategoriaArray = this.categoriaArray;
          this.corporativo = false;
        } else if (this.categoriaArray.includes('Corporativo') == false) {
          this.ultCategoriaArray = this.categoriaArray.push(categoria);
          this.corporativo = true;
        }
        return;

      default:
    }

  }

  getLastCampania() {
    this.provedor.getLastCampania(this.id).then(
      data => {
        this.datos = data;
        this.idCampania = this.datos[0].IDCampania;
      },
      err => {
        //   // console.log('error');
      }
    );
  }

  public irInicio() {
    this.app.getRootNav().setRoot('InicioPage');
  }

  getCodigoPostal(cp) {
    this.provedor.getCodigoPostal(cp).then(
      data => {
        this.datos_ciudad = data;
        if (this.datos_ciudad.length > 0) {
          this.estado_cob = this.datos_ciudad[0].Estado;
          if (this.estado_cob == 'Nuevo León') {
            this.estado_cob = 'Nuevo Leon'
          }
          this.cat_estados.forEach(element => {
            if (element['NOMBRE'] == this.estado_cob) {
              this.estado_cob = element['IDESTADO'];
            }
          });
        }
        if (this.cobertura_empresa !== 'Nacional' && this.cobertura_empresa !== 'Estado' && this.cobertura_empresa !== 'Region') {
          this.cobertura_empresa = 'Local';
          console.log(this.cobertura_empresa);
        }

      },
      err => {
        // console.log('error');
      }
    );
  }

  getNewCodigoPostal(cp) {
    return new Promise(resolve => {
      this.provedor.getCodigoPostal(cp).then(
        data => {
          this.datos_ciudad = data;
          if (this.datos_ciudad.length > 0) {
            this.cambio_estado_cob = this.datos_ciudad[0].Estado;
            if (this.cambio_estado_cob == 'Nuevo León') {
              this.cambio_estado_cob = 'Nuevo Leon'
            }
            this.cat_estados.forEach(element => {
              if (element['NOMBRE'] == this.cambio_estado_cob) {
                this.cambio_estado_cob = element['IDESTADO'];
                let nuevo_estado = this.cambio_estado_cob
                resolve(nuevo_estado);
              }
            });
          }
        },
        err => {
          // console.log('error');
        }
      );
    });
  }

  getCobertura(idUsuario, campania) {
    this.provedor.getCobertura(idUsuario, campania).then(
      data => {
        this.cobertura = data;
        console.log(this.cobertura);
        if ((this.cuarta == 2 || this.cuarta == 3 || this.cuarta == 5) && this.cobertura.length == 1 && this.cobertura_empresa !== 'Nacional' && this.cobertura_empresa !== 'Estado' && this.cobertura_empresa !== 'Region') {
          this.cobertura_empresa = 'Local';
        } else if (this.cobertura.length == 1 && this.cobertura_nacional !== 1 && this.cuarta !== 2 && this.cuarta !== 3 && this.cuarta !== 5) {
          this.cobertura_empresa = 'Estado';
        } else if (this.cobertura.length >= 2 && this.cobertura_nacional !== 1) {
          this.cobertura_empresa = 'Region';
          for (let i = 0; this.cobertura.length > i; i++) {
            this.cat_estados.forEach(element => {
              if (element['IDESTADO'] == this.cobertura[i].IDESTADO) {
                this.estado.push(element['NOMBRE']);
              }
            });
          }
        }
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


  changeCobertura(tipo) {
    switch (tipo) {
      case 'Local': {
        this.cobertura_empresa = 'Local';
        break;
      }
      case 'Estado': {
        this.cobertura_empresa = 'Estado';
        break;
      }
      case 'Region': {
        this.cobertura_empresa = 'Region';
        break;
      }
      case 'Nacional': {
        this.cobertura_empresa = 'Nacional';
        break;
      }
      default:
    }
    // console.log('cambio cobertura a', tipo);
  }

  changeTarget(target) {
    this.target = target;
    // console.log(this.target);
  }

  enviarInfo() {
    if (this.tipoempresa == 'Fabricante') {
      this.tipo_empresa = 1;
    } else if (this.tipoempresa == 'Distribuidor y Mayorista') {
      this.tipo_empresa = 2;
    } else if (this.tipoempresa == 'Minorista o Venta Directa') {
      this.tipo_empresa = 3;
    } else if (this.tipoempresa == 'Servicios') {
      this.tipo_empresa = 4;
    } else if (this.tipoempresa == 'Profesionista') {
      this.tipo_empresa = 6;
    }

    if (this.productoInicial !== this.producto) {
      this.productoInicial = this.producto;
      this.registerProduct(this.productoInicial);
      this.createTicket();
    }

    this.getNewCodigoPostal(this.cp)
      .then(nuevo_estado => {
        this.updateBriefInformation(nuevo_estado)
      })
      .catch();
  }

  public registerProduct(producto) {

    const acceso = 'App';

    const body = new URLSearchParams();
    body.set('idUsuario', this.id);
    body.set('producto', producto);
    body.set('acceso', acceso);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    // console.log(body.toString());
    const url = 'https://www.koomkin.com.mx/api/reporte/registerProduct/';

    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          // console.log(data);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  updateBriefInformation(nuevo_estado) {

    const body = new URLSearchParams();
    body.set('idUsuario', this.id);
    body.set('idProducto', this.IdProducto);
    body.set('new_Producto', this.producto);
    body.set('new_TipoEmpresa', this.tipo_empresa);
    body.set('new_CodigoPostal', this.cp);
    body.set('new_IDMembresia', this.IDMembresia);
    body.set('new_PorqueEresMejor', this.mejor);
    body.set('new_ClientesTarget', this.target);
    body.set('new_Correo1', this.correo1);
    body.set('new_IdSubSector', this.IdSubSector);
    body.set('idEstado', nuevo_estado);
    body.set('ClientesTargetIngresosAnuales', this.ingresosAnuales);
    body.set('ClientesTargetEdad', this.edad);
    body.set('ClientesTargetGenero', this.genero);
    body.set('ClientesTargetIntereses', this.intereses);
    body.set('ClientesTargetSector', this.sector);
    body.set('ClientesTargetCategoria', this.categoria);
    body.set('ClientesTargetSectores', this.sectores);
    body.set('palabraGoogle', this.google);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/updateBriefInformation3/';

    console.log(url, body.toString());
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          this.datosCampania = data;
          this.idCampania = this.datosCampania[0].IDCampania;
          if (this.cobertura_empresa == 'Local' && this.cobertura_empresa !== 'Nacional') {
            this.cobertura_empresa == 'Local';
            let idCobertura = 4;
            this.updateCobertura(this.idCampania, this.estado_cob, this.id, idCobertura);
          } else if (this.cobertura_empresa == 'Estado') {
            let idCobertura = 1;
            this.updateCobertura(this.idCampania, this.estado_cob, this.id, idCobertura);
          } else if (this.cobertura_empresa == 'Region') {
            for (let i = 0; this.estado.length > i; i++) {
              this.cat_estados.forEach(element => {
                if (element['NOMBRE'] == this.estado[i]) {
                  this.estado_cob = element['IDESTADO'];
                }
              });
              this.updateCoberturaRegion(this.idCampania, this.estado_cob, this.id);
            }
          } else if (this.cobertura_empresa == 'Nacional') {
            this.updateCoberturaNacional(this.idCampania, this.id);
         }
          this.showSuccess();
        },
        err => {
          this.showError();
        }
      );
    });
  }

  updateCobertura(idCampania, idEstado, idUsuario, idCobertura) {
    this.provedor.updateCobertura(idCampania, idEstado, idUsuario, idCobertura).then(
      data => {
        // console.log(data);
      },
      err => {
        // console.log('error');
      }
    );
  }

  updateCoberturaRegion(idCampania, idEstado, idUsuario) {
    this.provedor.updateCoberturaRegion(idCampania, idEstado, idUsuario).then(
      data => {
        // console.log(data);
      },
      err => {
        // console.log('error');
      }
    );
  }

  updateCoberturaNacional(idCampania, idUsuario) {
    this.provedor.updateCoberturaNacional(idCampania, idUsuario).then(
      data => {
        // console.log(data);
      },
      err => {
        // console.log('error');
      }
    );
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

  public createTicket() {
    let fecha;
    const descripcion = 'Cambio de Producto o Servicio Principal';
    const rightNow = new Date();
    const res = rightNow.toISOString().slice(0, 10).replace(/-/g, '');

    fecha = res;

    this.provedor.getTicket(this.id, fecha, descripcion).then(
      data => {
        this.ticket = data[0].idTicket;
        console.log(this.ticket);
        this.getRequirementTicket(this.ticket);
        this.agendaOptimizaciones(this.ticket);
      },
      error => {
        // console.log(error);
      }
    );
  }

  public getRequirementTicket(ticket) {

    const body = new URLSearchParams();
    body.set('ticket', ticket);
    body.set('comentario', 'Cambio de Producto o Servicio Principal');

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/getRequirementTicketOptimizacion/';
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          this.ticketfinal = data;
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  public agendaOptimizaciones(ticket) {

    const body = new URLSearchParams();
    body.set('idUsuario', this.id);
    body.set('idTicket', ticket);
    body.set('estatusOptimizacion', 'Sin Optimizar');

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/updateAgendaOptimizaciones/';
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          this.ticketfinal = data;
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });
  }
}
