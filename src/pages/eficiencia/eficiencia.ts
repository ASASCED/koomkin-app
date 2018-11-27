import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  Range
} from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FormControl, FormGroup } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-eficiencia",
  templateUrl: "eficiencia.html"
})
export class EficienciaPage implements OnInit {
  public datosenvio;
  public datos;

  public top = "N/A";
  public posicion = "N/A";

  public fiveprogress = "0";
  public thirtyprogress = "0";

  public idcuarta;
  clientes: number = 0;
  clientes2: number = 0;

  public empresa;
  public id;
  public clientUUID = this.authService.getClientUUID();
  public empresa_tiempo = "N/A";
  public empresas_tiempo = "N/A";
  public empresa_atendidos = "N/A";
  public empresas_atendidos = "N/A";
  public empresa_acciones = "N/A";
  public empresas_acciones = "N/A";
  public empresa_negociacion = "N/A";
  public empresas_negociacion = "N/A";
  public empresa_contacto = "N/A";
  public empresas_contacto = "N/A";
  public ganadores;

  public columnChartData: any = {
    chartType: "ColumnChart",
    dataTable: [
      ["Country", "Performance", "Profits"],
      ["Germany", 700, 1200],
      ["USA", 300, 600],
      ["Brazil", 400, 500],
      ["Canada", 500, 1000],
      ["France", 600, 1100],
      ["RU", 800, 1000]
    ],
    options: { title: "Countries" }
  };

  public bar_ChartData: any = {
    chartType: "BarChart",
    dataTable: [
      ["Posición", "Leads", { role: "style" }],
      ["1", 11.04, "color: #f5a623"],
      ["100", 10.14, "color: #3DCDBB"],
      ["200", 8.51, "color: #3DCDBB"],
      ["300", 7.08, "color: #3DCDBB"],
      ["400", 5.86, "color: #3DCDBB"],
      ["500", 3.89, "color: #3DCDBB"],
      ["600", 2.94, "color: #3DCDBB"],
      ["700", 1.49, "color: #3DCDBB"],
      ["800", 0.68, "color: #3DCDBB"],
      ["900", 0.13, "color: #3DCDBB"],
      ["+1000", 0, "color: #3DCDBB"]
    ],
    options: {
      tooltip: { isHtml: true },
      chartArea: { width: "75%", heigth: "100%" },
      legend: { position: "none" },
      bars: "horizontal",
      is3D: true,
      hAxis: {
        title: "Leads en cierre de venta",
        textStyle: {
          color: "#288AC1",
          fontSize: 8,
          fontName: "Arial",
          italic: true
        },
        titleTextStyle: {
          color: "#288AC1",
          fontSize: 10,
          fontName: "Arial",
          bold: true,
          italic: true
        }
      },
      vAxis: {
        title: "Posición",
        textStyle: {
          color: "#288AC1",
          fontSize: 8,
          fontName: "Arial",
          italic: true
        },
        titleTextStyle: {
          color: "#288AC1",
          fontSize: 10,
          fontName: "Arial",
          bold: true,
          italic: true
        }
      },
      bar: { groupWidth: "60%" }
    }
  };

