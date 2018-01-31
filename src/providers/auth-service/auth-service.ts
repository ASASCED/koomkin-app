import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {

  public info;
  pass;
  public contrasena;

  constructor(public http: HttpClient) {
  }

  apiUrlp = 'http://187.162.208.218:5000/misc/decrypt2?pass=';
  apiUrl = 'http://localhost:3000';

  getUserByEmail(email) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email).subscribe(data => {
        resolve(data);
        this.info = data;
        if (this.info.length > 0) {
          this.contrasena = this.info[0].PASSWORD2;
        }
      }, err => {
        console.log(err);
      });
    });
  }


}

  //password con + sustituir con %2B o %2b 
