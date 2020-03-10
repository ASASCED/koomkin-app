import { Component, ViewChild, NgZone } from "@angular/core";
import { MenuController, Nav, NavController, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { AuthServiceProvider } from "../providers/auth-service/auth-service";
import { RestProvider } from "../providers/rest/rest";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: NavController;

  rootPage: any = "FlowchartPage";
  leads = "LeadsPage";
  reporte = "ReportePage";
  datos = "DatosPage";
  facturas = "FacturasPage";
  usuario = "UsuarioPage";
  factura = "FacturaPage";
  cancelar = "CancelarPage";
  pregunta = "PreguntaPage";
  login = "LoginPage";
  lead = "LeadPage";
  inicio = "InicioPage";
  eficiencia = "EficienciaPage";
  masbrief = "MasBriefPage";
  membresia = "MembresiaPage";
  datosFinancieros = "DatosFinancierosPage";

  apiUrl = "https://www.koomkin.com.mx/api/app";

  pages: Array<{ title: string; component: any }>;

  constructor(
    public plt: Platform,
    public zone: NgZone,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public provedor: RestProvider,
    public http: HttpClient,
    public storage: Storage,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (this.platform.is("cordova")) {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      var notificationOpenedCallback = jsonData => {
        var notif_additional_data =
          jsonData.notification.payload.additionalData;
        const actionButtonPressed = jsonData.action.actionID;

        if (notif_additional_data) {
          if (actionButtonPressed) {
            if (actionButtonPressed === "like-button") {
              this.calificaLeadNotificacion(
                notif_additional_data.leadId,
                "like"
              );
              //// console.log("like-button pressed");
              notif_additional_data.leadInfo.calificaLead = "like";
            } else if (actionButtonPressed === "unlike-button") {
              this.calificaLeadNotificacion(
                notif_additional_data.leadId,
                "unlike"
              );
              // // console.log("unlike-button pressed");
              notif_additional_data.leadInfo.calificaLead = "dislike";
            }
          }
          if (this.authService.getUserIsLogged() === true) {
            if (notif_additional_data.leadInfo) {
              notif_additional_data.leadInfo["desdeNotificacion"] = true;
            }
            this.zone.run(() => {
              if (notif_additional_data.chatMessage) {
                notif_additional_data.leadInfo["gotopage"] = "Chat";
                if (this.nav.getActive().name === "LeadPage") {
                  this.nav.pop().then(() => {
                    this.nav.push(this.lead, notif_additional_data.leadInfo);
                  });
                } else {
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              } else if (notif_additional_data.efcom) {
                this.nav.push(this.eficiencia).then(() => {});
              } else {
                if (this.nav.getActive().name === "LeadPage") {
                  this.nav.pop().then(() => {
                    setTimeout(() => {
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 300);
                  });
                } else {
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              }
            });
          } else {
            if (notif_additional_data.leadInfo) {
              notif_additional_data.leadInfo["desdeNotificacion"] = true;
              notif_additional_data.leadInfo["loggedout"] = true;
            }
            this.zone.run(() => {
              if (notif_additional_data.chatMessage) {
                notif_additional_data.leadInfo["gotopage"] = "Chat";
                if (this.nav.getActive().name === "LeadPage") {
                  this.nav.pop().then(() => {
                    setTimeout(() => {
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 400);
                  });
                } else {
                  setTimeout(() => {
                    this.nav.push(this.lead, notif_additional_data.leadInfo);
                  }, 400);
                }
              } else {
                //setTimeout(function(){ this.nav.push(this.lead, notif_additional_data.leadInfo); }, 2000);
                if (this.nav.getActive().name === "LeadPage") {
                  this.nav.pop().then(() => {
                    setTimeout(() => {
                      this.nav.push(this.lead, notif_additional_data.leadInfo);
                    }, 400);
                  });
                } else {
                  this.nav.push(this.lead, notif_additional_data.leadInfo);
                }
              }
            });
          }
        }
      };
      if (this.plt.is("ios")) {
        window["plugins"].OneSignal
          // iOS
          .startInit("45c5c7f2-ada0-4af8-8770-15f6d23b748a")
          .inFocusDisplaying(
            window["plugins"].OneSignal.OSInFocusDisplayOption.Notification
          )
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      } else if (this.plt.is("android")) {
        window["plugins"].OneSignal
          // Android
          .startInit("45c5c7f2-ada0-4af8-8770-15f6d23b748a", "752791692323")
          .inFocusDisplaying(
            window["plugins"].OneSignal.OSInFocusDisplayOption.Notification
          )
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
    });
  }

  pagina(pagina: any) {
    this.nav.push(pagina);
    this.menuCtrl.close();
  }

  calificaLeadNotificacion(leadID: number, calificacion: string) {
    this.http
      .get(
        this.apiUrl +
          "/calificaLead2/" +
          leadID +
          "/" +
          calificacion +
          "/notificacion"
      )
      .subscribe(
        data => {
          // console.log("calificado exitosamente desde notificación");
        },
        err => {
          // console.log("Error calificando desde notificacion");
        }
      );
  }

  checkPreviousAuthorization(): void {
    if (
      (window.localStorage.getItem("email") === "undefined" ||
        window.localStorage.getItem("email") === null) &&
      (window.localStorage.getItem("password") === "undefined" ||
        window.localStorage.getItem("password") === null)
    ) {
      this.authService.setUserIsLogged(false);
    } else {
      this.authService.setUserIsLogged(true);
    }
  }

  cerrarSesion() {
    this.authService.setUserIsLogged(false);
    // console.log("LOG OUT");
    this.storage.remove("email");
    this.storage.remove("password");
  }
}
