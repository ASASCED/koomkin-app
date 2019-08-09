import { Component, OnInit } from "@angular/core";
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from "ionic-angular";
import { RestProvider } from "./../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";
import swal from 'sweetalert2';

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

  apiUrl = 'https://www.koomkin.com.mx/mailing/update_pdf/';

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
        if (this.datos[0]) {
          this.email = this.datos[0].email;
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
        //   // console.log('error');
      }
    );
  }

  changeInfo() {
    const body = new URLSearchParams();
    body.set("id_usuario", this.id);
    body.set("message", this.saludo);

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    this.http.post('https://www.koomkin.com.mx/mailing/update_message/', body.toString(), options).subscribe(
      data => {
        console.log(data);
        this.showSuccess();
      },
      err => {
        // console.log('respuesta porst mensaje');
        if (err.status === 200) {
          this.showSuccess();
        } else {
          this.showError();
        }
      }
    );
  }

  changeMail() {
    const body = new URLSearchParams();
    body.set('id_usuario', this.id);
    body.set('email', this.email);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    this.http.post('https://www.koomkin.com.mx/mailing/update_email/', body.toString(), options).subscribe(
      data => {
        console.log(data);
        // console.log(JSON.stringify(data), 'enviado');
      },
      err => {
        // console.log(err);
        if (err.status === 200) {
          this.showSuccess();
        } else {
          this.showError();
        }
      }
    );
  }

  enviarVistaPrevia() {

    const body = new URLSearchParams();
    body.set('user_uuid', this.uuid);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    this.http.post('https://www.koomkin.com.mx/mailing/preview/', body.toString(), options).subscribe(
      data => {
        this.showSuccessP();
        console.log(data);
      }, err => {
        console.log(err);
        if (err.status === 200) {
          this.showSuccessP();
        } else {
          this.showErrorP();
        }
      });
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
            this.chatService.tc.currentChannel.getMessages()
              .then(messagesPaginator => {
                const message = messagesPaginator.items[messagesPaginator.items.length - 1];
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
                            this.chatService.disconnectAuxiliarChannel();
                            loading.dismiss();
                            this.mostrarAlertaEstatusPdf(
                              "Carta Presentación",
                              "El documento se guardó exitosamente"
                            );
                            //alert('enviado a whatsapp'+ JSON.stringify(data));
                          },
                          err => {
                            this.chatService.disconnectAuxiliarChannel();
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
                            // console.log(JSON.stringify(err));
                          }
                        );
                    })
                    .catch(() => {
                      loading.dismiss();
                    });
                }
              }).catch(() => {
                loading.dismiss();
              });
          }).catch(reason => {console.log(reason)});
        }).catch(reason=>{console.log(reason)});
      })();
    }).catch(reason => {console.log(reason)});
  }

  public cambioInformacion() {
    const canal = "app";
    const tipo = "email-plantilla";
    return new Promise((resolve, reject) => {
      const url = "https://www.koomkin.com.mx/api/app/clickCambioInformacion/" + this.id + "/" + canal + "/" + tipo;
      this.http.get(url).subscribe(
        data => {
          resolve();
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  public showSuccessP() {
    swal({
      title: 'Se ha enviado la vista previa con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showErrorP() {
    swal({
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }

  public showSuccess() {
    swal({
      title: 'Se ha guardado tu información con éxito',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true,
    });
  }

  public showError() {
    swal({
      title: 'No se ha podido guardar tu información',
      text: 'Por favor complete los campos requeridos *',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      reverseButtons: true
    });
  }
}
