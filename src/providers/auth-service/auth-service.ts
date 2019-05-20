import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Platform } from "ionic-angular";

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
  public recurrente;
  public cancelar;
  public activo;
  public idRecurrente;
  public uuidRecurrente;

  constructor(public http: HttpClient, public plt: Platform) {
    this.userLogged = false;
  }

  apiUrl = 'https://www.koomkin.com.mx/api/app';

  getUserByEmail(email) {
    return new Promise((resolve,reject) => {
      this.http.get(this.apiUrl + '/getUserByEmail/' + email).timeout(8000).subscribe(data => {
        resolve(data);
        this.info = data;
        if (this.info.length > 0) {
          this.setEnableChat(this.info[0]['chat']);
          this.setClientUUID(this.info[0]['uuid']);
          this.contrasena = this.info[0].PASSWORD2;
          this.id = this.info[0].IDUSUARIO;
          this.email = this.info[0].EMAIL;
          this.empresa = this.info[0].NOMEMPRESACOMPRADOR;
          this.mensajebot = this.info[0].mensajebot;
          this.uuid = this.info[0].uuid;
          this.recurrente = this.info[0].RecurringPayments;
          this.idRecurrente = this.info[0].RecurringPaymentUUID;
          this.uuidRecurrente = this.info[0].RecurringPaymentID;
          this.cancelar = this.info[0].cancellation;
          this.activo = this.info[0].activo;
          if(this.activo == this.id) {
            this.activo = 1;
          }
          if (this.plt.is('ios') || this.plt.is('android')) {
            window["plugins"].OneSignal.sendTag("chat", this.info[0]['chat']);
          } 

        }
      }, err => {
        reject(err);
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
  }

  getClientUUID() {
    return this.clientUUID;
  }

  setNotificationActive(value:any) {
    this.notificationActive = value;
  }

  getNotificationActive() {
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
      return this.http.get(this.apiUrl + '/datosFiscales?id=' + id)
        .toPromise();
    }
  }
}
