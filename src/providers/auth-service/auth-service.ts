import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthServiceProvider {

  public info;
  pass;
  public contrasena;
  public id;
  public empresa;

  constructor(public http: HttpClient) {
  }

  apiUrl = 'http://www.koomkin.com:4859';

  getUserByEmail(email) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email).subscribe(data => {
        resolve(data);
        this.info = data;
        if (this.info.length > 0) {
          this.contrasena = this.info[0].PASSWORD2;
          this.id = this.info[0].IDUSUARIO;
          this.empresa = this.info[0].NOMEMPRESACOMPRADOR
          //console.log(this.contrasena);
        }
        //console.log(this.id,this.empresa);

      }, err => {
        console.log(err);
      });
    });
  }


}

  //password con + sustituir con %2B o %2b 
