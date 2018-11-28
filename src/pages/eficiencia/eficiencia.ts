import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController
} from "ionic-angular";
import { RestProvider } from "../../providers/rest/rest";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

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
  public hola: number = 0;
  public idcuarta;
  clientes: any = 0;
  clientes2: any = 0;
  clientesrep: number = 0;
  clientes2rep: number = 0;

  public empresa;
  public id;
  public clientUUID = this.authService.getClientUUID();
  public empresa_tiempo;
  public empresas_tiempo;
  public empresa_atendidos = "N/A";
  public empresas_atendidos = "N/A";
  public empresa_acciones = "N/A";
  public empresas_acciones = "N/A";
  public cempresa_atendidos: number = 0;
  public cempresas_atendidos: number = 0;
  public cempresa_acciones: number = 0;
  public cempresas_acciones: number = 0;
  public empresa_negociacion = "N/A";
  public empresas_negociacion = "N/A";
  public empresa_contacto = "N/A";
  public empresas_contacto = "N/A";
  public ganadores;
  public month = new Date();
  public year = new Date();
  public years = this.year.getFullYear();
  public mes:any = this.month.getMonth();
  public months;
  monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
  public bar_ChartData: any = {
    chartType: "BarChart",
    dataTable: [],
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
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    }
  ];
  public palabrasempresas = [
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
    },
    {
      palabra: "Sin info"
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
    if(this.mes > 0 && this.mes < 12) {
      this.months = this.monthNames[this.mes];
    }
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

  openTipVenta(tip, variable) {
    if (tip === "tip1") {
      if (variable == false) {
        this.tip1 = true;
        this.tip2 = false;
        this.tip3 = false;
      } else {
        this.tip1 = false;
        this.tip2 = false;
        this.tip3 = false;
      }
    } else if (tip === "tip2") {
      if (variable == false) {
        this.tip1 = false;
        this.tip2 = true;
        this.tip3 = false;
      } else {
        this.tip1 = false;
        this.tip2 = false;
        this.tip3 = false;
      }
    } else if (tip === "tip3") {
      if (variable == false) {
        this.tip1 = false;
        this.tip2 = false;
        this.tip3 = true;
      } else {
        this.tip1 = false;
        this.tip2 = false;
        this.tip3 = false;
      }
    }
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

          this.clientesrep = this.datos[0].avg_HorasAtencion_5 * 60;
          this.clientes2rep = this.datos[0].avg_HorasAtencionTotal * 60;

          this.clientes = this.clientesrep.toFixed();
          this.clientes2 = this.clientes2rep.toFixed();
          console.log(this.clientes,this.clientes2);

          this.fiveprogress = JSON.stringify(this.datos[0].pAtendidos_5 * 100);
          this.thirtyprogress = JSON.stringify(
            this.datos[0].pAtendidos_2hrs * 100
          );

          this.empresa_tiempo = this.datos[0].avg_HorasAtencion * 60;
          this.empresa_tiempo = this.empresa_tiempo.toFixed()
          this.empresa_atendidos =
            JSON.stringify(this.datos[0].pAtendidos.toFixed(2) * 100) + "%";
          this.empresa_acciones =
            JSON.stringify(this.datos[0].pContestaAccionesK.toFixed(2) * 100) +
            "%";
          this.cempresa_atendidos = this.datos[0].pAtendidos.toFixed(2) * 100;
          this.cempresa_acciones =
            this.datos[0].pContestaAccionesK.toFixed(2) * 100;
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
       //  console.log(this.datos);
      },
      err => {
      //   console.log("error");
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
       //    console.log(this.datos);
          this.empresas_tiempo = this.datos[0].avg_HorasAtencion * 60;
          this.empresas_tiempo = this.empresas_tiempo.toFixed()
          this.empresas_atendidos = JSON.stringify(this.datos[0].pAtendidos.toFixed(2) * 100) + "%";
          this.empresas_acciones = JSON.stringify(this.datos[0].pContestaAccionesK.toFixed(2) * 100) +
            "%";
          this.cempresas_atendidos = this.datos[0].pAtendidos.toFixed(2) * 100;
          this.cempresas_acciones =
            this.datos[0].pContestaAccionesK.toFixed(2) * 100;
          this.empresas_negociacion = this.datos[0].TiempoNegociacion;
          this.empresas_contacto = this.datos[0].IntentosNoEx.toFixed(1);
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
        let lugar = [ { posicion: "1" }, { posicion: "100" }, { posicion: "200" }, { posicion: "300" },{ posicion: "400" }, { posicion: "500" },{ posicion: "600" }, { posicion: "700" },{ posicion: "800" }, { posicion: "900" },  { posicion: "+1000" }, ]
        let outter = [];
        outter.push(['Posición', 'Leads', { "role": "style" }]);
          for (let i = 0; i < this.datos.length; i++) {
            let inner = [];
            inner.push(lugar[i].posicion);
            inner.push(this.datos[i].CierredeVenta);
            if(this.datos[i].Clientes == 1){
              inner.push("#f5a623");
            }else {
              inner.push("#3DCDBB");
            }
            outter.push(inner);
          }

          this.bar_ChartData = {
            chartType: "BarChart",
            dataTable: outter,
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
        // console.log(this.datos);
      },
      err => {
        console.log("error");
      }
    );
  }

}
