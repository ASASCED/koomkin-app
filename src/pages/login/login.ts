import { Component, OnInit } from '@angular/core';
import { MenuController, IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from '../../providers/rest/rest';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LeadsPage } from '../leads/leads'
import { Md5 } from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  userdata: any;
  loading: any;
  loginForm: FormGroup;
  data: any;
  datos;
  leads;
  email;
  password;
  acceso;
  id;

  erroresForm = {
    'email': '',
    'password': ''
  }

  mensajesValidacion = {
    'email': {
      'required': 'Correo Electronico obligatorio',
      'email': 'Introduzca un Correo Electronico correcto'
    },
    'password': {
      'required': 'Contraseña obligatoria',
      'password': 'La contraseña esta incorrecta'
    }
  }

  constructor(public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public restService: RestProvider,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController, 
    private menuCtrl: MenuController
  ) { 
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
   }


  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
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
    this.loginForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    })
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data))
    this.onValueChanged();
  }

  public saveUserdata() {
    let saveUserdata = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }
    return saveUserdata;
  }

  public doLogin() {
    this.userdata = this.saveUserdata();
    this.email = this.userdata.email;
    this.password = this.userdata.password;
    this.showLoader();
    this.authService.getUserByEmail(this.email).then((data) => {
      this.leads = data;
      //console.log(this.leads);
      if (this.leads.length > 0) {
        this.id = this.leads[0].IDUSUARIO;
        if (Md5.hashStr(this.password) === this.leads[0].PASSWORD2) {
          this.restService.setUser(this.id);
          //  console.log("entro");
          this.navCtrl.setRoot(LeadsPage);
        } else {
          this.showError();
        }
      } else if (this.leads.length == 0) {
        this.showError();
      }
      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();
      this.showError();
      console.log(err);
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Iniciando Sesión...'
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 5000);
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: "Verifica tu correo y/o contraseña",
      subTitle: 'Intenta de nuevo.',
      buttons: ['OK']
    });
    alert.present();
  }

}
