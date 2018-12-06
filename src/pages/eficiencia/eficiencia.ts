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

  public tip1_id;
  public tip2_id;
  public tip3_id;
  public tip1_titulo;
  public tip2_titulo;
  public tip3_titulo;
  public tip1_descripcion;
  public tip2_descripcion;
  public tip3_descripcion;

  public place = '#1';
  public leads;

  public yourplace;
  public yourleads;

  public top = "N/A";
  public posicion = "N/A";

  public fiveprogress:any = "0";
  public thirtyprogress:any = "0";

  public fiveprogressbar = "0";
  public thirtyprogressbar = "0";
  public hola: any = 0;
  public idcuarta;
  clientes: any = 0;
  clientes2: any = 0;
  clientesrep: any = 0;
  clientes2rep: any = 0;

  public empresa;
  public id;
  public clientUUID = this.authService.getClientUUID();
  public empresa_tiempo;
  public empresas_tiempo;
  public empresa_atendidos:any = 0;
  public empresas_atendidos:any = 0;
  public empresa_acciones:any = 0;
  public empresas_acciones:any = 0;
  public cempresa_atendidos: any = 0;
  public cempresas_atendidos: any = 0;
  public cempresa_acciones: any = 0;
  public cempresas_acciones: any = 0;
  public empresa_negociacion:any = "N/A";
  public empresas_negociacion:any = "N/A";
  public empresa_contacto:any = "N/A";
  public empresas_contacto:any = "N/A";
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
      enableInteractivity: false,
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
        title: "Ranking",
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
    this.getWords();
    this.getTopTen();
    setTimeout(()=>{
      this.getEficiencyRanking();
    }, 300);
    ;
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

          this.yourleads = this.datos[0].Exitosos;
          this.top = JSON.stringify(this.datos[0].top * 100) + "%";
          this.yourplace = JSON.stringify(this.datos[0].Lugar);
          this.posicion = "#" + this.yourplace;
          this.clientesrep = this.datos[0].avg_HorasAtencion_5 * 60;
          this.clientes2rep = this.datos[0].avg_HorasAtencionTotal * 60;

          this.clientes = this.clientesrep.toFixed();
          this.clientes2 = this.clientes2rep.toFixed();
          console.log(typeof(this.clientesrep));
          this.fiveprogress = this.datos[0].pAtendidos_5;
          this.thirtyprogress = this.datos[0].pAtendidos_2hrs;

          this.fiveprogressbar = JSON.stringify(this.datos[0].pAtendidos_5 * 100);
          this.thirtyprogressbar = JSON.stringify(this.datos[0].pAtendidos_2hrs * 100);

          this.empresa_tiempo = this.datos[0].avg_HorasAtencion * 60;
          this.empresa_tiempo = this.empresa_tiempo.toFixed();

          if(this.empresa_tiempo == null){
            this.empresa_tiempo = "N/A";
          }

          this.empresa_atendidos =  this.datos[0].pAtendidos.toFixed(2);

          if(this.empresa_atendidos == null){
            this.empresa_atendidos = 0;
          }

          this.empresa_acciones =  this.datos[0].pContestaAccionesK.toFixed(2);

          if(this.empresa_acciones == null){
            this.empresa_acciones = 0;
          }

          this.cempresa_atendidos = this.datos[0].pAtendidos.toFixed(2) * 100;

          if(this.cempresa_atendidos == null){
            this.cempresa_atendidos = "N/A";
          }

          this.cempresa_acciones = this.datos[0].pContestaAccionesK.toFixed(2) * 100;

          if(this.cempresa_acciones == null){
            this.cempresa_acciones = "N/A";
          }

          this.empresa_negociacion = this.datos[0].TiempoNegociacion;

          if(this.empresa_negociacion == null){
            this.empresa_negociacion = "N/A";
          }

          this.empresa_contacto = this.datos[0].IntentosNoEx.toFixed(1);

          if(this.empresa_contacto == null){
            this.empresa_contacto = "N/A";
          }

          this.getTips(this.datos[0].tip1, this.datos[0].tip2, this.datos[0].tip3);

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
          this.empresas_tiempo = this.datos[0].avg_HorasAtencion * 60 ;
          this.empresas_tiempo = this.empresas_tiempo.toFixed();
          this.empresas_atendidos = this.datos[0].pAtendidos.toFixed(2);
          this.empresas_acciones = this.datos[0].pContestaAccionesK.toFixed(2);
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
        if (data) {
          this.datos = data;
          const lugar = [
            { posicion: '1' },
            { posicion: '100' },
            { posicion: '200' },
            { posicion: '300' },
            { posicion: '400' },
            { posicion: '500' },
            { posicion: '600' },
            { posicion: '700' },
            { posicion: '800' },
            { posicion: '900' },
            { posicion: '+1000' }
          ];
          const lugar2 = [
            { posicion: '0' },
            { posicion: '2' },
            { posicion: '101' },
            { posicion: '201' },
            { posicion: '301' },
            { posicion: '401' },
            { posicion: '501' },
            { posicion: '601' },
            { posicion: '701' },
            { posicion: '801' },
            { posicion: '901' }
          ];

          this.leads = this.datos[0].CierredeVenta.toFixed(2);
          let outter = [];
          outter.push(['Posición', 'Leads', { role: 'style' }]);
          for (let i = 0; i < this.datos.length; i++) {
            let inner = [];
            inner.push(lugar[i].posicion);
            inner.push(this.datos[i].CierredeVenta);

            const inicio = parseInt(lugar[i].posicion);
            const fin = parseInt(lugar2[i].posicion);

            if (this.yourplace <= inicio && this.yourplace >= fin) {
              inner.push('#288AC1');
            } else if (this.datos[i].Clientes === 1) {
              inner.push('#f5a623');
            } else {
              inner.push('#3DCDBB');
            }
            outter.push(inner);
          }

          this.bar_ChartData = {
            chartType: 'BarChart',
            dataTable: outter,
            options: {
              tooltip: { isHtml: true },
              chartArea: { width: '75%', heigth: '100%' },
              legend: { position: 'none' },
              bars: 'horizontal',
              is3D: true,
              enableInteractivity: false,

              hAxis: {
                title: 'Leads en cierre de venta',
                textStyle: {
                  color: '#288AC1',
                  fontSize: 8,
                  fontName: 'Arial',
                  italic: true
                },
                titleTextStyle: {
                  color: '#288AC1',
                  fontSize: 10,
                  fontName: 'Arial',
                  bold: true,
                  italic: true
                }
              },
              vAxis: {
                title: 'Ranking',
                textStyle: {
                  color: '#288AC1',
                  fontSize: 8,
                  fontName: 'Arial',
                  italic: true
                },
                titleTextStyle: {
                  color: '#288AC1',
                  fontSize: 10,
                  fontName: 'Arial',
                  bold: true,
                  italic: true
                }
              },
              bar: { groupWidth: '60%' }
            }
          };
        }
      },
      err => {
        console.log('error');
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

  public getTips(idtip1, idtip2, idtip3) {
    this.provedor.getTips(idtip1, idtip2, idtip3).then(
      data => {
        this.datos = data;
        console.log(this.datos);
        this.tip1_id = this.datos[0].TipId;
        this.tip2_id = this.datos[1].TipId;
        this.tip3_id = this.datos[2].TipId;
        this.tip1_titulo = this.datos[0].Title;
        this.tip2_titulo = this.datos[1].Title;
        this.tip3_titulo = this.datos[2].Title;
        this.tip1_descripcion = this.datos[0].Description;
        this.tip2_descripcion = this.datos[1].Description;
        this.tip3_descripcion = this.datos[2].Description;
      },
      err => {
        console.log('error');
      }
    );
  }

  public getInsertClickTips(idtip) {
    console.log(idtip);
    const usuario = this.id;
    const tipid = idtip;
    const acceso = 'App';
    //  console.log(usuario, pagina, acceso);
    this.provedor.getInsertClickTip(usuario, tipid, acceso).then(
      data => {
        this.datosenvio = data;
      },
      err => {
        console.log('error');
      }
    );
  }

}
