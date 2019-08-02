import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, LoadingController, NavParams, ModalController, Refresher } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { HttpClient } from "@angular/common/http";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { AlertController, InfiniteScroll, Content } from "ionic-angular";
import { HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: "page-leads",
  templateUrl: "leads.html"
})
export class LeadsPage implements OnInit {
  
  @ViewChild(Content)
  content: Content;
  leads: any = [];
  leadsfiltroseleccion: string;
  leadsfiltrados: any = [];
  showspinner = false;
  infinitespinnerisactive = false;
  page = 1;
  selectedLike;
  public califica;
  public calificacion;
  public clave;
  public noleidos;
  public id;
  public empresa;
  public complemento;
  public categoria;
  public urgencia = "No";
  public mensaje;
  public llamada;
  public status;
  public datosenvio;
  public title;
  public subtitle;
  public img;
  public idReportBanner;
  public scheduledAt: any;
  public uuidPass;
  public mostrar;
  public notification;
  public tipoBanner;
  public fondo;
  public description;
  public habilitado;
  public busquedaSin = 'W';
  public busquedaDescartado = 'D';
  public busquedaSeguimiento = 'S';
  public busquedaNegociacion = 'N';
  public busquedaVendido = 'V';
  public contadorSin = 0;
  public contadorDescartado = 0;
  public contadorSeguimiento = 0;
  public contadorNegociacion = 0;
  public contadorVendido = 0;
  public valorSin = 0;
  public valorDescartado = 0;
  public valorSeguimiento = 0;
  public valorNegociacion = 0;
  public valorVendido = 0;
  public url = "sinaudio";
  public audio;
  leads_pagination_min = 0;
  leads_pagination_max = 0;
  leads_download_available = true;
  public comentario;
  apiUrl = "https://www.koomkin.com.mx/api/app";

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public restService: RestProvider,
    public authService: AuthServiceProvider,
    public loadingCtrl: LoadingController
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

  ngOnInit() {
    this.showBanner();
    this.getInsertClickPagina();
  }

  ionViewDidEnter() {
    this.resetLeadsArray();
  }

