import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, App, MenuController, Platform } from "ionic-angular";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient } from "@angular/common/http";
import { AlertController } from "ionic-angular";
import { Market } from '@ionic-native/market';

@IonicPage()
@Component({
  selector: 'page-modal-release',
  templateUrl: 'modal-release.html',
})
export class ModalReleasePage {

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public viewCtrl: ViewController,
    public http: HttpClient,
    public app: App,
    private menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public platform: Platform,
    private market: Market
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

  public irInicio() {
    this.app.getRootNav().setRoot('InicioPage'); 
  }

  goStore(){
    if (this.platform.is('cordova')) {
      this.market.open('com.koomkin.koomkinapp');
    }
  }
}
