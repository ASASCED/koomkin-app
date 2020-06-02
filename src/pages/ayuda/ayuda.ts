import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {HttpClient} from "@angular/common/http";
import swal from "sweetalert2";

@IonicPage()
@Component({
  selector: 'page-ayuda',
  templateUrl: 'ayuda.html',
})
export class AyudaPage {

  buttons = [
    {area: 2, ticket_type: 1, text: 'Renovaciones'},
    {area: 2, ticket_type: 2, text: 'Garantía'},
    {area: 3, ticket_type: 3, text: 'Cantidad de leads'},
    {area: 3, ticket_type: 4, text: 'Me llegan leads de otro estado/zona'},
    {area: 2, ticket_type: 5, text: 'No me responden'},
    {area: 3, ticket_type: 6, text: 'No es lo que vendo '},
    {area: 3, ticket_type: 7, text: 'No veo mis anuncios'},
    {area: 2, ticket_type: 8, text: 'Explíquenme como usar la aplicación'},
    {area: 4, ticket_type: 9, text: 'Aplicación'},
    {area: 1, ticket_type: 10, text: 'Quiero mi factura'},
    {area: 1, ticket_type: 11, text: 'Quiero mi contrato'},
    {area: 2, ticket_type: 12, text: 'Actualizar método de pago'},
    {area: 2, ticket_type: 13, text: 'Olvidé mi contraseña'},
    {area: 2, ticket_type: 14, text: 'Otro'},
  ];

  currentIssue: any;
  issueComments: string;
  user_id: number;
  user_name: string;
  config: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthServiceProvider,
              private modal: ModalController,
              public http: HttpClient,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.user_id = this.authService.id;
    this.user_name = this.authService.name;
    // this.getConfig();
  }

  setIssue(issue) {
    console.log(issue);
    this.currentIssue = issue;
  }

  requestTicket() {
    const url = 'https://www.koomkin.com.mx/api/customer_service/register_ticket';
    const body = {
      user_id: this.user_id,
      description: this.issueComments,
      area: this.currentIssue.area,
      ticket_type: this.currentIssue.ticket_type
    };

    let loading = this.loadingCtrl.create({
      content: "Creando ticket, espera un momento."
    });

    loading.present();

    this.http.post(url, body).toPromise().then((response: any) => {
      loading.dismiss();
      const myModal = this.modal.create(
        'ModalHelpPage',
        {
          data: response
        },
        {enableBackdropDismiss: true, cssClass: "Modal-ayuda"}
      );
      myModal.present();
      myModal.onDidDismiss(() => {
      });
      this.issueComments = '';
      this.currentIssue = {};
    }).catch((error: any) => {
      loading.dismiss();
      console.log(error);
      swal({
        title: 'Ha occurido un error',
        text: 'Ha ocurrido un error al guardar tu ticket: ' + JSON.stringify(error),
        type: 'error'
      });
    });
  }

  checkStatusTicket() {
    try {
      return typeof this.currentIssue.ticket_type !== 'undefined' && this.issueComments.length > 0;
    } catch (e) {
      return false;
    }
  }

  getConfig() {
    this.http.get('https://www.koomkin.com.mx/api/app2/conf').toPromise().then((response: any) => {
      this.config = response.customer_service;
    });
  }
}