  public stylizeLeads(leadsArray: any) {
    for (let k in leadsArray) {
      //leadsArray[k].FECHA = this.agregarHoras(leadsArray[k].FECHA).toString();
      leadsArray[k].fechaenvio = leadsArray[k].FECHA.substring(0, 16).replace(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{5})$/g,
        "$3/$2/$1$4"
      );
      leadsArray[k].EmailUsuarioEnvio = leadsArray[k].EMAIL;
      leadsArray[k].ABREVIACION = leadsArray[k].ESTADO;
      leadsArray[k].NombreUsuarioEnvio = leadsArray[k].NOMBRE.substring(0, 16);
      leadsArray[k].EmpresaUsuarioEnvio = leadsArray[k].EMPRESA.substring(0, 28);
      leadsArray[k].urgencia = "No";
      leadsArray[k].status = "exitosa";
      this.callMissed(leadsArray[k].uuid).then(status => {
        leadsArray[k].status = status;
      });

      leadsArray[k].url = "sinaudio";

      this.getCheckLeadComplement(leadsArray[k].clave)
        .then(urgencia => {
          leadsArray[k].urgencia = urgencia;
          if (leadsArray[k].urgencia == null || this.urgencia == "None") {
            leadsArray[k].urgencia = "No";
          } else if (leadsArray[k].urgencia == "Sí") {
            leadsArray[k].urgencia == "Si";
          }
        })
        .catch();
      this.getCheckLeadComplement2(leadsArray[k].clave)
        .then(mensaje => {
          if (
            mensaje == "Escribe aquí..." ||
            mensaje == "" ||
            mensaje == "null" ||
            mensaje == "None" ||
            mensaje == null
          ) {
            leadsArray[k].MENSAJE = leadsArray[k].MENSAJE;
          }
          leadsArray[k].MENSAJE = mensaje;
        })
        .catch();

      this.getUrlAudio(leadsArray[k].clave)
        .then(url => {
          if (
            url == "Escribe aquí..." ||
            url == "" ||
            url == "null" ||
            url == "None" ||
            url == null
          ) {
            leadsArray[k].url = "sinaudio";
          }
          leadsArray[k].url = url;
        })
        .catch();

        this.getUltimoComentario(leadsArray[k].clave)
        .then(comentario => {
          leadsArray[k].comentario = comentario;
          
        })
        .catch();

        this.getScheduled(leadsArray[k].clave)
        .then(scheduledAt => {
          leadsArray[k].scheduledAt = scheduledAt;
           if(leadsArray[k].scheduledAt != 'Sin agenda') {
            leadsArray[k].scheduledAt = this.agregarHoras(scheduledAt).toString();
           }     
        })
        .catch();

      if (leadsArray[k].calificaLead == "True") {
        leadsArray[k].calificaLead = "like";
      } else if (leadsArray[k].calificaLead == "False") {
        leadsArray[k].calificaLead = "dislike";
      } else {
        leadsArray[k].calificaLead = "vacio";
      }
      if (leadsArray[k].leido == "True" || leadsArray[k].leido == true) {
        leadsArray[k].leido = "leido";
      } else {
        leadsArray[k].leido = "noleido";
      }
      if (
        leadsArray[k].clasificaLead == '' ||
        leadsArray[k].clasificaLead == 'null' ||
        leadsArray[k].clasificaLead == null
      ) {
        leadsArray[k].clasificaLead = 'W';
      } else if (leadsArray[k].clasificaLead == 'Descartado' || leadsArray[k].clasificaLead.toLowerCase() == 'sin contacto') {
        leadsArray[k].clasificaLead = 'D';
      } else if (leadsArray[k].clasificaLead == 'Seguimiento') {
        leadsArray[k].clasificaLead = 'S';
      } else if (leadsArray[k].clasificaLead == 'Negociacion' || leadsArray[k].clasificaLead == 'En proceso de venta') {
        leadsArray[k].clasificaLead = 'N';
      } else if (leadsArray[k].clasificaLead == 'Vendido') {
        leadsArray[k].clasificaLead = 'V';
      }
    }
    console.log(leadsArray);
    this.checkNoleidos();
    return leadsArray;
  }

  public changeLike(classification: string, lead) {
    switch (classification) {
      case "L": {
        this.leads.calificaLead = "true";
        this.califica = "l";
        lead.calificaLead = "like";
        break;
      }
      case "DL": {
        this.leads.calificaLead = "false";
        this.califica = "d";
        lead.calificaLead = "dislike";
        break;
      }
      default:
        this.califica = null;
        lead.calificaLead = "vacio";
    }

    const body = {
      classification: this.califica
    };
    //// console.log(lead.clave);
    this.http
      .get(
        this.apiUrl + "/calificaLead/" + lead.clave + "/" + body.classification
      )
      .subscribe(
        data => {
          this.calificacion = data[0].calificaLead;
          //// console.log(this.calificacion);
        },
        err => {
          // console.log("Error occured");
        }
      );
  }

  verLead(lead) {
    let acceso = "App";
    this.navCtrl.push('LeadPage', lead);
    this.getInsertClickLead(lead.clave, lead.ID, acceso);
  }

  agregarLead() {
    this.navCtrl.push('AgregarLeadPage');
  }

  public changeLeido(lead) {
    const url = this.apiUrl + "/leerLead/" + lead.clave + "/" + lead.ID;
    this.http.get(url).subscribe(
      data => {
        this.noleidos = data[0].NoLeidos;
        if (this.noleidos > 99) {
          this.noleidos = "99+";
        }
        lead.leido = "leido";
      },
      err => {
        // console.log("Error occured");
      }
    );
  }

  public checkNoleidos() {
    const url = this.apiUrl + "/leerLead/0/" + this.id;
    this.http.get(url).subscribe(
      data => {
        this.noleidos = data[0].NoLeidos;
        if (this.noleidos > 99) {
          this.noleidos = "99+";
        }
      },
      err => {
        //// console.log("Error occured");
      }
    );
  }

  public callMissed(uuid) {
    const urlcallmissed = 'https://www.koomkin.com.mx/calltracker/missed_calls/' + uuid;
    return new Promise(resolve => {
      this.http.get(urlcallmissed).subscribe(
        data => {
          if (data == null) {
            status = "exitosa";
            resolve(status);
          } else if (data == 1 || data == 2) {
            status = "perdida";
            resolve(status);
          }
        },
        err => {
          // console.log(err);
        }
      );
    });
  }

  public getCheckLeadComplement(clave) {
    return new Promise(resolve => {
      const apiUrl2 = this.apiUrl + "/getLeadComplement/" + clave;
      this.http.get(apiUrl2).subscribe(
        data => {
          let urgencia;
          if (data[0] === null) {
            urgencia = "No";
            resolve(urgencia);
          } else if (Object.keys(data).length > 0) {
            if (data[0].Urgency) {
              urgencia = data[0].Urgency;
              // // console.log(urgencia);
              if (
                urgencia == "0" ||
                urgencia == "null" ||
                urgencia == "None" ||
                urgencia == "" ||
                urgencia == null
              ) {
                urgencia = "No";
                resolve(urgencia);
              }
              resolve(urgencia);
            } else {
              urgencia = "No";
              resolve(urgencia);
            }
            resolve(urgencia);
          }
        },
        err => {
          // // console.log(err);
        }
      );
    });
  }

  public getCheckLeadComplement2(clave) {
    return new Promise(resolve => {
      const apiUrl2 = this.apiUrl + "/getLeadComplement/" + clave;
      this.http.get(apiUrl2).subscribe(
        data => {
          //// console.log(data);
          if (Object.keys(data).length > 0) {
            this.categoria = data[0].CompanyType;
            let mensaje;
            switch (this.categoria) {
              case 1:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tus productos, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 2:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tus servicios, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 3:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tus servicios, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 4:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tus servicios, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 5:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tus productos, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 6:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].RestaurantUsage;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en hacer una reservación, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 7:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].HotelUsage;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está planeando hospedarse en tu hotel, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
              case 8:
                if (data[0] === null) {
                  resolve(mensaje);
                } else {
                  mensaje = data[0].Details;
                  if (
                    mensaje == "Escribe aquí..." ||
                    mensaje == "" ||
                    mensaje == "null" ||
                    mensaje == "None" ||
                    mensaje == null
                  ) {
                    mensaje =
                      "Este cliente está interesado en tu propiedad, contáctalo a la brevedad.";
                    resolve(mensaje);
                  }
                  resolve(mensaje);
                }
            }
          }
        },
        err => {
          // // console.log(err);
        }
      );
    });
  }

  public getLeadsArray() {
    this.leads_pagination_min = this.leads_pagination_max + 1;
    this.leads_pagination_max += 10;
    return this.provedor
      .getLeadsReportPagination(
        this.leads_pagination_min,
        this.leads_pagination_max
      )
      .then(
        (data: Array<Object>) => {
          if (data.length === 0) {
            this.leads_download_available = false;
          }
          // // console.log(JSON.stringify(this.leads));
          this.leads = this.leads.concat(this.stylizeLeads(data));
          this.clasificacionSeleccionadaFiltrar();
        },
        error => {
          // console.log(error);
        }
      );
  }

  public resetLeadsArray() {
    this.leads_pagination_min = 0;
    this.leads_pagination_max = 0;
    this.leads = [];
    this.leadsfiltrados = [];
    this.leads_pagination_min = this.leads_pagination_max + 1;
    this.leads_pagination_max += 10;

    this.provedor.getLeadsReportPagination(1, this.leads_pagination_max).then(
      (data: Array<Object>) => {
        if (data.length === 0) {
          this.leads_download_available = false;
        }
        this.leads = [];
        this.leads = this.leads.concat(this.stylizeLeads(data));
        this.clasificacionSeleccionadaFiltrar();
      },
      error => {
        // console.log(error);
      }
    );
  }

  public getInsertClickPagina() {
    const usuario = this.id;
    const pagina = "leads";
    const acceso = "App";
    this.provedor.getInsertClickPagina(usuario, pagina, acceso).then(
      data => {
        this.datosenvio = data;
      },
      err => {
        // console.log("error");
      }
    );
  }

  doRefresh(refresher: Refresher) {
    this.provedor.getLeadsReportPagination(1, this.leads_pagination_max).then(
      (data: Array<Object>) => {
        if (data.length === 0) {
          this.leads_download_available = false;
        }
        this.leads = [];
        this.leads = this.leads.concat(this.stylizeLeads(data));
        this.clasificacionSeleccionadaFiltrar();
      },
      error => {
        // console.log(error);
      }
    );
    setTimeout(() => {
      refresher.complete();
    }, 50);
  }

  public clasificacionSeleccionadaFiltrar() {
    var beforefilterlenght = this.leadsfiltrados.length;
    this.leadsfiltrados = this.leads;
    if (
      this.leadsfiltroseleccion == "Todos" ||
      this.leadsfiltroseleccion == null ||
      this.leadsfiltroseleccion == ""
    ) {
      // No filtrar
    } else {
      if (this.leadsfiltroseleccion == "Leidos") {
        this.filterLeadsLeido("leido");
      } else if (this.leadsfiltroseleccion == "NoLeidos") {
        this.filterLeadsLeido("noleido");
      } else if (this.leadsfiltroseleccion == "Like") {
        this.filterLeadsLike("like");
      } else if (this.leadsfiltroseleccion == "Dislike") {
        this.filterLeadsLike("dislike");
      } else if (this.leadsfiltroseleccion == "Audio") {
        this.filterLeadsAudio("sinaudio");
      } else if (this.leadsfiltroseleccion == "Chat") {
        this.filterLeadsChat("chat");
      } 
      var afterfilterlenght = this.leadsfiltrados.length;
    }
    if (this.leadsfiltrados.length < 5 && this.leads_download_available) {
      this.showspinner = true;
      this.getLeadsArray();
    } else if (
      beforefilterlenght == afterfilterlenght &&
      this.leads_download_available
    ) {
      this.showspinner = true;
      this.getLeadsArray();
    } else {
      this.showspinner = false;
    }
  }

  public getInsertClickLead(usuario, id, acceso) {
    this.restService.getInsertClickLead(id, usuario, acceso).then(
      data => {
        this.datosenvio = data;
      },
      err => {
        // console.log("error");
      }
    );
  }

  public filterLeadsLeido(criterioFiltro: string) {
    this.leadsfiltrados = this.leadsfiltrados.filter(function(data) {
      return data.leido == criterioFiltro;
    });
  }

  public filterLeadsLike(criterioFiltro: string) {
    this.leadsfiltrados = this.leadsfiltrados.filter(function(data) {
      return data.calificaLead == criterioFiltro;
    });
  }

  public filterLeadsAudio(criterioFiltro: string) {
    this.leadsfiltrados = this.leadsfiltrados.filter(function(data) {
      return data.url !== criterioFiltro;
    });
  }

  public filterLeadsChat(criterioFiltro: string) {
    this.leadsfiltrados = this.leadsfiltrados.filter(function(data) {
      return data.canalContacto == criterioFiltro;
    });
  }

  showConfirm(lead) {
    let btnCancel = {
      text: "Cancelar",
      role: "cancelar",
      cssClass: "cancel-button",
      handler: () => {
        // console.log("Disagree clicked");
      }
    };

    let btnOk = {
      text: "Aceptar",
      cssClass: "exit-button",
      handler: () => {
        this.callClient(lead);
        // console.log("Agree clicked");
      }
    };

    let confirm = this.alertCtrl.create({
      title: "¿Desea llamar a " + lead.NOMBRE + "?",
      cssClass: "buttonCss",
      buttons: [btnCancel, btnOk]
    });
    confirm.present();
  }

  public callClient(lead) {

    const body = new URLSearchParams();
    body.set("uuid", lead.uuid);
    body.set("canal", 'reporte-app');

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = 'https://koomkin.com.mx/calltracker/calling/';

    return new Promise(resolve => {
      this.http.post(url,body.toString(), options).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.infinitespinnerisactive = true;
    if (this.leads_download_available == false) {
      infiniteScroll.enable(false);
    }
    this.getLeadsArray().then(
      () => {
        infiniteScroll.complete();
        this.infinitespinnerisactive = false;
      },
      error => {
        // console.log(error);
      }
    );
  }

  getUltimoComentario(clave) {
    return new Promise(resolve => {
    this.provedor.getLastComment(clave).then(
      data => {
        let comentario = data;
        this.comentario = comentario;
        resolve(this.comentario);
      },
      err => {
        // console.log('error');
      }
    )
    });
  }

  getScheduled(clave) {
    return new Promise(resolve => {
    this.provedor.getScheduled(clave).then(
      data => {
        let scheduledAt = data;
        if(scheduledAt[0]) {
          this.scheduledAt = scheduledAt[0].scheduledAt;
          console.log(this.scheduledAt);
        } else {
          this.scheduledAt = 'Sin agenda';
        }
        resolve(this.scheduledAt);
      },
      err => {
        // console.log('error');
      }
    )
    });
  }

  public getUrlAudio(clave) {
    // // console.log(clave);
    return new Promise(resolve => {
      const apiurl = this.apiUrl + "/getUrlAudio/" + clave;
      this.http.get(apiurl).subscribe(
        data => {
          let url;
          if (data[0] === null) {
            url = "sinaudio";
            resolve(url);
          } else if (Object.keys(data).length > 0) {
            url = data[0].recordingsid;
            if (url == "0" || url == "null" || url == "None" || url == "") {
              url = "sinaudio";
              resolve(url);
            } else {
              resolve(url);
            }
            resolve(url);
          }
        },
        err => {
          // // console.log(err);
        }
      );
    });
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  public getBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner = "https://www.koomkin.com.mx/api/app/getBanner/" + this.id;
      let datos;
      this.http.get(urlBanner).subscribe(
        data => {
          if (data == null) {
            this.mostrar = 0;
          } else if (data[0]) {
            datos = data;
            
            this.title = datos[0].titulo;
            this.subtitle = datos[0].subtitulo;
            this.fondo = datos[0].fondo;
            this.tipoBanner = datos[0].tipoBanner;
            this.img = datos[0].descripcionBanner;
            this.idReportBanner = datos[0].idReporteBanner;
            this.uuidPass = datos[0].uuidPase;
            this.description = datos[0].descripcionBanner;
            this.habilitado = datos[0].habilitado;
            this.notification = JSON.parse(datos[0].dataPage);
            // // console.log(this.description);
            resolve();
          }
        },
        err => {
          // console.log(err);
          reject(err);
        }
      );
    });
  }

  public showBanner() {
    this.getBanner()
      .then(() => {
        this.mostrar = 1;
      })
      .catch(err => {
        // console.log(err);
      });
  }

  public clickBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner = "https://www.koomkin.com.mx/api/app/clickBanner/" + this.id + '/App/' + this.tipoBanner;
      this.http.get(urlBanner).subscribe(
        data => {
         // // console.log('registro',data);
          resolve();
        },
        err => {
         // // console.log(err);
          reject(err);
        }
      );
    });
  }

  agregarHoras(time){
    let date = new Date(time);
    date.setTime(date.getTime() + (5*60*60*1000));
    return date.toISOString();
  }

}


