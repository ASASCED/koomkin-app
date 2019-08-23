import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Market } from '@ionic-native/market';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: "banner",
  templateUrl: "banner.html"
})
export class BannerComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() img: string;
  @Input() notification: string;
  @Input() uuidPass: string;
  @Input() idReportBanner: string;
  @Input() fondo: string;
  @Input() description: string;
  @Input() tipoBanner;
  
  public notificacion;
  public idReporteBanner;
  public uuidPase;
  public tipo;
  public id;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private market: Market
  ) {
      this.id = this.authService.id;
    }

  ngOnInit() {
    this.notificacion = this.notification;
    this.idReporteBanner = this.idReportBanner;
    this.uuidPase = this.uuidPass;
    this.tipo = this.tipoBanner;
    console.log(this.tipo, this.description);
  }

  mostrar_modal() {
    this.navCtrl.setRoot('ModalNotificationPage', { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  mostrar_encuesta() {
    this.navCtrl.setRoot('ModalSurveyPage', { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  mostrar_comunicado() {
    this.navCtrl.setRoot('ModalReleasePage', { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  goStore(){
    if (this.platform.is('cordova')) {
      this.market.open('com.koomkin.koomkinapp');
    }
  }

}

