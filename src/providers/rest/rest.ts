import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RestProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  private user;
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

  setUser(user:any){
    this.user = user;
  }

  public getUser(){
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

  getLeadsDias() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLead30Dias/' + this.user).subscribe(data => {
        resolve(data);
       // console.log(data);
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

  getFacebookDevice(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=impression_device').subscribe(data => {
        resolve(data);
       // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookAge(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=age').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookGender(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl2 + '/facebook?param1=2&param2=gender').subscribe(data => {
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
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadsReport/' + this.user + '/2016-06-12/2017-06-12/Todos_los_recibidos').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
