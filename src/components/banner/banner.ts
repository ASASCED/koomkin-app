import { Component, Input, OnInit } from "@angular/core";
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  public selectedAmount = 250;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public platform: Platform,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public provedor: RestProvider,
    private market: Market
  ) {
      this.id = this.authService.id;
      this.recurrente = this.authService.recurrente;
      this.idRecurrente = this.authService.idRecurrente;
      this.uuidRecurrente = this.authService.uuidRecurrente;
      console.log(this.idRecurrente, this.uuidRecurrente);
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
        this.registrarInteres(0);
      }
    });
  }  
  
  public getUpgradeMembership() {
    this.provedor.getUpdateMembership(this.idRecurrente, this.uuidRecurrente, this.selectedAmount) 
      .then(
        (data) => {
          console.log(data);
          let upsell_id = data[0].ID;
          this.immediateUpsell(upsell_id);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public immediateUpsell(upsell_id) {

    let loading = this.loadingCtrl.create({
      content: "Realizando pago..."
    });

    const cuerpo = `{'user_id': '${this.id}', 'upsell_id': '${upsell_id}'}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };
    
    loading.present().then(() => {
    }).catch(reason => {console.log(reason)});
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/immediateUpsell';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          console.log(data);
          console.log(data['result']);
          if(data['result'] == 'OK') {
            loading.dismiss();
            this.showSuccessUpgrade();
            this.navCtrl.setRoot('InicioPage');
          } else if(data['result'] == 'Upsell aplicado pero no se aplicó el cargo. Se intentará en el siguiente pago recurrente.') {
            loading.dismiss();
            this.showErrorUpgrade();
            this.navCtrl.setRoot('InicioPage');
          } 
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
    
  }

  public getInsertUpgradeMembresia() {
    let acceso = 'banner';

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

  public showSuccessUpgrade() {
    swal({
      title: 'Se ha realizado el Upgrade con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showErrorUpgrade() {
    swal({
      title: 'No se ha podido realizar el Upgrade.',
      text: 'Se intentará en el siguiente pago recurrente.',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

}

