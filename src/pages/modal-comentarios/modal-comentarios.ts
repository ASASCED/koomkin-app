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

  public leadActual;
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

  public updateComentario(idComentario,comentario) {

    const body = new URLSearchParams();
    body.set('idComentario', idComentario);
    body.set('comentario', comentario);

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

  getRazones() {
    this.provedor.getReasons().then(
      data => {
        let razones = data;
        this.razones = razones;
        // console.log(this.razones);
      },
      err => {
        // console.log('error');
      }
    );
  }

  discart() {

    const body = new URLSearchParams();
    body.set('claveLead', this.leadActual.clave);
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
    console.log(this.leadActual.uuid,this.fecha,this.hora,this.valorLead,this.comentario);

    this.datetime = this.fecha + 'T' + this.hora + ':00.00Z';

    const cuerpo = `{'uuid': '${this.leadActual.uuid}', 'date': '${this.datetime}', 'active': 1}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };

    /*const url = 'https://koomkin.com.mx/calltracker/rescheduler/';
    return new Promise((resolve, reject) => {
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          return resolve();
        },
        err => {
          return reject(err);
        }
      );
    });*/
  }

  sold() {
    console.log(this.valorLead,this.comentario);
  }
}
