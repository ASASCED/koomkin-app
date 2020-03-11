import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavController } from "ionic-angular";

@Component({
  selector: "freemium",
  templateUrl: "freemium.html"
})
export class FreemiumComponent implements OnInit {
  @Input() gender: String;
  @Input() briefId: string;
  @Output() showTemplate = new EventEmitter();

  public genderTemplate: String;
  public brief: String;
  public srcTemplate: String;
  public loaded: boolean = false;
  text: string;

  constructor(public http: HttpClient, public navCtrl: NavController) {}

  ngOnInit() {
    this.genderTemplate = this.gender;
    this.brief = this.briefId;
    this.loadImageTemplateRandom();
  }

  loadImageTemplateRandom() {
    return new Promise((resolve, reject) => {
      // this.http.get(`http://localhost:4859/Templates?gender=${this.gender}`)
      console.log(
        `https://www.koomkin.com.mx/api/app/Templates?gender=${this.gender}`
      );

      this.http
        .get(
          `https://www.koomkin.com.mx/api/app/Templates?gender=${this.gender}`
        )
        .subscribe(
          images => {
            console.log(images);
            this.getImageRandom(images);
            resolve();
          },
          err => {
            reject();
          }
        );
    });
  }

  getImageRandom(images) {
    let randomNumber = Math.floor(Math.random() * images.length);
    this.srcTemplate = images[randomNumber].originImage;
  }

  goToDetails() {
    this.navCtrl.push("Page", { brief: this.brief });
  }

  exitTemplate() {
    this.showTemplate.emit({ status: false });
  }
}
