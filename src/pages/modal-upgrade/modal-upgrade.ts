import { Component, Input, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { RestProvider } from "../../providers/rest/rest";
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-modal-upgrade',
  templateUrl: 'modal-upgrade.html',
})
export class ModalUpgradePage {

  @Input() notification: string;
  @Input() uuidPass: string;
  @Input() idReportBanner: string;
  @Input() tipoBanner;

  public idRecurrente;
  public uuidRecurrente;
  public selectedAmount = 250;
  public recurrente;
  public id;
  public notificacion;
  public idReporteBanner;
  public uuidPase;
  public tipo;
  public banner1 = ["meme1", "grafica"];
  public banner2 = ["meme2", "flecha"];
  public upgrade = ["upgrade", "upgrade2"];
  public banner;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthServiceProvider,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public provedor: RestProvider,
  ) {
    this.id = this.authService.id;
    this.recurrente = this.authService.recurrente;
    this.idRecurrente = this.authService.idRecurrente;
    this.uuidRecurrente = this.authService.uuidRecurrente;
    this.tipo = navParams.get("tipoBanner");
    this.notificacion = navParams.get("notification");
    this.idReporteBanner = navParams.get("idReportBanner");
    this.uuidPase = navParams.get("uuidPass");
  }

  ngOnInit() {
    if(this.tipo == 16) {
      this.getRandomImage(this.banner1);
      this.selectedAmount = 250;
    } else if(this.tipo == 17) {
      this.getRandomImage(this.banner2);
      this.selectedAmount = 350;
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
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
      }
    });
  }

  public getUpgradeMembership() {
    this.provedor.getUpdateMembership(this.idRecurrente, this.uuidRecurrente, this.selectedAmount)
      .then(
        (data) => {
          let upsell_id = data[0].ID;
          this.immediateUpsell(upsell_id);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public getDowngradeMembership(upsell_id) {
    this.provedor.getDowngradeMembership(upsell_id)
      .then(
        (data) => {

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
    }).catch(reason => { console.log(reason) });
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/immediateUpsell';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          if (data['result'] == 'OK') {
            loading.dismiss();
            this.showSuccessUpgrade();
            this.navCtrl.setRoot('InicioPage');
            this.getInsertUpgradeMembresia();
            this.registrarInteres(0);
          } else if (data['result'] == 'Upsell aplicado pero no se aplicó el cargo. Se intentará en el siguiente pago recurrente.') {
            loading.dismiss();
            this.getDowngradeMembership(upsell_id);
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
    let acceso = 'popup';

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
    console.log(interes + "/" + this.idReporteBanner + "/" + this.uuidPase);
    return new Promise((resolve, reject) => {
      const urlBanner = "https://www.koomkin.com.mx/api/app/registrarInteresBanner/" + interes + "/" + this.idReporteBanner;
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
      text: 'Por facor comunicate a servicio a cliente.',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

  public getRandomImage(imgAr) {
    let num = Math.floor(Math.random() * imgAr.length);
    this.banner = imgAr[num];
  }
}
