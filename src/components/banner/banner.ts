import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ModalNotificationPage } from '../../pages/modal-notification/modal-notification';
import { HttpClient } from '@angular/common/http';
import { Market } from '@ionic-native/market';
import { ModalSurveyPage } from '../../pages/modal-survey/modal-survey';

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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: HttpClient,
    private market: Market) {
  }

  ngOnInit() {
    this.notificacion = this.notification;
    this.idReporteBanner = this.idReportBanner;
    this.uuidPase = this.uuidPass;
    this.tipo = this.tipoBanner;
  }

  mostrar_modal() {
    this.navCtrl.push(ModalNotificationPage, { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  mostrar_encuesta() {
    this.navCtrl.push(ModalSurveyPage, { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  goStore(){
    if (this.platform.is('cordova')) {
      this.market.open('com.koomkin.koomkinapp');
    }
  }
}

