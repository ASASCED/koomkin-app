import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient } from "@angular/common/http";
import { AlertController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-modal-notification",
  templateUrl: "modal-notification.html"
})
export class ModalNotificationPage implements OnInit {
  public id;
  public empresa;
  public notificacion;
  public titulo_notificacion;
  public mensaje_notificacion;
  public cancelar_notificacion;
  public aceptar_notificacion;
  public imagen_notificacion;
  public idReporteBanner;
  public uuidPase;
  public parrafos: string[];
  public parrafo;
  public parrafo1;
  public parrafo2;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public viewCtrl: ViewController,
    public http: HttpClient,
    public alertCtrl: AlertController
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.notificacion = navParams.get("notificacion");
    this.idReporteBanner = navParams.get("idReporteBanner");
    this.uuidPase = navParams.get("uuidPase");
  }

  ionViewDidLoad() {}

  dismiss() {
    let data = { foo: "bar" };
    this.viewCtrl.dismiss(data);
  }

  ngOnInit() {
    this.aceptar_notificacion = this.notificacion.aceptar;
    this.cancelar_notificacion = this.notificacion.cancelar;
    this.mensaje_notificacion = this.notificacion.mensaje;
    this.titulo_notificacion = this.notificacion.titulo;
    this.imagen_notificacion = this.notificacion.img;
    console.log();
    this.parrafos = this.mensaje_notificacion.split("-*");

    if (this.parrafos.length == 3) {
      this.parrafo = this.parrafos[0];
      this.parrafo1 = this.parrafos[1];
      this.parrafo2 = this.parrafos[2];
    } else if (this.parrafos.length == 2) {
      this.parrafo = this.parrafos[0];
      this.parrafo1 = this.parrafos[1];
    } else if (this.parrafos.length == 1) {
      this.parrafo = this.parrafos[0];
    }
    
  }

  public registrarInteres(interes: number) {
    return new Promise((resolve, reject) => {
      const urlBanner =
        "http://www.koomkin.com:4859/registrarInteresBanner/" +
        interes +
        "/" +
        this.idReporteBanner +
        "/" +
        this.uuidPase;
      this.http.get(urlBanner).subscribe(
        data => {
          console.log(urlBanner);
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "¡Gracias!",
      subTitle: "Pronto nos pondremos en contacto contigo.",
      buttons: ["OK"]
    });
    alert.present();
  }

  showAlertNo() {
    const alert = this.alertCtrl.create({
      title: "¡Gracias por tu respuesta!",
      buttons: ["OK"]
    });
    alert.present();
  }
}
