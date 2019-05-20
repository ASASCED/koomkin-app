import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, SegmentButton, App } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-mas-brief',
  templateUrl: 'mas-brief.html',
})
export class MasBriefPage implements OnInit{

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
    // Varios ingresos
    public ingresosArray = [];
    public ultIngresosArray;
    public ingresosBajo;
    public ingresosMedio;
    public ingresosMedioAlto;
    public ingresosAlto;
    public edadArray = [];
    public ultEdadArray;
    public edad18;
    public edad26;
    public edad33;
    public edad41;
    public edad55;

    public positions = [
      {id: 1, nombre: 'Socio'},
      {id: 2, nombre: 'Socio-Director'},
      {id: 3, nombre: 'Dir. General'},
      {id: 4, nombre: 'Dir. Comercial'},
      {id: 5, nombre: 'Dir. Marketing'},
      {id: 6, nombre: 'Gerente'},
      {id: 7, nombre: 'Supervisor'},
      {id: 8, nombre: 'Ventas'},
      {id: 9, nombre: 'Marketing'},
      {id: 10, nombre: 'Otro'}
     ];
    
    public carreras = [
      {id: 1, nombre: 'Preparatoria'},
      {id: 2, nombre: 'Licenciatura'},
      {id: 3, nombre: 'Maestria'}
     ];
  
     public cat_sectores = [
      {id: 1, nombre: 'Manufactura'},
      {id: 2, nombre: 'Distribuidores'},
      {id: 3, nombre: 'Comercio'},
      {id: 4, nombre: 'Hoteles'},
      {id: 5, nombre: 'Restaurantes'},
      {id: 6, nombre: 'Construcción'},
      {id: 7, nombre: 'Transportes'},
      {id: 8, nombre: 'Educación'},
      {id: 9, nombre: 'Salud'},
      {id: 10, nombre: 'Otro'}
     ];
  
    selectedSegment = 'first';
  
    slides = [
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
        public app: App
      ) {
        this.empresa = this.authService.empresa;
        this.id = this.authService.id;
        this.target = navParams.get('target');
        this.fechaNacimiento = navParams.get('fechaNacimiento');
        this.idpuesto = navParams.get('puesto');

        this.positions.forEach(element=> {
          if(element['id'] == this.idpuesto) {
            this.idpuesto = element['nombre'];
          }
        });
        this.nombre = navParams.get('nombre');
        this.apaterno = navParams.get('apaterno');
        this.amaterno = navParams.get('amaterno');

        this.cpDomicilio = navParams.get('cpDomicilio');
        this.aniosEmpresa = navParams.get('aniosEmpresa');
        this.educacion = navParams.get('educacion');
        this.nombreComercial = navParams.get('nombreComercial');
        this.rfcEmpresa = navParams.get('rfcEmpresa');
        this.numeroEmpleados = navParams.get('numeroEmpleados');
        this.numeroSocios = navParams.get('numeroSocios');
        this.empresaFamiliar = navParams.get('empresaFamiliar');
        this.regimenFiscal = navParams.get('regimenFiscal');
        this.ventajaCompetitiva = navParams.get('ventajaCompetitiva');
        this.rangoVentasAnuales = navParams.get('rangoVentasAnuales');
        this.ingresosAnuales = navParams.get('ingresosAnuales');
        this.edad = navParams.get('edad');
        this.genero = navParams.get('genero');
        this.intereses = navParams.get('intereses');
        this.sector = navParams.get('sector');
        this.categoria = navParams.get('categoria');
        this.sectores = navParams.get('sectores');
        
        if (this.sectores !== null && this.sectores !== 'null' && this.sectores !== undefined && this.sectores !== '') {
          this.sectores = this.sectores.split(',');
        }

        if (this.intereses == null || this.intereses == 'null' || this.intereses == undefined || this.intereses == 'NULL') {
          this.intereses = '';
        }

        if (this.ingresosAnuales != null && this.ingresosAnuales != undefined && this.ingresosAnuales != 'null' && this.ingresosAnuales != 'null' && this.ingresosAnuales != ''  ) {

          if ( this.ingresosAnuales.includes('Bajo') ) {
            this.ingresosBajo = true;
            this.ingresosArray.push('Bajo');
          } 

          if ( this.ingresosAnuales.includes('Medio') ) {
            this.ingresosMedio = true;
            this.ingresosArray.push('Medio');
          } 
        
          if ( this.ingresosAnuales.includes('Intermedio') ) {
          this.ingresosMedioAlto = true;
          this.ingresosArray.push('Intermedio');
          } 
        
          if ( this.ingresosAnuales.includes('Alto') ) {
          this.ingresosAlto = true;
          this.ingresosArray.push('Alto');
          }
        } 

        if (this.edad !== null && this.edad !== undefined && this.edad !== 'null' && this.edad !== ''  ) {
          console.log('entro edad' );

          if ( this.edad.includes('18-25 años') ) {
            this.edad18 = true;
            this.edadArray.push('18-25 años');
          } 

          if ( this.edad.includes('26-32 años') ) {
            this.edad26 = true;
            this.edadArray.push('26-32 años');
          } 
        
          if ( this.edad.includes('33-40 años') ) {
            this.edad33 = true;
            this.edadArray.push('33-40 años');
          } 
        
          if ( this.edad.includes('41-55 años') ) {
            this.edad41 = true;
            this.edadArray.push('41-55 años');
          }

          if ( this.edad.includes('55-65 años') ) {
            this.edad55 = true;
            this.edadArray.push('55-65 años');
          }
        } 

        

        this.idCampania = navParams.get('idCampania');
        if (this.idCampania == undefined) {
          this.getLastCampania();
        }
        
      }
   
