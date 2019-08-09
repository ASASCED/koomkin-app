import { Component, OnInit } from '@angular/core';
import { MenuController, IonicPage, NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from '../../providers/rest/rest';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

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
  datosenvio;
  key: string = 'usuario';
  user: any = [];
  apiUrl = 'https://www.koomkin.com.mx/api/misc/sendPasswordEmail?email=';
  resultado;
  error;
  envio;
  prompt;
  alert;
  app;
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
    private menuCtrl: MenuController,
    public storage: Storage,
    public plt: Platform,
    private network: Network,
    private toastCtrl: ToastController,
    public http: HttpClient,
    public chatService: ChatServiceProvider
  ) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.showError("Error de conexión.", "Verifica tu conexión a internet.");
      // console.log(disconnectSubscription);
    });
  }

  verificarConexionInternet(){
    if(this.network.type === 'none'){
      this.loading.dismiss();
      this.showError("Error de conexión.","Verifica tu conexión a internet.");
    }
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
    });
    this.loginForm.valueChanges
    .subscribe(data => this.onValueChanged(data))
    this.onValueChanged();
    this.getSesion();
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
    //agregamos esta linea
    this.getIntentoSesion(this.email, this.password);
    this.showLoader();
    this.authService.getUserByEmail(this.email).then((data) => {
      this.loading.dismiss();
      this.leads = data;

      if (this.leads.length > 0) {
        if (this.plt.is('ios') || this.plt.is('android')) {
          window["plugins"].OneSignal.sendTag("email_error", "");
        }
        this.id = this.leads[0].IDUSUARIO;
        if (Md5.hashStr(this.password) === this.leads[0].PASSWORD2) {
          this.restService.setUser(this.id);
         if (this.plt.is('ios') || this.plt.is('android')) {
            window["plugins"].OneSignal.getPermissionSubscriptionState((status) => {
              const deviceId = status.subscriptionStatus.userId;
              this.restService.registerDeviceID(deviceId);
            });
            window["plugins"].OneSignal.sendTag("pwd_error", "");
            window["plugins"].OneSignal.sendTag("email", "");
            window["plugins"].OneSignal.sendTag("id_usuario", this.id);
          }

          this.authService.setUserIsLogged(true);
          this.storage.set('email', this.email);
          this.storage.set('password', this.password);
          
          if(data[0]['uuid']){
            console.log('entro');
            this.iniciarClienteChatTwilio(data[0]['uuid']);
          }
          this.navCtrl.setRoot('InicioPage');
        } else {
          if (this.plt.is('ios') || this.plt.is('android')) {
            window["plugins"].OneSignal.sendTag("email", this.email);
            window["plugins"].OneSignal.sendTag("pwd_error", this.password);
          }
          this.showError('Verifica tu correo y/o contraseña', 'Intenta de nuevo.');
        }
      } else if (this.leads.length == 0) {
        if (this.plt.is('ios') || this.plt.is('android')) {
          window["plugins"].OneSignal.sendTag("email_error", this.email);
        }
        this.showError('Verifica tu correo y/o contraseña', 'Intenta de nuevo.');
      }
    }, (err) => {
      this.loading.dismiss();
      this.showError("Error de conexión.", "No fue posible establecer una conexión con el servidor.\n Verifique su conexión a internet.");
      // console.log(err);
    });

  }

  getSesion() {
    this.storage.get('email').then((val) => {
      this.email = val;
      if (this.email != null && this.email != undefined) {
        this.storage.get('password').then((val) => {
          this.password = val;
          if (this.password != null && this.password != undefined) {
            this.showLoader();
            this.authService.getUserByEmail(this.email).then((data) => {
              this.loading.dismiss();
              this.leads = data;
              if (this.leads.length > 0) {
                this.id = this.leads[0].IDUSUARIO;
                if (Md5.hashStr(this.password) === this.leads[0].PASSWORD2) {
                this.app = this.leads[0].app;
                  this.authService.setUserIsLogged(true);
                  this.restService.setUser(this.id);
                   if (this.plt.is('ios') || this.plt.is('android')) {
                    window["plugins"].OneSignal.getPermissionSubscriptionState((status) => {
                      const deviceId = status.subscriptionStatus.userId;
                      this.restService.registerDeviceID(deviceId);
                    });
                    window["plugins"].OneSignal.sendTag("id_usuario", this.id);
                   }
                  this.storage.set('email', this.email);
                  this.storage.set('password', this.password);
                  if(this.authService.getNotificationActive()){
                    if(data[0]['uuid']){
                      this.iniciarClienteChatTwilio(data[0]['uuid']);
                    }
                    this.authService.setNotificationActive(false);

                  }else{
                    this.navCtrl.setRoot('InicioPage').then(()=>{

                    });
                  }
                  this.iniciarClienteChatTwilio(data[0]['uuid']);
                }
              }
            }, (err) => {
              this.loading.dismiss();
              this.showError("Error de conexión.", "No fue posible establecer una conexión con el servidor.\n Verifique su conexión a internet.");
            });
          }
        });
      }
    });
  }

  //Agrega registros
  getIntentoSesion(email, password) {
   // // console.log(email, password);
    this.restService.getIntentoSesion(email, password).then((data) => {
      this.datosenvio = data;
    }, (err) => {
      this.showError("Error de conexión.", "Verifica tu conexión a internet.")
      //// console.log(email,password);
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Iniciando Sesión...'
    });
    this.loading.present();

  }

  showError(messageTitle: string, messageSubTitle: string) {
    let alert = this.alertCtrl.create({
      title: messageTitle,
      subTitle: messageSubTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  validar_email(data) {
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!re.exec(data.email)) {
      return {
        isValid: true,
        message: ''
      };
    } else {
      return {
        isValid: false,
        message: 'Email Invalido'
      }
    }
  }

  showSucess(){
    this.alert = this.alertCtrl.create({
      title: '¡Listo!',
      subTitle: 'Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña',
      buttons: ['Iniciar Sesión']
    });
    this.alert.present();
  }

  showPrompt() {
    this.prompt = this.alertCtrl.create({
      title: 'Restablecimiento de contraseña',
      subTitle: 'Ingresa el correo electrónico que usaste para registrarte',
      message: "Te enviaremos un correo electrónico para restablecer tu contraseña",
      cssClass: 'buttonCss2',
      inputs: [
        {
          name: 'email',
          placeholder: 'Correo Electrónico'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            let validateObj = this.validar_email(data);
            if (!validateObj.isValid) {
              this.enviarCorreo(data);
              return false;
            } else {
              this.showErrorToast('Ingrese su Correo Electrónico');
              return false;
            }
          }
        }
      ],
      enableBackdropDismiss: false
    });
    this.prompt.present();
  }

  enviarCorreo(data) {
    let email = data.email
    this.http.get(this.apiUrl + email)
      .subscribe(data => {
        this.resultado = data;
        this.resultado = JSON.parse(this.resultado);
        if (this.resultado.result == 'Error') {
          this.showErrorToast('Email Invalido');
        } else if (this.resultado.result == 'OK') {
          this.prompt.dismiss();
          this.showSucess();
        }
      },
        err => {
          // console.log("Error");
        });
  }

  iniciarClienteChatTwilio(uuid: string){
    this.chatService.startChatService(uuid);
  }

}
