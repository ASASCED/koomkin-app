import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams
} from "ionic-angular";
import { RestProvider } from "./../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

@IonicPage()
@Component({
  selector: "page-email",
  templateUrl: "email.html"
})
export class EmailPage implements OnInit {
  public vista;
  public saludo;
  public slogan;
  public id;
  public email;
  public datos;
  public pdf;
  public facebook;
  public instagram;
  public linkedIn;
  public web;
  public twitter;
  public uuid;
  apiUrl = 'http://18.235.164.159/call-tracking/api/v1/mailing/';

  channelsidaux = "CHbc465fbe83434937b7382db97e8896b1";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public http: HttpClient,
    public chatService: ChatServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    this.id = this.authService.id;
    this.email = this.authService.email;
    this.uuid = this.authService.uuid;
    this.pdf = this.id + ".pdf";
  }

  ngOnInit() {
    this.vista = "informacion";
    this.getMailCliente(this.id);
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  getMailCliente(idUsuario) {
    this.provedor.getMailCliente(idUsuario).then(
      data => {
        this.datos = data;
        console.log(this.datos);
        if (this.datos) {
          this.facebook = this.datos[0].facebook;
          this.instagram = this.datos[0].instagram;
          this.linkedIn = this.datos[0].linkedin;
          this.web = this.datos[0].web;
          this.twitter = this.datos[0].twitter;
          this.saludo = this.datos[0].SaludoCorreo;
          this.slogan = this.datos[0].Slogan;

          if (this.facebook == null || this.facebook == "") {
            this.facebook = "No cuento con esta red";
          }

          if (this.instagram == null || this.instagram == "") {
            this.instagram = "No cuento con esta red";
          }

          if (this.linkedIn == null || this.linkedIn == "") {
            this.linkedIn = "No cuento con esta red";
          }

          if (this.web == null || this.web == "") {
            this.web = "No cuento con esta red";
          }

          if (this.twitter == null || this.twitter == "") {
            this.twitter = "No cuento con esta red";
          }
        }
      },
      err => {
        //   console.log('error');
      }
    );
  }

  changeInfo() {
    const body = new URLSearchParams();
    body.set("id_usuario", this.id);
    body.set("saludo", this.saludo);
    body.set("instagram", this.instagram);
    body.set("facebook", this.facebook);
    body.set("web", this.web);
    body.set("linkedin", this.linkedIn);
    body.set("twitter", this.twitter);
    body.set("tipo", "1");

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    this.http.post(this.apiUrl, body.toString(), options).subscribe(
      data => {
        console.log(JSON.stringify(data));
      },
      err => {
        console.log('respuesta porst mensaje');
        if (err.status === 200) {
          this.mostrarGuardado(
            "Se ha guardado tu información con éxito "
          );
        } else {
          this.mostrarGuardado(
            "No se ha podido guardar tu información"
          );
        }
      }
    );
  }

  mostrarAlertaEstatusPdf(title, subTitle) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: "Ok",
          handler: data => {
            //this.page = 'Lead';
            //this.content.resize();
          }
        }
      ]
    });
    alert.present();
  }

  chooseFile() {
    let loading = this.loadingCtrl.create({
      content: "Cargando carta presentación..."
    });

    this.chatService.connectAuxiliarChannel().then(() => {
      (async () => {
        const file = await (<any>window).chooser.getFile("application/pdf");
        var formData = new FormData();
        var blob = new Blob([file.data], { type: file.mediaType });
        formData.append(file.name, blob, file.name);
        this.chatService.tc.currentChannel.sendMessage(formData).then(() => {
          loading.present().then(() => {
            this.chatService.tc.currentChannel
              .getMessages()
              .then(messagesPaginator => {
                const message =
                  messagesPaginator.items[messagesPaginator.items.length - 1];
                if (message.type === "media") {
                  message.media
                    .getContentUrl()
                    .then(url => {
                      const httpOptions = {
                        headers: new HttpHeaders({
                          "Content-Type": "application/x-www-form-urlencoded"
                        })
                      };
                      url = encodeURIComponent(url);
                      //alert(url);
                      this.http
                        .post(
                          this.apiUrl,
                          { nombre_archivo: this.pdf, url_archivo: url },
                          httpOptions
                        )
                        .subscribe(
                          data => {
                            loading.dismiss();
                            this.mostrarAlertaEstatusPdf(
                              "Carta Presentación",
                              "El documento se guardó exitosamente"
                            );
                            //alert('enviado a whatsapp'+ JSON.stringify(data));
                          },
                          err => {
                            loading.dismiss();
                            if (err.status === 200) {
                              this.mostrarAlertaEstatusPdf(
                                "Carta Presentación",
                                "El documento se guardó exitosamente."
                              );
                            } else {
                              this.mostrarAlertaEstatusPdf(
                                "Carta Presentación",
                                "Ocurrió un problema durante la carga del documento."
                              );
                            }
                            console.log(JSON.stringify(err));
                          }
                        );
                    })
                    .catch(() => {
                      loading.dismiss();
                    });
                }
              })
              .catch(() => {
                loading.dismiss();
              });
          });
        });
      })();
    });
  }

  changeMail() {
    console.log(this.email);
    const body = new URLSearchParams();
    body.set('id_usuario', this.id);
    body.set('correo', this.email);
    body.set('tipo', '3');
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

      this.http.post(this.apiUrl, body.toString(), options).subscribe(
        data => {         
            console.log(JSON.stringify(data), 'enviado');
        },
        err => {
            console.log(err);
        }
      );
  }

  enviarVistaPrevia() {

    let loading = this.loadingCtrl.create({
      content: "Enviando Vista Previa..."
    });

    const body = new URLSearchParams();
    body.set('id_usuario', this.uuid);
    body.set('tipo_correo', '2');
    body.set('asunto', 'Vista Previa');

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    loading.present().then(() => {

    this.http.put(this.apiUrl, body.toString(), options)
        .subscribe(data => {
            loading.dismiss();
          this.mostrarGuardado(
            "Se ha enviado la Vista Previa"
          );
        }, err => {
          if (err.status === 200) {
            loading.dismiss();
            this.mostrarGuardado(
              "Se ha enviado la Vista Previa"
            );
          } else {
            loading.dismiss();
            this.mostrarGuardado(
              "No se ha podido enviar la Vista Previa"
            );
          }
        });
      });
  }

  public cambioInformacion() {
    const canal = "app";
    const tipo = "email-plantilla";
    return new Promise((resolve, reject) => {
      const url =
        "http://www.koomkin.com:4859/clickCambioInformacion/" +
        this.id +
        "/" +
        canal +
        "/" +
        tipo;
      this.http.get(url).subscribe(
        data => {
          resolve();
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  mostrarGuardado(title) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      buttons: [
        {
          text: "Ok",
          handler: data => {
            //this.page = 'Lead';
            //this.content.resize();
          }
        }
      ]
    });
    alert.present();
  }
}
