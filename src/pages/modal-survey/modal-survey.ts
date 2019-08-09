import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, App, MenuController } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

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
  public uuid;
  public apagado = true;
  public comentario = "";
  public comentarios = "";
  public idReporteBanner;

  constructor(
    public navCtrl: NavController,
    public provedor: RestProvider,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public http: HttpClient, 
    public app: App,
    private menuCtrl: MenuController
  ) {
    this.tipoBanner = navParams.get("tipo");
    console.log(this.tipoBanner);
    this.idReporteBanner = navParams.get("idReporteBanner");
    
    this.uuid = this.authService.uuid;
    this.id = this.authService.id;
  }

  ngOnInit() {
    this.getSurvey(this.tipoBanner);
    if (this.tipoBanner != 13) {
      this.registrarEntradaBanner();
    }
  }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.swipeEnable(true);
  }
  
  public registrarEntradaBanner() {
    return new Promise((resolve, reject) => {
      const urlEntradaBanner =
        'https://www.koomkin.com.mx/api/app/registrarEntradaBanner/' +
        this.idReporteBanner +
        '/app';
      this.http.get(urlEntradaBanner).subscribe(
        data => {
          //  // console.log(urlEntradaBanner);
          resolve();
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  public getSurvey(tipo) {
    this.provedor.getSurvey(tipo).then(
      data => {
        this.preguntas = data;
        // // console.log(this.preguntas.length);
      },
      error => {
        // console.log(error);
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
          this.preguntas[i].comentario = this.comentario;
          if(this.preguntas[i].comentario  == '' || this.preguntas[i].comentario  == ' '){
            this.preguntas[i].comentario = "Sin comentarios";
          }
        }
        if (i == 7) {
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
        } else if (this.tipoBanner == 13) {
          this.comentarioCierre = `/Campaña Total/: ${this.preguntas[0].respuesta} --- /Cantidad de leads/: ${this.preguntas[1].respuesta} /Calidad de leads/: ${this.preguntas[2].respuesta} --- /Tecnología y Plataformas/: ${this.preguntas[3].respuesta} /Servicio al Cliente/: ${this.preguntas[4].respuesta} --- /Otra agencia/: ${this.preguntas[5].respuesta} /Vs Competencia/: ${this.preguntas[6].respuesta} /Comentario/: ${this.preguntas[7].comentario}`;
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
          },
          error => {
            // console.log(error);
          }
        );
    }
    this.createTicket();
    this.navCtrl.setRoot('InicioPage');
  }

  public createTicket() {
    let fecha;
    let descripcion;
    let requerimiento;

    let rightNow = new Date();
    let res = rightNow
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    fecha = res;

    if (this.tipoBanner == 10) {
      descripcion = "Responde encuesta General";
      requerimiento = 38;
    } else if (this.tipoBanner == 11) {
      descripcion = "Responde encuesta Net Promoter Score";
      requerimiento = 39;
    } else if (this.tipoBanner == 12) {
      descripcion = "Responde encuesta Churn";
      requerimiento = 44;
    } else if (this.tipoBanner == 13) {
      descripcion = 'Responde encuesta Churn-Suscripcion';
      requerimiento = 44;
    }

    this.provedor.getTicket(this.id, fecha, descripcion).then(
      data => {
        this.ticket = data[0].idTicket;
        this.getRequirementTicket(this.ticket,requerimiento);
      },
      error => {
        // console.log(error);
      }
    );
  }

  public getRequirementTicket(ticket,requerimiento) {
    
      const body = new URLSearchParams();
      body.set('ticket', ticket);
      body.set('requerimiento', requerimiento);
      body.set('comentario', this.comentarioCierre);

      const options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };

      let url = 'https://www.koomkin.com.mx/api/app/getRequirementTicket/';
      return new Promise((resolve, reject) => {
        this.http.post(url ,body.toString() , options)
          .subscribe(data => {
            this.ticketfinal = data;
            return resolve();
          }, err => {
            return reject(err);
          });
      });

  }

  public getUpdateBanner() {
    this.provedor.getUpdateBanner(this.idReporteBanner).then(
      data => {
        // console.log(data);
      },
      error => {
        // console.log(error);
      }
    );
  }

  public irInicio() {
    this.app.getRootNav().setRoot('InicioPage'); 
  }

  public cancelMembershipOP() {
    const cuerpo = `{'id': '${this.id}'}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };
 // console.log(cuerpo);
    return new Promise((resolve, reject) => {
      const url = 'https://www.koomkin.com.mx/api/openPay/cancelPayment';
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          if (data['result'] == 'OK') {
            swal({
              imageUrl: 'assets/imgs/ajustes/icn_check.svg',
              imageHeight: 80,
              title: '¡Suscripción Cancelada!'
            });
            this.enviarRespuestas();
            this.getInsertClickCancelarMembresia();
            resolve();
          } else if (data['result'] == 'error') {
            this.showErrorCancelTres();
          }
        },
        err => {
          this.showErrorCancel();
        }
      );
    });
  }

  public getInsertClickCancelarMembresia() {
    const usuario = this.id;
    const acceso = 'App';
    this.provedor.getInsertClickCancelarMembresia(usuario, acceso).then(
      data => {
       // this.datosenvio = data;
      },
      err => {
        // console.log('error');
      }
    );
  }

  public showSuccessCancel() {
    swal({
      title: 'Se ha cancelado su suscripción con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showErrorCancel() {
    swal({
      title: 'No se ha podido cancelar su suscripción',
      text: 'Por favor comuniquese a Servicio a Cliente para más información',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

  public showErrorCancelTres() {
    swal({
      title: 'No se ha podido cancelar su suscripción',
      text: 'Recuerda que para cancelar es con 3 días de anticipación antes de tu próximo cobro',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

}