  public premios = [
    "20,000",
    "18,000",
    "16,000",
    "14,000",
    "12,000",
    "10,000",
    "8,000",
    "6,000",
    "4,000",
    "2,000"
  ];
  public palabrasempresa = [
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    }
  ];
  public palabrasempresas = [
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    },
    {
      palabra: "N/A"
    }
  ];

  //seccion tips
  public tip1: boolean = false;
  public tip2: boolean = false;
  public tip3: boolean = false;
  public tip1_text;
  public tip2_text;
  public tip3_text;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public alertCtrl: AlertController,
    private modal: ModalController
  ) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

  ngOnInit() {
    this.getInsertClickPagina();
    this.getEficiency();
    this.getEficiencyRanking();
    this.getWords();
    this.getTopTen();
  }

  openModalFuncionalidadPrueba(image, title, message) {
    const myModal = this.modal.create(
      "ModalEficiencyPage",
      { imagen: image, titulo: title, mensaje: message },
      { enableBackdropDismiss: false, cssClass: "Modal-prueba-chat" }
    );
    myModal.present();
    myModal.onDidDismiss(() => {});
  }

  opentipventa(tip) {
    if (tip === "tip1") {
      this.tip1 = true;
      this.tip2 = false;
      this.tip3 = false;
    } else if (tip === "tip2") {
      this.tip1 = false;
      this.tip2 = true;
      this.tip3 = false;
    } else if (tip === "tip3") {
      this.tip1 = false;
      this.tip2 = false;
      this.tip3 = true;
    }
  }

  rangeCtrl = new FormControl({ value: "66", disabled: true });
  dualRangeCtrl = new FormControl({
    value: { lower: 33, upper: 60 },
    disabled: true
  });

  rangeForm = new FormGroup({
    range: this.rangeCtrl,
    dualRange: this.dualRangeCtrl
  });

  rangeChange(range: Range) {
    console.log(`range, change, ratio: ${range.ratio}, value: ${range.value}`);
  }

  public getInsertClickPagina() {
    const usuario = this.id;
    const pagina = "eficiencia";
    const acceso = "App";
    //  console.log(usuario, pagina, acceso);
    this.provedor.getInsertClickPagina(usuario, pagina, acceso).then(
      data => {
        this.datosenvio = data;
      },
      err => {
        console.log("error");
      }
    );
  }

  public getEficiency() {
    this.provedor.getEficiency().then(
      data => {
        this.datos = data;

        if (this.datos.length > 0) {
          this.idcuarta = this.datos[0].tipocuartapantalla;

          this.top = JSON.stringify(this.datos[0].top * 100) + "%";
          this.posicion = "#" + JSON.stringify(this.datos[0].Lugar);

          this.clientes = this.datos[0].avg_HorasAtencion_5.toFixed();
          this.clientes2 = this.datos[0].avg_HorasAtencionTotal.toFixed();

          this.fiveprogress = JSON.stringify(this.datos[0].pAtendidos_5 * 100);
          this.thirtyprogress = JSON.stringify(
            this.datos[0].pAtendidos_2hrs * 100
          );

          this.empresa_tiempo = this.datos[0].avg_HorasAtencion.toFixed();
          this.empresa_atendidos =
            JSON.stringify(this.datos[0].pAtendidos.toFixed(2) * 100) + "%";
          this.empresa_acciones =
            JSON.stringify(this.datos[0].pContestaAccionesK.toFixed(2) * 100) +
            "%";
          this.empresa_negociacion = this.datos[0].TiempoNegociacion;
          this.empresa_contacto = this.datos[0].IntentosNoEx.toFixed(2);
          if (this.idcuarta) {
            this.getEficiencyType(this.idcuarta);
            this.getWordsType(this.idcuarta);
          } else {
            this.empresas_tiempo = "N/A";
            this.empresas_atendidos = "N/A";
            this.empresas_acciones = "N/A";
            this.empresas_negociacion = "N/A";
            this.empresas_contacto = "N/A";
          }
        }
        console.log(this.datos);
      },
      err => {
        console.log("error");
        this.empresas_tiempo = "N/A";
        this.empresas_atendidos = "N/A";
        this.empresas_acciones = "N/A";
        this.empresas_negociacion = "N/A";
        this.empresas_contacto = "N/A";
      }
    );
  }

  public getEficiencyType(tipocuarta) {
    this.provedor.getEficiencyType(tipocuarta).then(
      data => {
        this.datos = data;
        if (this.datos.length > 0) {
          console.log(this.datos);
          this.empresas_tiempo = this.datos[0].avg_HorasAtencion.toFixed();
          this.empresas_atendidos =
            JSON.stringify(this.datos[0].pAtendidos.toFixed(2) * 100) + "%";
          this.empresas_acciones =
            JSON.stringify(this.datos[0].pContestaAccionesK.toFixed(2) * 100) +
            "%";
          this.empresas_negociacion = this.datos[0].TiempoNegociacion;
          this.empresas_contacto = this.datos[0].IntentosNoEx.toFixed(2);
        } else {
          this.empresas_tiempo = "N/A";
          this.empresas_atendidos = "N/A";
          this.empresas_acciones = "N/A";
          this.empresas_negociacion = "N/A";
          this.empresas_contacto = "N/A";
        }
      },
      err => {
        console.log("error");
      }
    );
  }

  public getWords() {
    this.provedor.getWords().then(
      data => {
        this.datos = data;
        if (this.datos.length > 0) {
          this.palabrasempresa = this.datos;
        }
      },
      err => {
        console.log("error");
      }
    );
  }

  public getWordsType(tipocuarta) {
    this.provedor.getWordsType(tipocuarta).then(
      data => {
        this.datos = data;
        if (this.datos.length > 0) {
          this.palabrasempresas = this.datos;
        }
      },
      err => {
        console.log("error");
      }
    );
  }

  public getEficiencyRanking() {
    this.provedor.getEficiencyRanking().then(
      data => {
        this.datos = data;
        console.log(this.datos);
      },
      err => {
        console.log("error");
      }
    );
  }

  public getTopTen() {
    this.provedor.getTopTen().then(
      data => {
        this.datos = data;
        this.ganadores = this.datos;
        console.log(this.datos);
      },
      err => {
        console.log("error");
      }
    );
  }
}
