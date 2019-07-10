import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import * as uuid from 'uuid';

@IonicPage()
@Component({
  selector: 'page-agregar-lead',
  templateUrl: 'agregar-lead.html',
})
export class AgregarLeadPage implements OnInit {

  public id;
  public empresa;
  public cat_estados;
  public state;
  public registerForm;
  // Datos para registrar un lead
  public user_id;
  public name_sender;
  public email;
  public company:any ;
  public phone_number;
  public phone_type = 'C';
  public country_id = 156;
  public region_id;
  public city = '';
  public product_id = 0;
  public facebook_lead_id = '';
  public channel = 'App';
  public postal_code = 0;
  public lead_uuid;
  public date;
  public hour;
  public dateComplete;
  public disableButton = false;

  erroresForm = {
    'name_sender': '',
    'email': '',
    'phone_number': ''
  }

  mensajesValidacion = {
    'name_sender': {
      'required': 'Nombre obligatorio',
    },
    'email': {
      'required': 'Correo Electrónico obligatorio',
      'email': 'Introduzca un Correo Electrónico correcto'
    },
    'phone_number': {
      'required': 'Teléfono obligatorio',
    }
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: HttpClient,
    public restService: RestProvider,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthServiceProvider,
    public app: App
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
      for (const field in this.erroresForm) {
      this.erroresForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.mensajesValidacion[field];
        for (const key in control.errors) {
          this.erroresForm[field] += messages[key] + ' ';
        }
      }
    }
  }

  ngOnInit() {
    this.getEstados();
    this.registerForm = this.formBuilder.group({
      'name_sender': ['', [Validators.required]],
      'company': [''],
      'email': ['', [Validators.required, Validators.email]],
      'phone_number': ['', [Validators.required]],
      'state': [''],
      'date': [''],
      'hour': ['']
    });
    this.registerForm.valueChanges
    .subscribe(data => this.onValueChanged(data))
    this.onValueChanged();
    this.getInsertClickPagina();
  }

  public registerLead(name_sender, email, company, phone_number, region_id ) {
    this.disableButton = true;

    let loading = this.loadingCtrl.create({
      content: "Agregando Lead..."
    });

    this.lead_uuid = uuid.v4();
    
    if (name_sender != '' && email != '' && phone_number != '' && name_sender != null && email != null && phone_number != null && region_id !== null) {
    
        const cuerpo = `{
          "user_id": ${this.id},
          "name_sender": "${name_sender}",
          "email": "${email}",
          "company": "${company}",
          "phone_number": "${phone_number}",
          "phone_type": "${this.phone_type}",
          "country_id": ${this.country_id},
          "region_id": ${region_id},
          "city": "${this.city}",
          "product_id": ${this.product_id},
          "facebook_lead_id": "${this.facebook_lead_id}",
          "channel": "${this.channel}",
          "postal_code": ${this.postal_code},
          "lead_uuid": "${this.lead_uuid}",
          "registered_at": "${this.dateComplete}"
        }`; 

        const options = {
          headers: new HttpHeaders().set(
            'Content-Type',
            'application/json'
          )
        }; 

        console.log(cuerpo);
      
        return new Promise((resolve, reject) => {
          const url = 'https://www.koomkin.com.mx/api/leads/register';
          this.http.post(url, cuerpo, options).subscribe(
            data => {
              console.log(data);
              loading.dismiss();
              this.showSuccessLead();
              this.app.getRootNav().setRoot('InicioPage'); 
              resolve();
            },
            err => {
                console.log(err);
                if (err.statusText === 'OK') {
                  loading.dismiss();
                  this.showSuccessLead();
                  this.app.getRootNav().setRoot('InicioPage'); 
                } else { 
                  loading.dismiss();
                  this.showSuccessError();
                }
            }
          );
        }); 
      } 
  }

  public validarCampos() {
    const today: any = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; 
    const yyyy: any = today.getFullYear();
    const d = new Date();
    const n = d.toLocaleTimeString();
    if (dd < 10) {
      dd = '0' + dd;
    } 

    if ( mm < 10) {
      mm = '0' + mm;
    } 

    this.name_sender = this.registerForm.get('name_sender').value;
    this.company = this.registerForm.get('company').value;
    this.email = this.registerForm.get('email').value;
    this.phone_number = this.registerForm.get('phone_number').value,
    this.state = this.registerForm.get('state').value;
    if (this.company.length == 0) {
      this.company = 'Particular';
    }
    if (this.state == 'Nuevo León') {
      this.state = 'Nuevo Leon';
    } 
    if (this.state.length == 0) {
      this.state = 'Mexico';
    }
    this.cat_estados.forEach(element => {
      if (element['NOMBRE'] == this.state) {
        this.region_id = element['IDESTADO'];
      }
    });
    this.date = this.registerForm.get('date').value;
    if (this.date.length > 0 && this.hour.length > 0) {
      this.dateComplete = this.date.replace (/-/g, '') + ' ' + this.hour;
    } else if (this.date.length > 0 && this.hour.length == 0) {
      this.dateComplete = this.date.replace (/-/g, '') + ' ' + n;
    } else if (this.date.length == 0 && this.hour.length > 0) {
      this.dateComplete = yyyy + '' + mm + '' + dd  + ' ' + this.hour;
    } else {
      this.dateComplete = yyyy + '' + mm + '' + dd  + ' ' + n;
    }
    console.log(this.dateComplete);
    this.validar_email(this.email);
  }

  validar_email(data) {
    const re = /^(([^<>()[\]\.,;:\s@\']+(\.[^<>()[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i;
    if (re.test(data)) {
      this.email = data;
      this.registerLead(this.name_sender, this.email, this.company, this.phone_number, this.region_id);
    } else {
      Swal('No se ha agregado el lead por que el correo no es válido','', 'error');
    }
  }

  public showSuccessLead() {
    Swal({
      title: 'El lead se ha agregado con éxito',
      text: 'Recarga la página para visualizarlo',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

  public showSuccessError() {
    Swal({
      title: 'El lead no se ha agregado ',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

  getEstados() {
    this.restService.getEstados().then(
      data => {
        this.cat_estados = data;
        // console.log(data);
      },
      err => {
        // console.log('error');
      }
    );
  }

  public getInsertClickPagina() {
    const usuario = this.id;
    const pagina = "agregarLead";
    const acceso = "App";
    //  // console.log(usuario, pagina, acceso);
    this.restService.getInsertClickPagina(usuario, pagina, acceso).then(
      data => {
        // this.datosenvio = data;
      },
      err => {
        // console.log("error");
      }
    );
  }

}
