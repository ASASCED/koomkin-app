import { Component, OnInit } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from "ionic-angular";
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-inicio",
  templateUrl: "inicio.html"
})
export class InicioPage implements OnInit {

  rootPage: any = 'LoginPage';
  leads = 'LeadsPage';
  reporte = 'ReportePage';
  datos = 'DatosPage';
  login = 'LoginPage';
  inicio = 'InicioPage';
  eficiencia = 'EficienciaPage';
  brief = 'BriefPage';
  financieros = 'DatosFinancierosPage';
  crm = 'CrmPage';
  agenda = 'AgendaPage';

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
  public description;
  public habilitado;
  public activo;
  public recurrente;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public http: HttpClient,
    public toastCtrl: ToastController
  ) {
    this.recurrente = this.authService.recurrente;
    this.id = this.authService.id;
    this.activo = this.authService.activo;
  }

  ngOnInit() {
    this.showBanner();
  }

  pagina(pagina: any) {
    this.navCtrl.push(pagina);
    this.menuCtrl.close();
  }

  public getBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner = "https://www.koomkin.com.mx/api/app/getBanner/" + this.id;
      let datos;
      this.http.get(urlBanner).subscribe(
        data => {
          console.log(data);

          if (data == null) {
            this.mostrar = 0;
            this.tipoBanner = 0;
              this.habilitado = 0;
          } else if (data) {
            datos = data;
            if(datos[0]) {
              this.title = datos[0].titulo;
              this.subtitle = datos[0].subtitulo;
              this.fondo = datos[0].fondo;
              this.tipoBanner = datos[0].tipoBanner;
              this.img = datos[0].descripcionBanner;
              this.idReportBanner = datos[0].idReporteBanner;
              this.uuidPass = datos[0].uuidPase;
              this.description = datos[0].descripcionBanner;
              this.habilitado = datos[0].habilitado;
              if(this.habilitado == null) {
                this.habilitado = 0;
              }
              this.notification = JSON.parse(datos[0].dataPage);
            } else if(datos.length == 0) {
              this.tipoBanner = 0;
              this.habilitado = 0;
            }
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

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Da click en el Aviso de la parte superior para continuar.',
      duration: 3000,
      position: 'top',
      dismissOnPageChange: true
    });
    toast.present();
  }
}