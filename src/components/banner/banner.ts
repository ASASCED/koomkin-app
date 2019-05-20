import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Market } from '@ionic-native/market';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import swal from 'sweetalert2';
import { RestProvider } from "../../providers/rest/rest";

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
  
  public recurrente;
  public notificacion;
  public idReporteBanner;
  public uuidPase;
  public tipo;
  public id;
  public idRecurrente;
  public uuidRecurrente;
  public selectedAmount = 500;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public platform: Platform,
    public http: HttpClient,
    public provedor: RestProvider,
    private market: Market) {
      this.id = this.authService.id;
      this.recurrente = this.authService.recurrente;
      this.idRecurrente = this.authService.idRecurrente;
      this.uuidRecurrente = this.authService.uuidRecurrente;
    }

  ngOnInit() {
    this.notificacion = this.notification;
    this.idReporteBanner = this.idReportBanner;
    this.uuidPase = this.uuidPass;
    this.tipo = this.tipoBanner;
  }

  mostrar_modal() {
    this.navCtrl.setRoot('ModalNotificationPage', { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  mostrar_encuesta() {
    this.navCtrl.setRoot('ModalSurveyPage', { notificacion: this.notificacion, idReporteBanner: this.idReporteBanner,tipo: this.tipo, uuidPase:this.uuidPase });
  }

  goStore(){
    if (this.platform.is('cordova')) {
      this.market.open('com.koomkin.koomkinapp');
    }
  }

  public btnUpgradeMembership() {

    swal({
      title: 'Confirma el incremento de $' + this.selectedAmount + 'MXN',
      text: 'Además tomaremos este monto para tu nueva Membresía',
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#2AB4BC',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.getUpgradeMembership();
        this.getInsertUpgradeMembresia();
      }
    });
  }  
  
  public getUpgradeMembership() {
    this.provedor.getUpdateMembership(this.idRecurrente, this.uuidRecurrente, this.selectedAmount) 
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getInsertUpgradeMembresia() {
    let acceso = 'pagina';

    this.provedor.getInsertUpgradeMembresia(this.id, this.idRecurrente, acceso)
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}

