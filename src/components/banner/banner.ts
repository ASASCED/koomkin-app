import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';
import { ModalNotificationPage } from '../../pages/modal-notification/modal-notification';
import { HttpClient } from '@angular/common/http';

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

  public titulo;
  public mensaje;
  public imagen;
  public notificacion;
  public idReporteBanner;
  public uuidPase;
  public fondito;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient) {
   // console.log(this.title);
  }

  ngOnInit() {
    this.titulo = this.title;
    this.mensaje = this.subtitle;
    this.imagen = this.img;
    this.fondito = this.fondo;
    this.notificacion = this.notification;
    this.idReporteBanner = this.idReportBanner;
    this.uuidPase = this.uuidPass;
  }

  public abriPagina() {
    console.log('Click');
  }

  mostrar_modal() {
    this.navCtrl.push(ModalNotificationPage, { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner, uuidPase:this.uuidPase });
  }

  public registrarEntradaBanner() {
    return new Promise((resolve, reject) => {
      const urlEntradaBanner = "http://www.koomkin.com:4859/registrarEntradaBanner/" + this.idReporteBanner;
      this.http.get(urlEntradaBanner).subscribe(
        data => {
          console.log(urlEntradaBanner);
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
}
