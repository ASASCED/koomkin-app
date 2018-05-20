import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RestProvider {

  constructor(public http: HttpClient) {
  }

  private user;
  apiUrl = 'http://localhost:3000';
  apiUrl2 = 'http://www.koomkin.com:5545';
  apiUrl3 = 'http://189.205.233.70:4829/twilio_api/api/v1/forward-app/?idLead='
  date;
  datefin;

  getDate(datefin,date){
    let currentDate = new Date();
    let twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);  
    let twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
    let DigitYear=(currentDate.getFullYear() - 1);

    this.datefin = currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;
    this.date = DigitYear + "-" + twoDigitMonth + "-" + twoDigitDate;
  }


  setUser(user: any) {
    this.user = user;
  }

  public getUser() {
    return this.user;
  }

  addUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/users', JSON.stringify(data))
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getCostoCampania(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getCostoCampania/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsDias() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLead30Dias/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsMeses() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLead12Meses/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLikeDias() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLike30Dias/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsMapa() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadsMapa/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookDevice() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=' + this.user + '&param2=impression_device').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookAge() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=' + this.user + '&param2=age').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookGender() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=' + this.user + '&param2=gender').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLlamada() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl3 ).subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadCountMonth() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadCountMonth/' + this.user).subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsReport() { 
    //console.log(this.date);
    return new Promise(resolve => {
    let currentDate = new Date();
    let twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);  
    let twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
    let DigitYear=(currentDate.getFullYear() - 1);

    this.datefin = currentDate.getFullYear() + "-" + twoDigitMonth + "-" + twoDigitDate;
    this.date = DigitYear + "-" + twoDigitMonth + "-" + twoDigitDate;
      this.http.get(this.apiUrl + '/getLeadsReport/' + this.user + '/' + this.date + '/'+ this.datefin +'/Todos_los_recibidos').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
