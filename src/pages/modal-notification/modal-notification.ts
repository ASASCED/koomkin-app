import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, App, MenuController } from "ionic-angular";
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
  public tipoBanner;
  public aceptar_color_notificacion;
  public cancelar_color_notificacion;
  public modal_titulo_notificacion;
  public modal_subtitulo_notificacion;
  public modal_mensaje_notificacion;
  public modal_titulo_no_notificacion;
  public modal_subtitulo_no_notificacion;
  public modal_mensaje_no_notificacion;
  public p1_estilo_notificacion;
  public p2_estilo_notificacion;
  public p3_estilo_notificacion;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public viewCtrl: ViewController,
    public http: HttpClient,
    public app: App,
    private menuCtrl: MenuController,
    public alertCtrl: AlertController
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.notificacion = navParams.get("notificacion");
    this.idReporteBanner = navParams.get("idReporteBanner");
    this.tipoBanner = navParams.get("tipo");
    this.uuidPase = navParams.get("uuidPase");
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }
  
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
    this.aceptar_color_notificacion = this.notificacion.aceptar_color;
    this.cancelar_color_notificacion = this.notificacion.cancelar_color;
    this.modal_titulo_notificacion = this.notificacion.modal_titulo;
    this.modal_subtitulo_notificacion = this.notificacion.modal_subtitulo;
    this.modal_mensaje_notificacion = this.notificacion.modal_mensaje;
    this.modal_titulo_no_notificacion = this.notificacion.modal_titulo_no;
    this.modal_subtitulo_no_notificacion = this.notificacion.modal_subtitulo_no;
    this.modal_mensaje_no_notificacion = this.notificacion.modal_mensaje_no;
    this.p1_estilo_notificacion = this.notificacion.p1_estilo;
    this.p2_estilo_notificacion = this.notificacion.p2_estilo;
    this.p3_estilo_notificacion = this.notificacion.p3_estilo;
  
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
        "https://www.koomkin.com.mx/api/app/registrarInteresBanner/" + interes + "/" + this.idReporteBanner + "/" + this.uuidPase;
      this.http.get(urlBanner).subscribe(
        data => {
          resolve();
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: this.modal_titulo_notificacion,
      subTitle: this.modal_subtitulo_notificacion,
      buttons: [this.modal_mensaje_notificacion]
    });
    alert.present();
  }

  showAlertNo() {
    const alert = this.alertCtrl.create({
      title: this.modal_titulo_no_notificacion,
      subTitle: this.modal_subtitulo_no_notificacion,
      buttons: [this.modal_mensaje_no_notificacion]
    });
    alert.present();
  }

  public irInicio() {
    this.app.getRootNav().setRoot('InicioPage'); 
  }
}