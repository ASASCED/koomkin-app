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

  public razones;
  public razonDescarto;
  public tipo = 3;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public http: HttpClient,
    public provedor: RestProvider
  ) {

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
        console.log(this.razones);
      },
      err => {
        // console.log('error');
      }
    );
  }
}
