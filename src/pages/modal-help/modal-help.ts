import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-modal-help',
  templateUrl: 'modal-help.html',
})
export class ModalHelpPage {

  /**
   * TODO: add initChat function on request call button
   * */

  @Input() data: any;

  private happinessLevel: number;
  public page: number;
  private ticket_id: number;
  public config;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpClient) {
    this.happinessLevel = 0;
    this.page = 1;
    this.data = navParams.get("data");
    this.config = navParams.get("requestCall");
    this.ticket_id = this.data.json_master.ticket_id;
  }

  ionViewDidLoad() {
  }

  setHappinessLevel(level) {
    this.happinessLevel = level;
    this.page = 2;
    const url = 'http://3.85.35.123:5011/register_sentiment';
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
}
