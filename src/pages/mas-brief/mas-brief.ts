import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, SegmentButton, App } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import swal from 'sweetalert2';
import { InicioPage } from '../inicio/inicio';

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
        console.log(this.sectores);

        if (this.sectores !== null && this.sectores !== 'null' && this.sectores !== undefined && this.sectores !== '') {
          console.log('entro if');
          this.sectores = this.sectores.split(",");
        }
        //

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
        this.provedor.updateBriefClienteEmpresas(this.sector,this.categoria,this.sectores,this.intereses,this.idCampania).then(
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
        this.ingresosAnuales = ingresos;
        console.log(this.ingresosAnuales)
      }

      changeEdad(edad) {
        this.edad = edad;
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
        this.app.getRootNav().setRoot(InicioPage); 
      }
}
