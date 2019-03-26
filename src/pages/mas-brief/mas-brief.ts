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
  
    mas_informacion: boolean = false;
    familiar: boolean = false;
  
    public event = {
      month: '1900-02-19',
    }
  
    public puestos = [
      { nombre: 2 },
      { nombre: 3 },
    ];
  
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
      {id: 3, nombre: 'Maestria'},
      {id: 4, nombre: 'Doctorado'},
     ];
  
    public ingresos = [
      {id: 1, nombre: 'bajo'},
      {id: 2, nombre: 'medio'},
      {id: 3, nombre: 'medio-alto'},
      {id: 4, nombre: 'alto'},
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
            this.target = 'Empresas';
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
            console.log(this.tipo_empresas);
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
  
      onSegmentChanged(segmentButton: SegmentButton) {
        console.log('Segment changed to', segmentButton.value);
    
        const selectedIndex = this.slides.findIndex((slide) => {
          return slide.id === segmentButton.value;
        });
        this.sliderComponent.slideTo(selectedIndex);
      }
    
      onSlideChanged(s: Slides) {
        console.log('Slide changed', s);
    
        const currentSlide = this.slides[s.getActiveIndex()];
        this.selectedSegment = currentSlide.id;
      }
      
  }
  