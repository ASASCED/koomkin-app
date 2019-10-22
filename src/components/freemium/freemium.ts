import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, Thumbnail } from 'ionic-angular';

@Component({
  selector: 'freemium',
  templateUrl: 'freemium.html'
})

export class FreemiumComponent implements OnInit{
  @Input() gender: String;
  @Input() briefId: string;
  @Output() showFreemiumTemplate = new EventEmitter();

  public genderTemplate: String;
  public brief: String;
  public srcTemplate: String;
  public loaded: boolean = false;
  text: string;

  constructor(public http: HttpClient,
              public navCtrl: NavController) {
  }

  ngOnInit() {
    this. genderTemplate = this.gender;
    this.brief = this.briefId
    this.loadImageTemplateRandom();

  }

  loadImageTemplateRandom() {
    return new Promise((resolve,reject)=> {
      // this.http.get(`http://localhost:4859/freemiumTemplates?gender=${this.gender}`)
      this.http.get(`https://www.koomkin.com.mx/api/app/freemiumTemplates?gender=${this.gender}`)
      .subscribe(images => {
        this.getImageRandom(images);
        resolve();
      },
        err => {
          reject();
        }
      );
    });
  }

  getImageRandom(images){
      let randomNumber =  Math.floor(Math.random() * images.length);
      this.srcTemplate = images[randomNumber].originImage;
  }

  goToFreemiumDetails() {
    this.navCtrl.push('FreemiumPage', {brief:this.brief});
  }

  exitFreemiumTemplate() {
    this.showFreemiumTemplate.emit({status:false});
  }
}
