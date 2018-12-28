import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { InicioPage } from "../inicio/inicio";

@IonicPage()
@Component({
  selector: "page-modal-survey",
  templateUrl: "modal-survey.html"
})
export class ModalSurveyPage implements OnInit {

  public preguntas;
  public tipoBanner;
  public pagina = 1;
  public eleccion = 0;
  public id;
  public apagado = true;
  public comentario = '';
  public comentarios = '';

  constructor(
    public navCtrl: NavController,
    public provedor: RestProvider,
    public navParams: NavParams,
    public authService: AuthServiceProvider,

  ) {
    this.tipoBanner = navParams.get("tipo");
    this.id = this.authService.id;
  }

  ngOnInit() {
    this.getSurvey(this.tipoBanner);
  }

  public getSurvey(tipo) {
    this.provedor.getSurvey(tipo).then(
      data => {
        this.preguntas = data;
       // console.log(this.preguntas.length);
      },
      error => {
        console.log(error);
      }
    );
  }

  public nextQuestion() {
    this.pagina = this.pagina + 1;
  }

  public previousQuestion() {
    this.pagina = this.pagina - 1;
    this.apagado = false;
  }

  public changeChoice(eleccion) {
    this.eleccion = eleccion;
    this.apagado = false;
  }

  public disabledButton(){
    this.apagado = true;
  }

  public setChoice(opcion){
    for (let i = 0; i < this.preguntas.length; i++) { 
      if (opcion == i) {
        this.eleccion = this.preguntas[i].respuesta;
      }
   }
  }

  public saveAnswer(caso,respuesta){
    for (let i = 0; i < this.preguntas.length; i++) { 
      if (caso == i) {
        this.preguntas[i].respuesta = respuesta;
        this.preguntas[i].comentario = '';
        if(i == 5){
          this.preguntas[i].comentario = this.comentario;
        }
        if(i == 7){
          this.preguntas[i].comentario = this.comentarios;
        }
       // console.log(this.preguntas[i]);
      }
   }
  }

  public enviarRespuestas(){
    for (let i = 0; i < this.preguntas.length; i++) { 
     // console.log(this.id,this.preguntas[i].respuesta,this.preguntas[i].comentario,this.preguntas[i].idPregunta);
   }
   this.navCtrl.setRoot(InicioPage);
  }
}
  