import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController,AlertController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pregunta',
  templateUrl: 'pregunta.html',
})
export class PreguntaPage {

  nombre:string = "";
  edad:number = 0;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {

    this.nombre = this.navParams.get("nombre");
    this.edad = this.navParams.get("edad");

   // console.log( this.nombre, this.edad );

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  cerrar_con_parametros(){

    let data = {
      nombre: "Juan Carlos",
      edad: 18,
      coords: {
        lat: 10,
        lng: -10
      }
    };


    this.viewCtrl.dismiss( data );

  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Lamentamos decir adiós',
      subTitle: 'Vamos a trabajar en nuestras áreas de oportunidad esperamos verte de nuevo en el futuro',
      
      buttons: [
        {
          text: 'Cerrar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    alert.present();
  }


  cerrar_sin_parametros(){

    this.viewCtrl.dismiss();

  }


}
