import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  MenuController,
  NavController,
  NavParams
} from "ionic-angular";
import { ModalNotificationPage } from '../../pages/modal-notification/modal-notification';

import { LoginPage } from '../../pages/login/login';
import { LeadsPage } from '../../pages/leads/leads';
import { LeadPage } from '../../pages/lead/lead';
import { ReportePage } from '../../pages/reporte/reporte';
import { UsuarioPage } from '../../pages/usuario/usuario';
import { FacturasPage } from '../../pages/facturas/facturas';
import { FacturaPage } from '../../pages/factura/factura';
import { DatosPage } from '../../pages/datos/datos';
import { CancelarPage } from '../../pages/cancelar/cancelar';
import { PreguntaPage } from '../../pages/pregunta/pregunta';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EficienciaPage } from '../eficiencia/eficiencia';

@IonicPage()
@Component({
  selector: "page-inicio",
  templateUrl: "inicio.html"
})
export class InicioPage implements OnInit {

  rootPage: any = LoginPage;
  leads = LeadsPage;
  reporte = ReportePage;
  datos = DatosPage;
  facturas = FacturasPage;
  usuario = UsuarioPage;
  factura = FacturaPage;
  cancelar = CancelarPage;
  pregunta = PreguntaPage;
  login = LoginPage;
  lead = LeadPage;
  inicio = InicioPage;
  eficiencia = EficienciaPage;

  pages: Array<{ title: string, component: any }>;

  public id;
  public title;
  public subtitle;
  public img;
  public idReportBanner;
  public uuidPass;
  public mostrar;
  public notification;
  public tipoBanner;
  public fondo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public http: HttpClient,

  ) {
    this.id = this.authService.id;

    this.pages = [
      { title: "Reporte", component: ReportePage },
      { title: "Leads", component: LeadsPage },
      { title: "Datos", component: DatosPage },
      { title: "Facturas", component: FacturasPage },
      { title: "Usuario", component: UsuarioPage },
      { title: "Factura", component: FacturaPage },
      { title: "Cancelar", component: CancelarPage },
      { title: "Pregunta", component: PreguntaPage },
      { title: "Lead", component: LeadPage },
      { title: "Login", component: LoginPage },
      { title: "Inicio", component: InicioPage },
      { title: "Eficiencia", component: EficienciaPage },
    ];
  }

  ngOnInit() {
    // this.getLeadsArray();
    this.showBanner();
  }

  pagina(pagina: any) {
    console.log(pagina);
    this.navCtrl.push(pagina);
    this.menuCtrl.close();
  }

  public getBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner = "http://www.koomkin.com:4859/getBanner/" + this.id;
      let datos;
      this.http.get(urlBanner).subscribe(
        data => {
          if (data == null) {
            this.mostrar = 0;
          } else if (data) {
            datos = data;
            console.log(datos);
            this.title = datos[0].titulo;
            this.subtitle = datos[0].subtitulo;
            this.fondo = datos[0].fondo;
            this.tipoBanner = datos[0].tipoBanner;
            this.img = datos[0].descripcionBanner;
            this.idReportBanner = datos[0].idReporteBanner;
            this.uuidPass = datos[0].uuidPase;
           
            this.notification = JSON.parse(datos[0].dataPage);
            resolve();
          }
        },
        err => {
          console.log(err);
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
        console.log(err);
      });
  }

  public clickBanner() {
    console.log('entro');
    return new Promise((resolve, reject) => {
      const urlBanner = "http://www.koomkin.com:4859/clickBanner/" + this.id + '/App/' + this.tipoBanner;
      this.http.get(urlBanner).subscribe(
        data => {
         // console.log('registro',data);
          resolve();
        },
        err => {
         // console.log(err);
          reject(err);
        }
      );
    });
  }

  mostrar_modal() {
    this.navCtrl.push(ModalNotificationPage, { notificacion: this.notification, idReporteBanner: this.idReportBanner, uuidPase:this.uuidPass });
  }
}