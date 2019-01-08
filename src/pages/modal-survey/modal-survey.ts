import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { InicioPage } from "../inicio/inicio";
import {HttpHeaders} from "@angular/common/http";
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: "page-modal-survey",
  templateUrl: "modal-survey.html"
})
export class ModalSurveyPage implements OnInit {
  public ticket;
  public ticketfinal;
  public preguntas;
  public respuestas;
  public comentarioCierre;
  public tipoBanner;
  public pagina = 1;
  public eleccion = 0;
  public id;
  public apagado = true;
  public comentario = "";
  public comentarios = "";

  constructor(
    public navCtrl: NavController,
    public provedor: RestProvider,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public http: HttpClient, 
  ) {
    this.tipoBanner = navParams.get("tipo");
    console.log(this.tipoBanner,typeof(this.tipoBanner));
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

  public disabledButton() {
    this.apagado = true;
  }

  public setChoice(opcion) {
    for (let i = 0; i < this.preguntas.length; i++) {
      if (opcion == i) {
        this.eleccion = this.preguntas[i].respuesta;
      }
    }
  }

  public saveAnswer(caso, respuesta) {
    for (let i = 0; i < this.preguntas.length; i++) {
      if (caso == i) {
        this.preguntas[i].respuesta = respuesta;
        this.preguntas[i].comentario = "Sin comentarios";
        if (i == 5) {
          console.log(this.comentario)
          this.preguntas[i].comentario = this.comentario;
          if(this.preguntas[i].comentario  == '' || this.preguntas[i].comentario  == ' '){
            this.preguntas[i].comentario = "Sin comentarios";
          }
        }
        if (i == 7) {
          console.log(this.comentarios)
          this.preguntas[i].comentario = this.comentarios;
          if(this.preguntas[i].comentario  == ''){
            this.preguntas[i].comentario = "Sin comentarios";
          }
        }

        if(this.tipoBanner == 10) {
          this.comentarioCierre = `/Cantidad leads/: (${this.preguntas[0].respuesta})  /Calidad leads/: (${this.preguntas[1].respuesta })  /Atención de SC/: (${this.preguntas[2].respuesta })  /Calidad de las tecnologías/: (${this.preguntas[3].respuesta })  /Campaña digital/: (${this.preguntas[4].respuesta })`;
        } else if(this.tipoBanner == 11) {
          this.comentarioCierre = `/Recomienda Koomkin/: (${this.preguntas[0].respuesta})`;
        } else if(this.tipoBanner == 12) {
          this.comentarioCierre = `/Campaña Total/: ${this.preguntas[0].respuesta} --- /Cantidad de leads/: ${this.preguntas[1].respuesta } /Calidad de leads/: ${this.preguntas[2].respuesta } --- /Tecnología y Plataformas/: ${this.preguntas[3].respuesta } /Servicio al Cliente/: ${this.preguntas[4].respuesta } --- /Otra agencia/: ${this.preguntas[5].respuesta } /Vs Competencia/: ${this.preguntas[6].respuesta } /Comentario/: ${this.preguntas[7].comentario }`;
        }

      }
    }
  }

  public enviarRespuestas() {
    for (let i = 0; i < this.preguntas.length; i++) {
      let canal = "app";
      this.provedor
        .getAnswer(
          this.id,
          this.preguntas[i].idPregunta,
          this.preguntas[i].respuesta,
          this.preguntas[i].comentario,
          canal
        )
        .then(
          data => {
            this.respuestas = data;
            console.log(this.respuestas);
          },
          error => {
            console.log(error);
          }
        );
    }
    this.createTicket();
    this.navCtrl.setRoot(InicioPage);
  }

  public createTicket() {
    let fecha;
    let descripcion;

    let rightNow = new Date();
    let res = rightNow
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    fecha = res;

    if ((this.tipoBanner = 10)) {
      descripcion = "Responde encuesta General";
    } else if ((this.tipoBanner = 11)) {
      descripcion = "Responde encuesta Net Promoter Score";
    } else if ((this.tipoBanner = 12)) {
      descripcion = "Responde encuesta Churn";
    }

    this.provedor.getTicket(this.id, fecha, descripcion).then(
      data => {
        this.ticket = data[0].idTicket;
        this.getRequirementTicket(this.ticket);
        console.log(this.ticket);
      },
      error => {
        console.log(error);
      }
    );
  }

  public getRequirementTicket(ticket) {
    
      const body = new URLSearchParams();
      body.set('ticket', ticket);
      body.set('comentario', this.comentarioCierre);

      const options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };

      let url = 'http://www.koomkin.com:4859/getRequirementTicket/';
      return new Promise((resolve, reject) => {
        console.log('entro')
        this.http.post(url ,body.toString() , options)
          .subscribe(data => {
            this.ticketfinal = data;
            console.log(this.ticketfinal);
            return resolve();
          }, err => {
            return reject(err);
          });
      });

    }
}