      ngOnInit() {
      }
  
      changeEdit(numero) {
        if(numero == 0) {
          this.editar = 1;
        } else if(numero == 1) {
          this.editar = 0;
        }
      }

      updateBriefDatos() {

        this.positions.forEach(element=> {
          console.log(this.idpuesto);
          if(element['nombre'] == this.idpuesto) {
            this.id_puesto = element['id'];
            console.log(this.id_puesto);
          }
        });

        this.provedor.updateBriefDatos(this.id,this.nombre,this.apaterno,this.amaterno,this.fechaNacimiento,this.id_puesto,this.cpDomicilio,this.aniosEmpresa,this.educacion).then(
          data => {
            console.log('updateBriefDatos');
          },
          err => {
            // console.log('error');
          }
        );
      }

      updateBriefEmpresa() {
        if(this.empresaFamiliar == true) {
          this.empresaFamiliar = 1;
        } else if(this.empresaFamiliar == false) {
          this.empresaFamiliar = 0;
        }
        this.provedor.updateBriefEmpresa(this.id,this.nombreComercial,this.rfcEmpresa,this.numeroEmpleados,this.numeroSocios,this.empresaFamiliar,this.regimenFiscal,this.rangoVentasAnuales,this.ventajaCompetitiva,this.idCampania).then(
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

        this.provedor.updateBriefClienteParticular(this.ingresosAnuales,this.edad,this.genero,this.intereses,this.idCampania).then(
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

        let sectores = [];

        if (this.sectores !== null && this.sectores !== undefined && this.sectores !== 'null' && this.sectores !== ''  ) {
          for (let i = 0; this.sectores.length > i; i++ ) {
            this.cat_sectores.forEach(element => {
              if (element['id'] == this.sectores[i].id) {
                sectores.push(element['nombre']);
              }
            });
          }
        }

        this.provedor.updateBriefClienteEmpresas(this.sector,this.categoria,sectores,this.intereses,this.idCampania).then(
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
            if ( this.ingresosArray.includes('Bajo')  == true ) {
              let indice = this.ingresosArray.indexOf('Bajo'); 
              this.ingresosArray.splice(indice, 1);
              this.ultIngresosArray = this.ingresosArray;
              this.ingresosBajo = false;
            } else if ( this.ingresosArray.includes('Bajo')  == false ) {
              this.ultIngresosArray = this.ingresosArray.push(ingresos);
              this.ingresosBajo = true;
            }
          return;
  
          case 'Medio':
            if ( this.ingresosArray.includes('Medio')  == true ) {
              let indice = this.ingresosArray.indexOf('Medio'); 
              this.ingresosArray.splice(indice, 1);
              this.ultIngresosArray = this.ingresosArray;
              this.ingresosMedio = false;
            } else if ( this.ingresosArray.includes('Medio')  == false ) {
              this.ultIngresosArray = this.ingresosArray.push(ingresos);
              this.ingresosMedio = true;
            }
          return;
  
          case 'Intermedio':
            if ( this.ingresosArray.includes('Intermedio')  == true ) {
              let indice = this.ingresosArray.indexOf('Intermedio'); 
              this.ingresosArray.splice(indice, 1);
              this.ultIngresosArray = this.ingresosArray;
              this.ingresosMedioAlto = false;
            } else if ( this.ingresosArray.includes('Intermedio')  == false ) {
              this.ultIngresosArray = this.ingresosArray.push(ingresos);
              this.ingresosMedioAlto = true;
            }
          return;
  
          case 'Alto':
            if ( this.ingresosArray.includes('Alto')  == true ) {
              let indice = this.ingresosArray.indexOf('Alto'); 
              this.ingresosArray.splice(indice, 1);
              this.ultIngresosArray = this.ingresosArray;
              this.ingresosAlto = false;
            } else if ( this.ingresosArray.includes('Alto')  == false ) {
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
            if ( this.edadArray.includes('18-25 años') == true ) {
              let indice = this.edadArray.indexOf('18-25 años'); 
              this.edadArray.splice(indice, 1);
              this.ultEdadArray = this.edadArray;
              this.edad18 = false;
            } else if ( this.edadArray.includes('18-25 años') == false ) {
              this.ultEdadArray = this.edadArray.push(edad);
              this.edad18 = true;
            }
          return;
  
          case '26-32 años':
            if ( this.edadArray.includes('26-32 años') == true ) {
              let indice = this.edadArray.indexOf('26-32 años'); 
              this.edadArray.splice(indice, 1);
              this.ultEdadArray = this.edadArray;
              this.edad26 = false;
            } else if ( this.edadArray.includes('26-32 años') == false ) {
              this.ultEdadArray = this.edadArray.push(edad);
              this.edad26 = true;
            }
          return;
  
          case '33-40 años':
            if ( this.edadArray.includes('33-40 años') == true ) {
              let indice = this.edadArray.indexOf('33-40 años'); 
              this.edadArray.splice(indice, 1);
              this.ultEdadArray = this.edadArray;
              this.edad33 = false;
            } else if ( this.edadArray.includes('33-40 años') == false ) {
              this.ultEdadArray = this.edadArray.push(edad);
              this.edad33 = true;
            }
          return;
  
          case '41-55 años':
            if ( this.edadArray.includes('41-55 años')  == true ) {
              let indice = this.edadArray.indexOf('41-55 años'); 
              this.edadArray.splice(indice, 1);
              this.ultEdadArray = this.edadArray;
              this.edad41 = false;
            } else if ( this.edadArray.includes('41-55 años')  == false ) {
              this.ultEdadArray = this.edadArray.push(edad);
              this.edad41 = true;
            }
          return;
  
          case '55-65 años':
            if ( this.edadArray.includes('55-65 años')  == true ) {
              let indice = this.edadArray.indexOf('55-65 años'); 
              this.edadArray.splice(indice, 1);
              this.ultEdadArray = this.edadArray;
              this.edad55 = false;
            } else if ( this.edadArray.includes('55-65 años')  == false ) {
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
        this.sector = sector;
        
      }

      changeCategoria(categoria) {
        this.categoria = categoria;
      }

      getLastCampania() {
        this.provedor.getLastCampania(this.id).then(
          data => {
            this.datos = data;
            this.idCampania = this.datos[0].IDCampania;
            console.log(this.idCampania);
          },
          err => {
            //   // console.log('error');
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
          text: 'Por favor complete los campos requeridos *',
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          reverseButtons: true
        });
      }

      public irInicio() {
        this.app.getRootNav().setRoot('InicioPage'); 
      }
}
