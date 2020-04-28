import {Component, Input} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ViewController
} from "ionic-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import swal from "sweetalert2";

@IonicPage()
@Component({
  selector: "page-modal-upsells",
  templateUrl: "modal-upsells.html"
})
export class ModalUpsellsPage {
  @Input() data: any;

  currentPlan: any;
  increase30Plan: any;
  increase50Plan: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public authService: AuthServiceProvider,
              public http: HttpClient,
              public loadingCtrl: LoadingController) {
    this.data = navParams.get("data");

    for (const plan of this.data.offers) {
      if (plan.perc_increase === 30) {
        this.increase30Plan = plan;
      } else if (plan.perc_increase === 50) {
        this.increase50Plan = plan;
      }
    }
  }

  ngOnInit() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  applyUpsell(new_plan_id) {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    };

    const body = {
      upsell_offer_id: this.data.upsell_offer_id,
      new_plan_id: new_plan_id
    };

    let loading = this.loadingCtrl.create({
      content: "Aplicando aumento a tu membresía"
    });

    loading.present();

    this.http.post('https://www.koomkin.com.mx/api/payment/upsell/apply', body, options)
      .toPromise().then((response: any) => {
      loading.dismiss();
      swal({
        title: 'Muy bien',
        text: 'El aumento a tu membresía ha sido guardado',
        type: 'success'
      });
      this.closeModal();
    }).catch((error: any) => {
      this.closeModal();
      swal({
        title: 'Oh no',
        text: 'Ha ocurrido un error al hacer el aumento de tu membresía',
        type: 'error'
      });
    });
  }
}
