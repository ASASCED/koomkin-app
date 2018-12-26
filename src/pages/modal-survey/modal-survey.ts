import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-modal-survey',
  templateUrl: 'modal-survey.html',
})
export class ModalSurveyPage implements OnInit{

  public preguntas;
  public tipoBanner;

  constructor(public navCtrl: NavController,
    public provedor: RestProvider,
    public navParams: NavParams) {
      this.tipoBanner = navParams.get("tipo");
      console.log(this.tipoBanner);
  }


  ngOnInit() {
    this.getSurvey(this.tipoBanner)
  }

  public getSurvey(tipo) {
    this.provedor.getSurvey(tipo)
      .then(
        (data) => {
          this.preguntas = data;
          console.log(this.preguntas);
        },
        (error) => {
          console.log(error);
        });
  }


}
