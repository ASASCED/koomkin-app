import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {

  public info;
  pass;
  password;
  mydata;
  apiUrlp2;
  public contrasena;
  acceso = false;

  constructor(public http: HttpClient) {
    console.log('Hello AuthServiceProvider Provider');
  }

  email = '';
  apiUrlp = 'http://187.162.208.218:5000/misc/decrypt2?pass=';
  apiUrl = 'http://localhost:3000';

  getUserByEmail(email, password, acceso) {
    //console.log(email,password);
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email).subscribe(data => {
        resolve(data);
        //datos del usuario
        this.info = data;
        //asigno el password del usuario
        this.password = password;
        if (this.info.length > 0) {
          this.pass = this.info[0].PASSWORD;
          //le paso el password para desencriptarlo
          //console.log(this.pass);
          this.login(this.pass);
          //comparo los password 
          if (this.password === this.contrasena) {
            console.log("entro");
          }
          console.log(this.password,this.contrasena);
        }  
      }, err => {
        console.log(err);
      });
    });
  }

  login(pass) {
    this.apiUrlp2 = this.apiUrlp + this.pass;
    console.log(this.pass)
    return new Promise(resolve => {
      this.http.get(this.apiUrlp2, { responseType: 'text' }).subscribe(res => {
        resolve(res);
        this.contrasena = res;
      }, err => {
        console.log(err);
      });
    });
  }
}

  //password con + sustituir con %2B o %2b 
