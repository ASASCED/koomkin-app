import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-modal-comentarios',
  templateUrl: 'modal-comentarios.html',
})
export class ModalComentariosPage implements OnInit{

  public id;
  public clave;
  public uuid;
  public clasificaLead;
  public leadActual;
  public idComentario;
  public razones;
  public razonDescarto;
  public tipo;
  public fecha;
  public hora;
  public comentario;
  public valorLead;
  public datetime;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public http: HttpClient,
    public provedor: RestProvider
  ) {
    this.tipo = navParams.get("tipo");
    this.leadActual = navParams.get("leadActual");
    this.clasificaLead = navParams.get("clasificaLead");
    this.idComentario = navParams.get("idComentario");
    this.comentario = navParams.get("comentario");
    console.log(this.idComentario, this.comentario );
    this.id = this.leadActual.ID;
    this.clave = this.leadActual.clave;
    this.uuid = this.leadActual.uuid;
    
    if(this.leadActual.ValorLead != 'null' && this.leadActual.ValorLead != null && this.leadActual.ValorLead != undefined) {
      this.valorLead = this.leadActual.ValorLead;
    }
    if(this.leadActual.RazonDescartado != 'null' && this.leadActual.RazonDescartado != null && this.leadActual.RazonDescartado != undefined) {
      this.razonDescarto = this.leadActual.RazonDescartado;
    }
  }

  ngOnInit() {
    this.getRazones();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  getRazones() {
    this.provedor.getReasons().then(
      data => {
        let razones = data;
        this.razones = razones;
      },
      err => {
        // console.log('error');
      }
    );
  }

  public registerComentario() {

    const body = new URLSearchParams();
    body.set('idUsuario', this.id);
    body.set('claveLead', this.clave);
    body.set('comentario', this.comentario);
    body.set('clasificaLead', this.clasificaLead);
    body.set('valorLead', this.valorLead);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/registerComment/';

    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          console.log(data);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  public updateComentario() {

    const body = new URLSearchParams();
    body.set('idComentario', this.idComentario);
    body.set('comentario', this.comentario);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/editComment/';
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  discart() {

    const body = new URLSearchParams();
    body.set('claveLead', this.clave);
    body.set('valorLead', this.valorLead);
    body.set('razonDescarto', this.razonDescarto);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/registerReason/';
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  rescheduler() {
    console.log(this.uuid,this.fecha,this.hora,this.valorLead,this.comentario);

    this.datetime = this.fecha + 'T' + this.hora + ':00.00Z';

    const cuerpo = `{'uuid': '${this.uuid}', 'date': '${this.datetime}', 'active': 1}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };

    console.log(cuerpo);

    const url = 'https://koomkin.com.mx/calltracker/rescheduler/';
    return new Promise((resolve, reject) => {
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  sold() {
    console.log(this.valorLead,this.comentario);
  }

  registrarComentario() {

  }
}
