import { Component, ViewChild, NgZone } from '@angular/core';
import { MenuController, Nav, NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from './../pages/login/login';
import { LeadsPage } from './../pages/leads/leads';
import { LeadPage } from './../pages/lead/lead';
import { ReportePage } from './../pages/reporte/reporte';
import { UsuarioPage } from './../pages/usuario/usuario';
import { FacturasPage } from './../pages/facturas/facturas';
import { FacturaPage } from '../pages/factura/factura';
import { DatosPage } from '../pages/datos/datos';
import { CancelarPage } from '../pages/cancelar/cancelar';
import { PreguntaPage } from './../pages/pregunta/pregunta';
import { InicioPage } from '../pages/inicio/inicio';
import { EficienciaPage } from '../pages/eficiencia/eficiencia';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { AuthServiceProvider } from "../providers/auth-service/auth-service";
import { RestProvider } from "../providers/rest/rest";

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

// declare var UXCam: any;

@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: NavController;

  rootPage: any = LoginPage;
  leads = LeadsPage;
  reporte = ReportePage;
  datos = DatosPage;
  facturas = FacturasPage;
  usuario = UsuarioPage;
  factura = FacturaPage;
  cancelar = CancelarPage;
  pregunta = PreguntaPage;
  login = LoginPage;
  lead = LeadPage;
  inicio = InicioPage;
  eficiencia = EficienciaPage;

  apiUrl1 = 'https://fierce-spire-89861.herokuapp.com';
  apiUrl0 = 'http://localhost:3000';
  apiUrl = 'https://www.koomkin.com.mx/api/app';

  pages: Array<{ title: string, component: any }>;

  constructor(public plt: Platform,
    public zone: NgZone,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
    public http: HttpClient,
    public storage: Storage,
    private screenOrientation: ScreenOrientation) {

    this.initializeApp();

    this.pages = [
      { title: 'Reporte', component: ReportePage },
      { title: 'Leads', component: LeadsPage },
      { title: 'Datos', component: DatosPage },
      { title: 'Facturas', component: FacturasPage },
      { title: 'Usuario', component: UsuarioPage },
      { title: 'Factura', component: FacturaPage },
      { title: 'Cancelar', component: CancelarPage },
      { title: 'Pregunta', component: PreguntaPage },
      { title: 'Lead', component: LeadPage },
      { title: 'Login', component: LoginPage },
      { title: 'Inicio', component: InicioPage },
      { title: 'Eficiencia', component: EficienciaPage }
    ];

  }


  initializeApp() {
    if (this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }

    this.platform.ready().then(() => {

      //UXCam.startWithKey('d9f707635967f38', function () { alert('start ssss') }, function (err) { alert(err) });
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //window["plugins"].UXCam.startWithKey("d9f707635967f38");
      //window["UXCam"].startWithKey('d9f707635967f38', function () { alert('start ssss') }, function () { alert('start error') });
      //UXCam.startWithKey('d9f707635967f38', function () { alert('start ssss') }, function () { // console.log('start error') })

      var notificationOpenedCallback = ((jsonData) => {


        var notif_additional_data = jsonData.notification.payload.additionalData;
        const actionButtonPressed = jsonData.action.actionID;

        if (notif_additional_data) {

          if (actionButtonPressed) {
            if (actionButtonPressed === 'like-button') {
              this.calificaLeadNotificacion(notif_additional_data.leadId, "like");
              //// console.log("like-button pressed");
              notif_additional_data.leadInfo.calificaLead = 'like';
            } else if (actionButtonPressed === 'unlike-button') {
              this.calificaLeadNotificacion(notif_additional_data.leadId, "unlike");
             // // console.log("unlike-button pressed");
              notif_additional_data.leadInfo.calificaLead = 'dislike';
            } else {
             // // console.log("notification opened while app is active. User pressed ok button");
            }
          } else {
           // // console.log("notification opened on the notification list of the phone");
          }

          if (this.authService.getUserIsLogged() === true) {

            if(notif_additional_data.leadInfo){
              notif_additional_data.leadInfo["desdeNotificacion"] = true;
            }
           // // console.log(JSON.stringify(notif_additional_data.leadInfo));
            this.zone.run(() => {
              if(notif_additional_data.chatMessage){
                notif_additional_data.leadInfo["gotopage"] = 'Chat';
                if(this.nav.getActive().name === 'LeadPage'){
                  this.nav.pop().then(()=>{
                    this.nav.push(this.lead, notif_additional_data.leadInfo);
                  });
                }else{
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              } else if (notif_additional_data.efcom) {

                this.nav.push(this.eficiencia).then(()=>{

                });

              }else{
                if(this.nav.getActive().name === 'LeadPage'){
                  this.nav.pop().then(()=>{
                    setTimeout(()=>{
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 300);
                  });
                }else{
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              }
            });
          } else {

            if(notif_additional_data.leadInfo){
              notif_additional_data.leadInfo["desdeNotificacion"] = true;
              notif_additional_data.leadInfo["loggedout"] = true;
            }
          //  // console.log(JSON.stringify(notif_additional_data.leadInfo));
            this.zone.run(() => {

              if(notif_additional_data.chatMessage){
                notif_additional_data.leadInfo["gotopage"] = 'Chat';
                if(this.nav.getActive().name === 'LeadPage'){
                  this.nav.pop().then(()=>{
                    setTimeout(()=>{
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 400);
                  });
                }else{
                  setTimeout(()=>{
                    this.nav.push(this.lead, notif_additional_data.leadInfo);
                  }, 400);
                }
              } else {
                //setTimeout(function(){ this.nav.push(this.lead, notif_additional_data.leadInfo); }, 2000);
                if(this.nav.getActive().name === 'LeadPage'){
                  this.nav.pop().then(()=>{
                    setTimeout(()=>{
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 400);
                  });
                }else{
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              }
            });
          }
        }
      });
      if (this.plt.is('ios')) {
        window["plugins"].OneSignal
          // iOS
          .startInit("45c5c7f2-ada0-4af8-8770-15f6d23b748a")
          .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      } else if (this.plt.is('android')) {
        window["plugins"].OneSignal
          // Android
          .startInit("45c5c7f2-ada0-4af8-8770-15f6d23b748a", "752791692323")
          .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  pagina(pagina: any) {
    this.nav.setRoot(pagina);
    this.menuCtrl.close();
  }

  calificaLeadNotificacion(leadID: number, calificacion: string) {
    this.http.get(this.apiUrl + "/calificaLead2/" + leadID + '/' + calificacion + '/notificacion')
      .subscribe(data => {
        // console.log("calificado exitosamente desde notificación");
      },
        err => {
          // console.log("Error calificando desde notificacion");
        });
  }

  checkPreviousAuthorization(): void {
    if ((window.localStorage.getItem('email') === "undefined" || window.localStorage.getItem('email') === null) &&
      (window.localStorage.getItem('password') === "undefined" || window.localStorage.getItem('password') === null)) {
      this.authService.setUserIsLogged(false);
    } else {
      this.authService.setUserIsLogged(true);
    }
  }

  cerrarSesion() {
    this.authService.setUserIsLogged(false);
    // console.log("LOG OUT");
    this.storage.remove('email');
    this.storage.remove('password');
  }

}
