<<<<<<< HEAD
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
=======
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {Platform} from "ionic-angular";


@Injectable()
export class AuthServiceProvider {

  public info;
  public pass;
  public contrasena;
  public id;
  public email;
  public empresa;
  public clientUUID;
  public mensajebot;
  public enableChat = null;
  public userLogged: boolean;
  public notificationActive: boolean = false;
  public userOnAuthentiationProcess
  public userFiscal;
  public uuid;

  constructor(public http: HttpClient, public plt: Platform) {
    this.userLogged = false;
  }

  apiUrl = 'http://www.koomkin.com:4859';
  apiUrlNode = 'http://www.koomkin.com:5545';

  //apiUrl = 'https://fierce-spire-89861.herokuapp.com';
  apiUrl0 = 'https://fierce-spire-89861.herokuapp.com';
  apiUrl2 = 'http://localhost:3000';

  getUserByEmail(email) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email).timeout(8000).subscribe(data => {
        resolve(data);
        this.info = data;
        //console.log("infoooo"+JSON.stringify(this.info));
        if (this.info.length > 0) {
         // console.log(this.info);

          this.setEnableChat(this.info[0]['chat']);
          this.setClientUUID(this.info[0]['uuid']);
          this.contrasena = this.info[0].PASSWORD2;
          this.id = this.info[0].IDUSUARIO;
          this.email = this.info[0].EMAIL;
          this.empresa = this.info[0].NOMEMPRESACOMPRADOR;
          this.mensajebot = this.info[0].mensajebot;
          this.uuid = this.info[0].uuid;
         // console.log(this.mensajebot);
          if (this.plt.is('ios') || this.plt.is('android')) {
            window["plugins"].OneSignal.sendTag("chat", this.info[0]['chat']);
          } 

        }
      }, err => {
        reject(err);
       // console.log(JSON.stringify(err));
      });
    });
  }


  setUserIsLogged(value:boolean) {
    this.userLogged = value;
  }

  getUserIsLogged() {
    return this.userLogged;
  }


  setEnableChat(value:any) {
    this.enableChat = value;
  }

  getEnableChat() {
    return this.enableChat;
  }


  setClientUUID(value:any) {
    this.clientUUID = value;
    //console.log(this.clientUUID)
    //alert("hey "+this.clientUUID)
  }

  getClientUUID() {
    //alert(this.clientUUID)
    return this.clientUUID;
  }


  setNotificationActive(value:any) {
    this.notificationActive = value;
    //console.log(this.clientUUID)
    //alert("hey "+this.clientUUID)
  }

  getNotificationActive() {
    //alert(this.clientUUID)
    return this.notificationActive;
  }

  setUserFiscal(data: any) {
    this.userFiscal = data;
  }

  getUserFiscalData(id: number): Promise<any> {
    if (this.userFiscal !== undefined) {
      return new Promise((resolve, reject) => {
        const result = [];
        result.push(this.userFiscal);
        resolve(result);
      });
    } else {
      return this.http.get(this.apiUrlNode + '/datosFiscales?id=' + id)
        .toPromise();
    }
  }


}

//password con + sustituir con %2B o %2b
>>>>>>> 58186580ff358fddae42517d10c965f393edfa8a
