import { Component } from "@angular/core";
import { IonicPage, Platform } from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { NavParams } from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
declare var cordova: any;

@IonicPage()
@Component({
  selector: "page-freemium",
  templateUrl: "freemium.html"
})
export class FreemiumPage {
  public briefId;
  public url;

  constructor(
    public iab: InAppBrowser,
    public navParams: NavParams,
    public http: HttpClient,
    public platform: Platform
  ) {
    this.briefId = navParams.get("brief");
    this.getUrl();
  }

  ionViewDidLoad() {}

  getUrl() {
    const cuerpo = `{
      "brief_id": "${this.briefId}",
      "plan_id": 47,
      "promo": "freemium-app-1"
    }`;

    const options = {
      headers: new HttpHeaders().set("Content-Type", "application/json")
    };

    const url = "https://www.koomkin.com.mx/api/payment/clientFromBrief";

    return new Promise((resolve, reject) => {
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          if (data["status"] == "OK") {
            this.url = data["link"];
          }
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  goToWorkPlan() {
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(this.url, "_system", "location=no");
    });
  }
}
