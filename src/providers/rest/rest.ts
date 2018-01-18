import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RestProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  apiUrl = 'http://localhost:3000';
  apiUrl2 = 'http://www.koomkin.com:5545';

  getUsers() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/users').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
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

  getLeadsDias() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLead30Dias/2').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsMeses() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLead12Meses/2').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLikeDias() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLike30Dias/2').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsMapa() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadsMapa/2').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookDevice(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=impression_device').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookAge(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=age').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookGender(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=gender').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadCountMonth() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadCountMonth/2').subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
