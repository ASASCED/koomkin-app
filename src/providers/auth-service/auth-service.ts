import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  email = '';
  apiUrlp = 'http://187.162.208.218:5000/misc/decrypt2?pass=';
  apiUrl = 'http://localhost:3000';  

  getUserByEmail(email) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email ).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrlp + 'HAX31y9R4hwbdbc6WNwNy8w79hjCLkXN', JSON.stringify(credentials))
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

}
