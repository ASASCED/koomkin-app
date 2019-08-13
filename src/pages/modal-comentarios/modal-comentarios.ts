import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestProvider } from '../../providers/rest/rest';
import swal from 'sweetalert2';

@IonicPage()
@Component({
  selector: 'page-modal-comentarios',
  templateUrl: 'modal-comentarios.html',
})
export class ModalComentariosPage implements OnInit {

  public id;
  public clave;
  public uuid;
  public clasificaLead;
  public leadActual;
  public idComentario;
  public razones;
  public razonDescarto = 'No logro contactarlo';
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
    // console.log(this.idComentario, this.comentario);
    this.id = this.leadActual.ID;
    this.clave = this.leadActual.uuid;
    this.uuid = this.leadActual.uuid;

    if (this.leadActual.ValorLead != 'null' && this.leadActual.ValorLead != null && this.leadActual.ValorLead != undefined) {
      this.valorLead = this.leadActual.ValorLead;
    }
    if (this.leadActual.RazonDescartado != 'null' && this.leadActual.RazonDescartado != null && this.leadActual.RazonDescartado != undefined) {
      this.razonDescarto = this.leadActual.RazonDescartado;
    }
  }

  ngOnInit() {
    this.getRazones();
  }

  closeModal() {
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

    if (this.comentario != null && this.comentario != 'null' && this.comentario != undefined) {
      const body = new URLSearchParams();
      body.set('idUsuario', this.id);
      body.set('claveLead', this.clave);
      body.set('comentario', this.comentario);
      body.set('clasificaLead', this.clasificaLead);

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
  }

  public registerValor() {

    if (this.valorLead == undefined || this.valorLead == null) {
      this.valorLead = '';
    }

    const body = new URLSearchParams();
    body.set('claveLead', this.clave);
    body.set('valorLead', this.valorLead);


    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    console.log(body.toString());

    const url = 'https://www.koomkin.com.mx/api/app/registerCost/';

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

    if (this.comentario != null && this.comentario != 'null' && this.comentario != undefined) {

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
  }

  discart() {

    if (this.razonDescarto == undefined || this.razonDescarto == 'null' || this.razonDescarto == null) {
      this.razonDescarto = 'No logro contactarlo'
    }

    const body = new URLSearchParams();
    body.set('claveLead', this.clave);
    body.set('razonDescarto', this.razonDescarto);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };    

    const url = 'https://www.koomkin.com.mx/api/app/registerReason/';

    console.log(url, body.toString())
    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          return resolve();
        },
        err => {
          console.log(err);
          return reject(err);
        }
      );
    });
  }

  rescheduler() {

    if (this.fecha != null && this.fecha != 'null' && this.fecha != undefined && this.hora != null && this.hora != 'null' && this.hora != undefined) {
      this.datetime = this.fecha + 'T' + this.hora + ':00.00Z';

      const cuerpo = `{"uuid": "${this.uuid}", "date": "${this.datetime}", "active": 1, "classification": "${this.clasificaLead}"}`;

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
            console.log(data);
            return resolve();
          },
          err => {
            console.log(err);
            return reject(err);
          }
        );
      });
    }
  }
  public showSuccess() {

    swal({
      title: 'Estatus actualizado con éxito',
      text: 'Por favor actualiza tus leads para visualizar la información',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }
}
