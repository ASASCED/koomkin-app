import {Component, Input} from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-modal-help',
  templateUrl: 'modal-help.html',
})
export class ModalHelpPage {

  @Input() data: any;

  private happinessLevel: number;
  page: number;
  private ticket_id: number;
  public config: any;

  constructor(public navParams: NavParams,
              public http: HttpClient) {
    this.happinessLevel = 0;
    this.page = 1;
    this.data = navParams.get("data");
    this.ticket_id = this.data.json_master.ticket_id;
  }

  ionViewDidLoad() {
    this.getConfig();
  }

  setHappinessLevel(level) {
    this.happinessLevel = level;
    this.page = 2;
    const url = 'https://www.koomkin.com.mx/api/customer_service/register_sentiment';
    const body = {
      ticket_id: this.ticket_id,
      sentiment_poll:
        {
          sentiment: this.happinessLevel
        }
    }

    this.http.post(url, body).toPromise().then((response) => {}).catch((error) => {});

    if (this.config === false) {
      this.page = 4;
    }
  }

  requestCall() {
    this.page = 3;
  }

  createTicket() {
    this.page = 4;
  }

  getConfig() {
    this.http.get('https://www.koomkin.com.mx/api/app2/conf').toPromise().then((response: any) => {
      this.config = response.customer_service.ask_chat_after_poll;
    }).catch((error) => {
      this.config = false;
    });
  }
}
