import {Component} from '@angular/core';
import {IonicPage, LoadingController, MenuController, ModalController, NavController, NavParams} from 'ionic-angular';
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {HttpClient} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-ayuda',
  templateUrl: 'ayuda.html',
})
export class AyudaPage {

  buttons = [
    {area: 7, ticket_type: 8, text: 'Renovaciones'},
    {area: 7, ticket_type: 9, text: 'Garantía'},
    {area: 6, ticket_type: 10, text: 'Cantidad de leads'},
    {area: 7, ticket_type: 11, text: 'Me llegan leads de otro estado/zona'},
    {area: 7, ticket_type: 12, text: 'No me responden'},
    {area: 7, ticket_type: 13, text: 'No es lo que vendo '},
    {area: 8, ticket_type: 14, text: 'No veo mis anuncios'},
    {area: 7, ticket_type: 15, text: 'Explíquenme como usar la aplicación'},
    {area: 9, ticket_type: 16, text: 'Aplicación'},
    {area: 7, ticket_type: 17, text: 'Quiero mi factura'},
    {area: 7, ticket_type: 18, text: 'Quiero mi contrato'},
    {area: 7, ticket_type: 19, text: 'Actualizar método de pago'},
    {area: 7, ticket_type: 20, text: 'Olvidé mi contraseña'},
    {area: 7, ticket_type: 21, text: 'Otro'},
  ];

  currentIssue: any;
  issueComments: string;
  user_id: number;
  user_name: string;
  config: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl: MenuController,
              public authService: AuthServiceProvider,
              private modal: ModalController,
              public http: HttpClient,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.user_id = this.authService.id;
    this.user_name = this.authService.name;
    this.getConfig();
  }

  setIssue(issue) {
    this.currentIssue = issue;
  }

  requestTicket() {
    const url = 'http://3.85.35.123:5011/register_ticket';
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
          data: response,
          requestCall: this.config.ask_chat_after_poll
        },
        {enableBackdropDismiss: true, cssClass: "Modal-ayuda"}
      );
      myModal.present();
      myModal.onDidDismiss(() => {
      });
      this.issueComments = '';
      this.currentIssue = {};
    }).catch((error: any) => {
      console.log(error);
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
