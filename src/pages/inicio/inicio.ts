import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  MenuController,
  NavController,
  NavParams,
  ModalController,
} from "ionic-angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ToastController } from "ionic-angular";
import { GraphProvider } from "../../providers/graph/graph";

@IonicPage()
@Component({
  selector: "page-inicio",
  templateUrl: "inicio.html",
})
export class InicioPage implements OnInit {
  rootPage: any = "LoginPage";
  leads = "LeadsPage";
  reporte = "ReportePage";
  datos = "DatosPage";
  login = "LoginPage";
  inicio = "InicioPage";
  eficiencia = "EficienciaPage";
  brief = "MasBriefPage";
  financieros = "DatosFinancierosPage";
  crm = "CrmPage";
  agenda = "AgendaPage";
  freemium = "FreemiumPage";
  flowchart = "FlowchartPage";
  ayuda = "AyudaPage";

  pages: Array<{ title: string; component: any }>;

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
  public bannerFreemium;

  // Pages
  cotizador = false;

  constructor(
    private modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    public authService: AuthServiceProvider,
    public http: HttpClient,
    public toastCtrl: ToastController,
    private graphService: GraphProvider
  ) {
    this.recurrente = this.authService.recurrente;
    this.id = this.authService.id;
    this.activo = this.authService.activo;

    this.graphService
      .getStatusBot(this.authService.id)
      .subscribe((data: any) => {
        if (JSON.parse(data._body).result === "Ok") {
          this.cotizador = true;
        }
      });
  }

  ngOnInit() {
    // this.showBanner();
    // this.showFreemium();
    this.getUpsellsOffer();
  }

  pagina(pagina: any) {
    this.navCtrl.push(pagina);
    this.menuCtrl.close();
  }

  public getBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner =
        "https://www.koomkin.com.mx/api/app/getBanner/" + this.id;
      let datos;
      this.http.get(urlBanner).subscribe(
        (data) => {
          if (data == null) {
            this.mostrar = 0;
            this.tipoBanner = 0;
            this.habilitado = 0;
          } else if (data) {
            datos = data;
            if (datos[0]) {
              this.title = datos[0].titulo;
              this.subtitle = datos[0].subtitulo;
              this.fondo = datos[0].fondo;
              this.img = datos[0].descripcionBanner;
              this.idReportBanner = datos[0].idReporteBanner;
              this.uuidPass = datos[0].uuidPase;
              this.description = datos[0].descripcionBanner;
              this.habilitado = datos[0].habilitado;
              if (this.habilitado == null) {
                this.habilitado = 0;
              }
              this.notification = JSON.parse(datos[0].dataPage);
              this.tipoBanner = datos[0].tipoBanner;
              if (this.tipoBanner == 16 || this.tipoBanner == 17) {
                // this.openModal();
              }
            } else if (datos.length == 0) {
              this.tipoBanner = 0;
              this.habilitado = 0;
            }
            resolve();
          }
        },
        (err) => {
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
      .catch((err) => {
        // console.log(err);
      });
  }

  public showFreemium() {
    this.bannerFreemium = { active: false, gender: "M", briefId: "" };
    return new Promise((resolve, reject) => {
      // const url = `http://localhost:4859/freemiumInfo?userId=${this.id}`
      const url = `https://www.koomkin.com.mx/api/app/freemiumInfo?userId=${this.id}`;
      console.log(url);

      this.http.get(url).subscribe(
        (template) => {
          console.log(template);
          if (template["freemiumPromo"] === 1) {
            this.bannerFreemium = {
              active: true,
              gender: template["gender"],
              briefId: template["fireBaseBriefId"],
            };
          }
          resolve();
        },
        (err) => {
          //  console.log(err);
          reject(err);
        }
      );
    });
  }

  public clickBanner() {
    return new Promise((resolve, reject) => {
      const urlBanner =
        "https://www.koomkin.com.mx/api/app/clickBanner/" +
        this.id +
        "/App/" +
        this.tipoBanner;
      this.http.get(urlBanner).subscribe(
        (data) => {
          // // console.log('registro',data);
          resolve();
        },
        (err) => {
          // // console.log(err);
          reject(err);
        }
      );
    });
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: "Da click en el Aviso de la parte superior para continuar.",
      duration: 3000,
      position: "top",
      dismissOnPageChange: true,
    });
    toast.present();
  }

  openUpsellsModal(offerData) {
    const myModal = this.modal.create(
      "ModalUpsellsPage",
      {
        data: offerData,
      },
      { enableBackdropDismiss: true, cssClass: "Modal-upsells" }
    );
    myModal.present();
    myModal.onDidDismiss(() => {});
  }

  getUpsellsOffer() {
    const options = {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Access-Control-Allow-Origin", "*")
        .set(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        ),
    };

    this.http
      .post(
        "https://www.koomkin.com.mx/api/payment/upsell/check",
        {
          user_id: this.authService.id,
        },
        options
      )
      .toPromise()
      .then((response: any) => {
        if (response.offer === true) {
          this.openUpsellsModal(response);
        }
      })
      .catch((error: any) => {});
  }
}
