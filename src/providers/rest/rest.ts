import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

@Injectable()
export class RestProvider {

  constructor(public http: HttpClient, public plt: Platform) {
  }

  private user;
  apiUrl = 'http://www.koomkin.com:4859';
  apiUrl1 = 'http://189.205.233.70:4829/twilio_api/api/v1/forward-app/?idLead=';
  apiUrl2 = 'http://187.162.208.218:5000/facebook/checkLeadComplement?user_id=';
  date;
  datefin;
  email;
  password;
  app;
  leads_pagination_min;
  leads_pagination_max;

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

  setApp(app: any) {
    this.app = app;
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

  getObtieneContactoSexCte() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getObtieneContactoSexCte/' + this.user).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
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

  getDiasRestantes(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getDiasRestantes/' + this.user).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getIntentoSesion(email,password){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getIntentoSesion/' + email + '/' + password).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInsertClickPagina(usuario,pagina,acceso){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getInsertClickPagina/' + usuario + '/' + pagina + '/' + acceso).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInsertClickLead(usuario,id,acceso){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getInsertClickLead/' + usuario + '/' + id + '/' + acceso).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInsertClickLlamar(usuario,id,acceso,dispositivo){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getInsertClickLlamar/' + usuario + '/' + id + '/' + acceso + '/' + dispositivo).subscribe(data => {
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
      this.http.get(this.apiUrl + '/facebook?param1=' + this.user + '&param2=impression_device').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookAge() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/facebook?param1=' + this.user + '&param2=age').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getFacebookGender() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/facebook?param1=' + this.user + '&param2=gender').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCheckLeadComplement(){
    return new Promise(resolve => {
      console.log(this.email);
      this.http.get(this.apiUrl2 + '/facebook/checkLeadComplement?user_id=' + this.user + '&email=' + this.email).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLlamada() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl1 ).subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadCalls(){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getLeadCalls/' + this.user).subscribe(data => {
        resolve(data);
      //   console.log(data);
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

  getCountLeadCalls() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getCountLeadCalls/' + this.user).subscribe(data => {
        resolve(data);
       //  console.log(data);
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
      this.http.get(this.apiUrl + '/getLeadsReport/' + this.user + '/' + this.date + '/' + this.datefin + '/Todos_los_recibidos').subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getLeadsReportPagination(min: number, max: number) {
    //console.log(this.date);
    return new Promise(resolve => {
      let currentDate = new Date();
      let twoDigitMonth=((currentDate.getMonth()+1)>=10)? (currentDate.getMonth()+1) : '0' + (currentDate.getMonth()+1);
      let twoDigitDate=((currentDate.getDate())>=10)? (currentDate.getDate()) : '0' + (currentDate.getDate());
      let DigitYear=(currentDate.getFullYear() - 1);

      this.leads_pagination_min = min;
      this.leads_pagination_max = max;

      this.datefin = "'"+currentDate.getFullYear() + "" + twoDigitMonth + "" + twoDigitDate+"'";
      this.date = "'"+DigitYear + "" + twoDigitMonth + "" + twoDigitDate+"'";
      this.http.get(this.apiUrl + '/getLeadsReportPagination/' + this.user + '/' + this.datefin + '/' + this.date + '/Todos los recibidos' + '/' + this.leads_pagination_min + '/' + this.leads_pagination_max).subscribe(data => {
        resolve(data);
        //console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }


  registerDeviceID(deviceId: string) {

    var platform = null;

    if (this.plt.is('ios')) {
      platform = "ios";
    } else if (this.plt.is('android')) {
      platform = "android";
    }

    return new Promise(resolve => {
      this.http.post(this.apiUrl + '/registerDeviceId/' + this.user + '/' + deviceId + '/' + platform , {}).subscribe(data => {
        resolve(data);
        // console.log(JSON.stringify(data));
      }, err => {
      });
    });
  }

  getUrlAudio() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUrlAudio/' + this.user).subscribe(data => {
        resolve(data);
      }, err => {
       //  console.log(err);
      });
    });
  }

  getBanner() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getBanner/' + this.user).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getEficiency() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getEficiency/' + this.user).subscribe(data => {
        resolve(data);
       // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getEficiencyType(tipocuarta) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getEficiencyType/' + tipocuarta).subscribe(data => {
        resolve(data);
       // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getEficiencyRanking() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getEficiencyRanking').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getWords() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getWords/' + this.user).subscribe(data => {
        resolve(data);
       // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getWordsType(tipocuarta) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getWordsType/' + tipocuarta).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getTopTen() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getTopTen').subscribe(data => {
        resolve(data);
        // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getTips(idtip1, idtip2, idtip3) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getTips/' + idtip1 + '/' + idtip2 + '/' + idtip3).subscribe(data => {
        resolve(data);
       // console.log(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getInsertClickTip(usuario, tipid, acceso) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/clickTip/' + usuario + '/' + tipid + '/' + acceso)
        .subscribe(data => {
          resolve(data);
        }, err => {
          // console.log(err);
        });
    });
  }

  getInsertClickTooltip(usuario, tooltipname, acceso) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/clickTooltip/' + usuario + '/' + tooltipname + '/' + acceso)
        .subscribe(data => {
          resolve(data);
        }, err => {
          // console.log(err);
        });
    });
  }

  getSurvey(tipo) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getSurvey/' + tipo).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getAnswer(idUsuario,idPregunta,respuesta,comentario,canal) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getAnswer/' + idUsuario + '/' + idPregunta + '/' + respuesta + '/' + comentario + '/' + canal).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getTicket(idUsuario,fecha,descripcion) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getTicket/' + idUsuario + '/' + fecha + '/' + descripcion).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getRequirementTicket(idTicket,descripcion) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getTicket/' + idTicket + '/' + descripcion ).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getUpdateBanner(idReporteBanner){
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/getUpdateBanner/' + idReporteBanner ).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
