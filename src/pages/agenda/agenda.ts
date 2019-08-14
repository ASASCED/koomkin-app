import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, LoadingController, NavParams, ModalController, Refresher } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { HttpClient } from "@angular/common/http";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { AlertController, InfiniteScroll, Content } from "ionic-angular";
import { HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';

@IonicPage()
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage implements OnInit {

  @ViewChild(Content)

  public scheduleList;
  segment = 'hoy';
  public listSegment: Array<string> = ['todos', 'hoy', 'manana'];
  excludeTracks: any = [];
  shownSessions: any = [];
  // groups: any = [{ time: '7 a. m.' }, { time: '8 a. m.' }, { time: '9 a. m.' }, { time: '10 a. m.' }, { time: '11 a. m.' }, { time: '12 p. m.' }, { time: '1 p. m.' }, { time: '2 p. m.' }, { time: '3 p. m.' }, { time: '4 p. m.' }, { time: '5 p. m.' }, { time: '6 p. m.' }, { time: '7 p. m.' }, { time: '8 p. m.' }, { time: '9 p. m.' }, { time: '10 p. m.' }];
  groups: any = [{ time: '07:00', hide: 'true' }, { time: '08:00' }, { time: '09:00' }, { time: '10:00' }, { time: '11:00' }, { time: '12:00' }, { time: '13:00' }, { time: '14:00' }, { time: '15:00' }, { time: '16:00' }, { time: '17:00' }, { time: '18:00' }, { time: '19:00' }, { time: '20:00' }, { time: '21:00' }, { time: '22:00' }];
  content: Content;
  listaleads = 1;
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
  public fechaInic;
  public fechaFin;
  public hoy;
  public manana;
  public treintaDias;
  public listaLeadsHoy;
  public clientesTotal;
  public valorTotal = 0;
  public valorTotalHoy = 0;
  public clientesTotalHoy;
  public listaLeadsManana;
  public valorTotalManana = 0;
  public clientesTotalManana;
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
  public filtros = false;
  apiUrl = "https://www.koomkin.com.mx/api/app";
  public estatus: string = "Lead";
  public listaEstatus: Array<string> = ['Lead', 'Descartado', 'Seguimiento', 'Negociacion','Vendido'];
  public filtro: any = 'actividad';
  public tipo = 'Todos';
  public dias = 'Total';
  public listaLeads;
  public valor: any;
  public mayor: any = '';
  public menor: any = '';
  public ultimoLead;
  public fechafiltroinicial;
  public fechafiltrofinal;
  public leadsEstatus: any = [];
  public leadsDescartados: any = [];
  public leadsSeguimiento: any = [];
  public leadsNegociacion: any = [];
  public leadsVendidos: any = [];
  public id;
  public empresa;
  public dia;

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
    let f = new Date();
    this.dia = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);
    this.manana = new Date();
    this.treintaDias = new Date();
    this.hoy = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + ('0' + f.getDate()).slice(-2);
    this.manana.setDate(this.manana.getDate() + 1);
    // tslint:disable-next-line: max-line-length
    this.manana = this.manana.getFullYear() + '-' + ('0' + (this.manana.getMonth() + 1)).slice(-2) + '-' + ('0' + this.manana.getDate()).slice(-2);
    this.treintaDias.setDate(this.treintaDias.getDate() + 30);
    // tslint:disable-next-line: max-line-length
    this.treintaDias = this.treintaDias.getFullYear() + '-' + ('0' + (this.treintaDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.treintaDias.getDate()).slice(-2);
    this.fechaFin = this.hoy;
    this.showBanner();
    this.getInsertClickPagina();
  }

  ionViewDidEnter() {
    this.getLeads();
  }

  public traeleads() {
    this.hoy = new Date(this.fechaInic);
    this.hoy.setDate(this.hoy.getDate() + 1);
    this.hoy = this.hoy.getFullYear() + '-' + ('0' + (this.hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + this.hoy.getDate()).slice(-2);
    this.manana = new Date(this.fechaInic);
    this.manana.setDate(this.manana.getDate() + 2);
    // tslint:disable-next-line: max-line-length
    this.manana = this.manana.getFullYear() + '-' + ('0' + (this.manana.getMonth() + 1)).slice(-2) + '-' + ('0' + this.manana.getDate()).slice(-2);
    this.treintaDias = new Date(this.fechaInic);
    this.treintaDias.setDate(this.treintaDias.getDate() + 31);
    // tslint:disable-next-line: max-line-length
    this.treintaDias = this.treintaDias.getFullYear() + '-' + ('0' + (this.treintaDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.treintaDias.getDate()).slice(-2);
    this.getLeads();
  }


  public getLeads() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando Leads...'
    });

    loading.present();
    const cuerpo = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.treintaDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":true}],"paging":{"from":1,"to":100}}`;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };

    // console.log(cuerpo);
    
    const url = 'https://www.koomkin.com.mx/api/leads/getByUser';
   // const url = 'http://192.168.0.119:5001/getByUser';

    return new Promise((resolve, reject) => {
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          this.listaLeads = data;
          if (this.listaLeads.length === 0) {
            this.leads_download_available = false;
          }
          let minHoy = format(new Date(this.hoy + ' 00:00:00.000'), 'YYYY-MM-DD HH:mm:ss.SSS');
          let maxHoy: any = format(new Date(this.hoy + ' 23:59:59.999'), 'YYYY-MM-DD HH:mm:ss.SSS');
          this.listaLeadsHoy = this.listaLeads.filter((item: any) =>
            item.scheduledAt >= minHoy && item.scheduledAt <= maxHoy
          );
          this.clientesTotalHoy = Object.keys(this.listaLeadsHoy).length;
          // tslint:disable-next-line: forin
          for (let k in this.listaLeadsHoy) {
             // tslint:disable-next-line: radix
             if (this.listaLeadsHoy[k].ValorLead == 'null' || this.listaLeadsHoy[k].ValorLead == null) {
                // tslint:disable-next-line: no-unused-expression
                this.listaLeadsHoy[k].ValorLead = 0;
             }
            this.valorTotalHoy = this.valorTotalHoy + parseInt(this.listaLeadsHoy[k].ValorLead);
          }
          let minManana = format(new Date(this.manana + ' 00:00:00.000'), 'YYYY-MM-DD HH:mm:ss.SSS');
          let maxManana: any = format(new Date(this.manana + ' 23:59:59.999'), 'YYYY-MM-DD HH:mm:ss.SSS');
          this.listaLeadsManana = this.listaLeads.filter((item: any) =>
            item.scheduledAt >= minManana && item.scheduledAt <= maxManana
          );
          this.clientesTotalManana = Object.keys(this.listaLeadsManana).length;
          // tslint:disable-next-line: forin
          for (let k in this.listaLeadsManana) {
             // tslint:disable-next-line: radix
             if (this.listaLeadsManana[k].ValorLead == 'null' || this.listaLeadsManana[k].ValorLead == null) {
                // tslint:disable-next-line: no-unused-expression
                this.listaLeadsManana[k].ValorLead = 0;
             }
              this.valorTotalManana = this.valorTotalManana + parseInt(this.listaLeadsManana[k].ValorLead);
          }
          this.clientesTotal = Object.keys(this.listaLeads).length;

          for (let k in this.listaLeads) {
            // tslint:disable-next-line: radix
            if (this.listaLeads[k].ValorLead == 'null' || this.listaLeads[k].ValorLead == null) {
               // tslint:disable-next-line: no-unused-expression
               this.listaLeads[k].ValorLead = 0;
            }
             this.valorTotal = this.valorTotal + parseInt(this.listaLeads[k].ValorLead);
         }
          this.ultimoLead = this.listaLeads[0];
          this.leads = this.leads.concat(this.stylizeLeads(this.listaLeads));
          this.leadsfiltrados = this.leads;
          loading.dismiss();
          return resolve(this.leadsfiltrados);
        },
        err => {
          loading.dismiss();
          console.log(err);
          return reject(err);
        }
      );
    });
  }

  public stylizeLeads(leadsArray: any) {
    // tslint:disable-next-line: forin
    for (let k in leadsArray) {
      leadsArray[k].fechaenvio = leadsArray[k].fechaenvio.substring(0, 16).replace(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{5})$/g,
        '$3/$2/$1$4'
      );
      leadsArray[k].NombreUsuarioEnvio = leadsArray[k].NombreUsuarioEnvio;
      if (leadsArray[k].NombreUsuarioEnvio.split(' ').length > 1) {
        // tslint:disable-next-line: max-line-length
        leadsArray[k].NombreUsuarioEnvio = leadsArray[k].NombreUsuarioEnvio.split(' ')[0] + ' ' + leadsArray[k].NombreUsuarioEnvio.split(' ')[1];
        if (leadsArray[k].NombreUsuarioEnvio.split('-').length > 1) {
          leadsArray[k].NombreUsuarioEnvio = leadsArray[k].NombreUsuarioEnvio.split('-')[0];
          leadsArray[k].NombreUsuarioEnvio = leadsArray[k].NombreUsuarioEnvio.substring(0, 25);
        }
      }
      leadsArray[k].EmpresaUsuarioEnvio = leadsArray[k].EmpresaUsuarioEnvio.substring(0, 28);
      leadsArray[k].urgencia = 'No';
      leadsArray[k].status = 'exitosa';
      if (leadsArray[k].ValorLead !== 'null' && leadsArray[k].ValorLead != null && leadsArray[k].ValorLead !== undefined) {
        leadsArray[k].ValorLead = leadsArray[k].ValorLead;
      } else {
        leadsArray[k].ValorLead = 0;
      }
      this.callMissed(leadsArray[k].uuid).then(status => {
        leadsArray[k].status = status;
      });
      leadsArray[k].url = 'sinaudio';

      this.getCheckLeadComplement(leadsArray[k].clave)
        .then(urgencia => {
          leadsArray[k].urgencia = urgencia;
          if (leadsArray[k].urgencia == null || this.urgencia == 'None') {
            leadsArray[k].urgencia = 'No';
          }
        })
        .catch();
      this.getCheckLeadComplement2(leadsArray[k].clave)
        .then(mensaje => {
          if (
            mensaje === 'Escribe aquí...' ||
            mensaje === '' ||
            mensaje === 'null' ||
            mensaje === 'None' ||
            mensaje == null
          ) {
            leadsArray[k].MENSAJE = leadsArray[k].MENSAJE;
          }
          leadsArray[k].MENSAJE = mensaje;
        })
        .catch();

      if (leadsArray[k].scheduledAt !== 'null') {
        leadsArray[k].scheduledAt = leadsArray[k].scheduledAt;
      } else {
        leadsArray[k].scheduledAt = 'Sin agenda';
      }

      this.getUrlAudio(leadsArray[k].clave)
        .then(url => {
          if (
            url === 'Escribe aquí...' ||
            url === '' ||
            url === 'null' ||
            url === 'None' ||
            url === null
          ) {
            leadsArray[k].url = 'sinaudio';
          }
          leadsArray[k].url = url;
        })
        .catch();
      //  console.log(leadsArray[k].url);
      this.getUltimoComentario(leadsArray[k].uuid)
        .then(comentario => {
          leadsArray[k].comentario = comentario;
        })
        .catch();
      if (leadsArray[k].calificaLead === 'True') {
        leadsArray[k].calificaLead = 'like';
      } else if (leadsArray[k].calificaLead === 'False') {
        leadsArray[k].calificaLead = 'dislike';
      } else {
        leadsArray[k].calificaLead = 'vacio';
      }
      if (leadsArray[k].leido === 'True' || leadsArray[k].leido === true) {
        leadsArray[k].leido = 'leido';
      } else {
        leadsArray[k].leido = 'noleido';
      }
      if (
        leadsArray[k].clasificaLead === '' ||
        leadsArray[k].clasificaLead === 'null' ||
        leadsArray[k].clasificaLead == null
      ) {
        leadsArray[k].clasificaLead = 'W';
      } else if (leadsArray[k].clasificaLead === 'Descartado' || leadsArray[k].clasificaLead.toLowerCase() == 'sin contacto') {
        leadsArray[k].clasificaLead = 'D';
      } else if (leadsArray[k].clasificaLead === 'Seguimiento') {
        leadsArray[k].clasificaLead = 'S';
      } else if (leadsArray[k].clasificaLead === 'Negociacion' || leadsArray[k].clasificaLead == 'En proceso de venta') {
        leadsArray[k].clasificaLead = 'N';
      } else if (leadsArray[k].clasificaLead === 'Vendido') {
        leadsArray[k].clasificaLead = 'V';
      }
    }
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

  public getInsertClickPagina() {
    const usuario = this.id;
    const pagina = "crm";
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
    this.getLeads();
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

  public showConfirm(lead) {
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
    this.getLeads().then(
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
            // console.log(this.description);
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

  onTabChanged(tabName) {
    this.estatus = tabName;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

