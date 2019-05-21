import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";

@IonicPage()
@Component({
  selector: "page-modal-page-iniciar-chat",
  templateUrl: "modal-page-iniciar-chat.html"
})
export class ModalPageIniciarChatPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public viewCtrl: ViewController
  ) {}

  enviado = false;
  uuid: any;
  nombre: any;

  closeModal() {
    this.viewCtrl.dismiss(false);
  }

  ionViewWillLoad() {
    this.uuid = this.navParams.get("uuid");
    this.nombre = this.navParams.get("nombrelead");
  }

  public iniciarConversacion() {
    this.enviado = true;

    const body = new URLSearchParams();
    body.set("uuid", this.uuid);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = "https://www.koomkin.com.mx/chat/send_coach/";
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          console.log(data);
          if (data["status"] == 200) {
            this.viewCtrl.dismiss(true);
          } else {
            this.viewCtrl.dismiss(false);
          }
          return resolve();
        },
        err => {
          if (err["status"] == 200) {
            this.viewCtrl.dismiss(true);
          } else {
            this.viewCtrl.dismiss(false);
          }
          return resolve(err);
        }
      );
    });
  }
}
