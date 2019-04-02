import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, SegmentButton } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

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
    public sectores;
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
      {id: 1, nombre: 'sector 1'},
      {id: 2, nombre: 'sector 2'},
      {id: 3, nombre: 'sector 3'},
      {id: 4, nombre: 'sector 4'},
      {id: 5, nombre: 'sector 5'},
      {id: 6, nombre: 'sector 6'},
      {id: 7, nombre: 'sector 7'},
      {id: 8, nombre: 'sector 8'},
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
      ) {
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
        this.empresa = this.authService.empresa;
        this.id = this.authService.id;
      }
   
      ngOnInit() {
        this.getLastCampania();
      }
  
      changeEdit(numero) {
        if(numero == 0) {
          this.editar = 1;
        } else if(numero == 1) {
          this.editar = 0;
        }
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
            //   // console.log('error');
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
            //   // console.log('error');
          }
        );
      }
  
      updateBriefClienteParticular() {
        this.provedor.updateBriefClienteParticular(this.ingresosAnuales,this.edad,this.genero,this.intereses,this.idCampania).then(
          data => {
            console.log('updateBriefClienteParticular');
          },
          err => {
            //   // console.log('error');
          }
        );
      }

      updateBriefClienteEmpresas() {
        this.provedor.updateBriefClienteEmpresas(this.sector,this.categoria,this.sectores,this.intereses,this.idCampania).then(
          data => {
            console.log('updateBriefClienteEmpresas');
          },
          err => {
            //   // console.log('error');
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

      
}
