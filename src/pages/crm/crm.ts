import { Component, OnInit, ViewChild } from "@angular/core";
import { IonicPage, NavController, LoadingController, NavParams, ModalController, Refresher } from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { HttpClient } from "@angular/common/http";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { AlertController, InfiniteScroll, Content } from "ionic-angular";
import { HttpHeaders } from '@angular/common/http';

@IonicPage()
@Component({
  selector: "page-crm",
  templateUrl: "crm.html"
})
export class CrmPage implements OnInit {
  
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
  public fechaInic;
  public fechaFin;
  public hoy;
  public tresDias;
  public sieteDias;
  public catorceDias;
  public sigTresDias;
  public sigSieteDias;
  public sigCatorceDias;
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
    this.tresDias = new Date();
    this.sieteDias = new Date();
    this.catorceDias = new Date();
    this.sigTresDias = new Date();
    this.sigSieteDias = new Date();
    this.sigCatorceDias = new Date();

    this.hoy = f.getFullYear() + '-' + ('0' + (f.getMonth() + 1)).slice(-2) + '-' + f.getDate();

    this.tresDias.setDate(this.sigTresDias.getDate() - 3);
    // tslint:disable-next-line: max-line-length
    this.tresDias = this.tresDias.getFullYear() + '-' + ('0' + (this.tresDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.tresDias.getDate()).slice(-2);

    this.sieteDias.setDate(this.sieteDias.getDate() - 7);
    // tslint:disable-next-line: max-line-length
    this.sieteDias = this.sieteDias.getFullYear() + '-' + ('0' + (this.sieteDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.sieteDias.getDate()).slice(-2);

    this.catorceDias.setDate(this.catorceDias.getDate() - 14);
    // tslint:disable-next-line: max-line-length
    this.catorceDias = this.catorceDias.getFullYear() + '-' + ('0' + (this.catorceDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.catorceDias.getDate()).slice(-2);

    this.sigTresDias.setDate(this.sigTresDias.getDate() + 3);
    // tslint:disable-next-line: max-line-length
    this.sigTresDias = this.sigTresDias.getFullYear() + '-' + ('0' + (this.sigTresDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.sigTresDias.getDate()).slice(-2);

    this.sigSieteDias.setDate(this.sigSieteDias.getDate() + 7);
    // tslint:disable-next-line: max-line-length
    this.sigSieteDias = this.sigSieteDias.getFullYear() + '-' + ('0' + (this.sigSieteDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.sigSieteDias.getDate()).slice(-2);

    this.sigCatorceDias.setDate(this.sigCatorceDias.getDate() + 14);
    // tslint:disable-next-line: max-line-length
    this.sigCatorceDias = this.sigCatorceDias.getFullYear() + '-' + ('0' + (this.sigCatorceDias.getMonth() + 1)).slice(-2) + '-' + ('0' + this.sigCatorceDias.getDate()).slice(-2);

    this.fechaFin = this.hoy;

    this.showBanner();
    this.getInsertClickPagina();
  }

  ionViewDidEnter() {
    this.verFiltros();
  }

  public getLeads() {
    const cuerpo = this.url;

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/json'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/leads/getByUser';
    return new Promise((resolve, reject) => {
      this.http.post(url, cuerpo, options).subscribe(
        data => {
          console.log(data);
          this.listaLeads = data;
          if (this.listaLeads.length === 0) {
            this.leads_download_available = false;
          }
          this.ultimoLead = this.listaLeads[0];
          this.leads = this.leads.concat(this.stylizeLeads(this.listaLeads));
          this.leadsfiltrados = this.leads;
          return resolve(this.leadsfiltrados);
        },
        err => {
          console.log(err);
          return reject(err);
        }
      );
    });
  }

  verFiltros(mas?) {
    if (mas != 'cargar') {
      this.leadsfiltrados = [];
      this.leads = [];
      this.leads_pagination_min = 1;
      this.leads_pagination_max = 30;
      this.contadorSin = 0;
      this.contadorDescartado = 0;
      this.contadorSeguimiento = 0;
      this.contadorNegociacion = 0;
      this.contadorVendido = 0;
      this.valorSin = 0;
      this.valorDescartado = 0;
      this.valorSeguimiento = 0;
      this.valorNegociacion = 0;
      this.valorVendido = 0;
    } else {
      this.leads_pagination_min = this.leads_pagination_max + 1;
      this.leads_pagination_max += 30;
    }

    switch (this.filtro) {
      case 'actividad':
        switch (this.dias) {
          case 'Total':
            switch (this.tipo) {
              case 'Todos':
                if (this.fechaInic && this.fechaFin) {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-sline-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                } else {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-sline-length
                    this.url = `{"user_id":${this.id},"filters":[],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                }

              case 'Koomkin':
                if (this.fechaInic && this.fechaFin) {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                } else {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                }

              case 'Externos':
                if (this.fechaInic && this.fechaFin) {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[ {"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                } else {
                  if (this.mayor > 0 && this.menor > 0) {
                    if (this.mayor > this.menor) {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    } else {
                      // tslint:disable-next-line: max-line-length
                      this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                      return this.getLeads();
                    }
                    // tslint:disable-next-line: max-line-length
                  } else if (this.menor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else if (this.mayor > 0) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                }
              default:
            }
            return;

          case 'Últ. 3 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }


              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Últ. 7 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Últ. 14 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"ultimomensaje","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          default:
        }
        return;

      case 'fecha':
        switch (this.dias) {
          case 'Total':
            switch (this.tipo) {
              case 'Todos':
              if (this.fechaInic && this.fechaFin) {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-sline-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-sline-length
                  this.url = `{"user_id":${this.id},"filters":[],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              }

            case 'Koomkin':
              if (this.fechaInic && this.fechaFin) {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              }

            case 'Externos':
              if (this.fechaInic && this.fechaFin) {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"fechaenvio","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              }
            default:
          }
          return;

          case 'Últ. 3 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.tresDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Últ. 7 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.sieteDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Últ. 14 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"fechaenvio","op":">=","value":"${this.catorceDias} 00:00:00"},{"attr":"fechaenvio","op":"<=","value":"${this.hoy} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"fechaenvio","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              default:
            }
            return;
          default:
        }
        return;

      case 'siguiente':
        switch (this.dias) {
          case 'Total':
            switch (this.tipo) {
              case 'Todos':
              if (this.fechaInic && this.fechaFin) {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"scheduledAt","asc":d}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              }

              case 'Koomkin':
                if (this.fechaInic && this.fechaFin) {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } 

              case 'Externos':
                  if (this.fechaInic && this.fechaFin) {

                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"},{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.fechaInic} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.fechaFin} 23:59:59"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              } else {
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[ {"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              }
              default:
            }
            return;

          case 'Sig. 3 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigTresDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Sig. 7 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigSieteDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              default:
            }
            return;

          case 'Sig. 14 días':
            switch (this.tipo) {
              case 'Todos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Koomkin':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"not in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }

              case 'Externos':
                if (this.mayor > 0 && this.menor > 0) {
                  if (this.mayor > this.menor) {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":"${this.menor}"}, {"attr":"ValorLead","op":"<=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}}, {"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                    return this.getLeads();
                  }
                  // tslint:disable-next-line: max-line-length
                } else if (this.menor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":"<=","value":"${this.menor}"},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else if (this.mayor > 0) {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"ValorLead","op":">=","value":${this.mayor}},{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                } else {
                  // tslint:disable-next-line: max-line-length
                  this.url = `{"user_id":${this.id},"filters":[{"attr":"scheduledAt","op":">=","value":"${this.hoy} 00:00:00"},{"attr":"scheduledAt","op":"<=","value":"${this.sigCatorceDias} 23:59:59"},{"attr":"Canal","op":"in","value":["Reporte", "App"]}],"ordering":[{"attr":"scheduledAt","asc":false}],"paging":{"from":${this.leads_pagination_min},"to":${this.leads_pagination_max}}}`;
                  return this.getLeads();
                }
              default:
            }
            return;
          default:
        }
        return;
      default:
    }
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
      this.getUltimoComentario(leadsArray[k].clave)
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
        this.contadorSin = this.contadorSin + 1;
        // tslint:disable-next-line: radix
        this.valorSin = this.valorSin + parseInt(leadsArray[k].ValorLead);
      } else if (leadsArray[k].clasificaLead === 'Descartado' || leadsArray[k].clasificaLead.toLowerCase() == 'sin contacto') {
        leadsArray[k].clasificaLead = 'D';
        this.contadorDescartado = this.contadorDescartado + 1;
        this.valorDescartado = this.valorDescartado + parseInt(leadsArray[k].ValorLead);
      } else if (leadsArray[k].clasificaLead === 'Seguimiento') {
        leadsArray[k].clasificaLead = 'S';
        this.contadorSeguimiento = this.contadorSeguimiento + 1;
        this.valorSeguimiento = this.valorSeguimiento + parseInt(leadsArray[k].ValorLead);
      } else if (leadsArray[k].clasificaLead === 'Negociacion' || leadsArray[k].clasificaLead == 'En proceso de venta') {
        leadsArray[k].clasificaLead = 'N';
        this.contadorNegociacion = this.contadorNegociacion + 1;
        this.valorNegociacion = this.valorNegociacion + parseInt(leadsArray[k].ValorLead);
      } else if (leadsArray[k].clasificaLead === 'Vendido') {
        leadsArray[k].clasificaLead = 'V';
        this.contadorVendido = this.contadorVendido + 1;
        this.valorVendido = this.valorVendido + parseInt(leadsArray[k].ValorLead);
      }
    }
    this.filterLeadsEstatus(leadsArray);
    this.filterLeadsDescartado(leadsArray);
    this.filterLeadsSeguimiento(leadsArray);
    this.filterLeadsNegociacion(leadsArray);
    this.filterLeadsVendido(leadsArray);
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

  public filterLeadsEstatus(leadsArray) {
    this.leadsEstatus = leadsArray.filter(function(data) {
      return data.clasificaLead == 'W';
    });
  }

  public filterLeadsDescartado(leadsArray) {
    this.leadsDescartados = leadsArray.filter(function(data) {
      return data.clasificaLead == 'D';
    });
  }

  public filterLeadsSeguimiento(leadsArray) {
    console.log(leadsArray,'leads');
    this.leadsSeguimiento = leadsArray.filter(function(data) {
      return data.clasificaLead == 'S';
    });
  }

  public filterLeadsNegociacion(leadsArray) {
    this.leadsNegociacion = leadsArray.filter(function(data) {
      return data.clasificaLead == 'N';
    });
  }

  public filterLeadsVendido(leadsArray) {
    this.leadsVendidos = leadsArray.filter(function(data) {
      return data.clasificaLead == 'V';
    });
  }

  public eraseFilters() {
    this.filtro = 'actividad';
    this.tipo = 'Todos';
    this.dias = 'Total';
    this.mayor = '';
    this.menor = '';
  }

  public showFilters() {
    console.log(this.filtro,
    this.dias,
    this.tipo,
    this.mayor,
    this.menor);
  }

  public changeFilter(valor) {
    this.filtro = valor;
    this.dias = 'Total';
  }

  public advancedFilters() {
    if(this.filtros == false) {
      this.filtros = true;
    } else {
      this.filtros = false;
    }
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
    this.verFiltros('cargar').then(
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


