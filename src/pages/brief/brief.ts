import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';


@IonicPage({ name: 'brief', segment: 'brief-1/:param' })
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage implements OnInit {

  titulo: string;
  briefPage = BriefPage;
  leads;
  estado;
  meses;
  dias;
  tabla;
  device;
  gender;
  leadsr;
  public age;
  public age0;
  public age1;
  public age2;
  public age3;
  public age4;
  public computadora;
  public smartphone;
  public tablet;
  public hombre;
  public mujer;
  public datagraph: any;

  //función de la primera gráfica
  public columnChartData = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      pointSize: 5,
      legend: 'none',
      hAxis: {
        minvalue: 0,
        format: 0,
        gridlines: {
          count: 1
        }
      },
      vAxis: {

      },
      colors: ['#10cebc']
    }
  };

  //función de la segunda gráfica
  public geoChartData = {
    chartType: 'GeoChart',
    dataTable: [],
    options: {
      region: 'MX',
      resolution: 'provinces',
      legend: 'none',
      colorAxis: { colors: ['#10cebc', '#165a88'] }
    }
  };

  //función de la tercera gráfica
  public lineChartData = {
    chartType: 'LineChart',
    dataTable: [],
    options: {
      width: '100%',
      height: '100%',
      pointSize: 5,
      legend: 'none',
      hAxis: {
        minvalue: 0,
        format: 0,
        gridlines: {
          count: 1
        }
      },
      vAxis: {
        minvalue: 0,
        maxvalue: 2,
        gridlines: {
          count: 3
        },
        format: 0
      },
      colors: ['#10cebc']
    }
  };

  //función de la minitabla
  public tableChartData = {
    chartType: 'Table',
    dataTable: [],
    options: {
      title: 'Countries',
      allowHtml: true
    }
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider) {
  }

  ngOnInit() {
    this.titulo = this.navParams.get('numero');
    this.getLeadsMapa();
    this.getLeadsMeses();
    this.getLeadsDias();
    this.getLeadsTabla();
    this.getFacebookAge();
    this.getFacebookGender();
    this.getFacebookDevice();
    this.getLeadsReport();

  }



  //Llena la grafica de columnas (primer grafico)
  public getLeadsMeses() {
    this.provedor.getLeadsMeses()
      .then(
      (data) => {

        let dictionary = new Object();

        dictionary["January"] = "ENE";
        dictionary["February"] = "FEB";
        dictionary["March"] = "MAR";
        dictionary["April"] = "ABR";
        dictionary["May"] = "MAY";
        dictionary["June"] = "JUN";
        dictionary["July"] = "JUL";
        dictionary["August"] = "AGO";
        dictionary["September"] = "SEP";
        dictionary["October"] = "OCT";
        dictionary["November"] = "NOV";
        dictionary["December"] = "DIC";

        let dictionary2 = new Object();

        dictionary2["January"] = "0";
        dictionary2["February"] = "1";
        dictionary2["March"] = "2";
        dictionary2["April"] = "3";
        dictionary2["May"] = "4";
        dictionary2["June"] = "5";
        dictionary2["July"] = "6";
        dictionary2["August"] = "7";
        dictionary2["September"] = "8";
        dictionary2["October"] = "9";
        dictionary2["November"] = "10";
        dictionary2["December"] = "11";

        let dictionary3 = new Object();

        dictionary3["0"] = "ENE";
        dictionary3["1"] = "FEB";
        dictionary3["2"] = "MAR";
        dictionary3["3"] = "ABR";
        dictionary3["4"] = "MAY";
        dictionary3["5"] = "JUN";
        dictionary3["6"] = "JUL";
        dictionary3["7"] = "AGO";
        dictionary3["8"] = "SEP";
        dictionary3["9"] = "OCT";
        dictionary3["10"] = "NOV";
        dictionary3["11"] = "DIC";

        let outter = [];
        this.meses = data;

        if (this.meses.length > 0) {
          let dt = new Date(this.meses[0].fechaReporte);
          dt.setDate(1);

          outter.push(['Mes', 'Leads', { "role": "style" }]);

          let intAux = 0;
          let max = 0;

          for (let i = 1; i <= 12; i++) {
            dt.setMonth(dt.getMonth() + 1);
            let inner = [];
            inner.push(dictionary3[dt.getMonth()]);
            //inner.push(5);
            if (this.meses.length > intAux) {
              if (dt.getMonth() == dictionary2[this.meses[intAux].MES]) {
                inner.push(this.meses[intAux].LEADS);

                if (this.meses[intAux].LEADS > max) {
                  max = this.meses[intAux].LEADS;
                }

                intAux++;
              } else {
                inner.push(0);
              }
            } else {
              inner.push(0);
            }
            inner.push("#00A6d4");
            outter.push(inner);
          }

          if (this.meses[0].fechaReporte == this.meses[0].hoy) {
            let dt2 = new Date(this.meses[0].fechaReporte);
            let diastranscurridos = dt2.getDate()
            let estimado = Math.ceil((outter[outter.length - 1][1] / diastranscurridos) * 31)
            let inner = [];
            inner.push("ESTIM");
            inner.push(estimado);
            inner.push("#10cebc");
            outter.push(inner);
          }
          this.columnChartData.dataTable = outter
        }
      },

      /* outter.push(['Mes','Leads', {"role": "style"}]);
       for(let i=0 ; i < this.meses.length ; i++){
         let inner = [];
         inner.push(this.meses[i].MES);
         inner.push(this.meses[i].LEADS);
         inner.push("#00A6d4");
         outter.push(inner);
       }
       this.columnChartData.dataTable = outter
        console.log(this.datagraph);
     },*/
      (error) => {
        console.log(error);
      });
  }

  //Llena el mapa de estados (2do grafico)
  public getLeadsMapa() {
    this.provedor.getLeadsMapa()
      .then(
      (data) => {

        let outter = [];
        this.estado = data;
        outter.push(['Estado', 'Leads']);
        for (let i = 0; i < this.estado.length; i++) {
          let inner = [];
          inner.push(this.estado[i].nombre);
          inner.push(this.estado[i].leads);
          outter.push(inner);
        }
        this.geoChartData.dataTable = outter
      },
      (error) => {
        console.log(error);
      });
  }
  //Llena la minitabla de estados (3er grafico)

  public getLeadsTabla() {
    this.provedor.getLeadsMapa()
      .then(
      (data) => {
        var dictionary = new Object();

        dictionary["AGS."] = "Aguascalientes";
        dictionary["B.C."] = "Baja California";
        dictionary["B.C.S."] = "Baja California Sur";
        dictionary["CAMP."] = "Campeche";
        dictionary["CHIS."] = "Chiapas";
        dictionary["CHIH."] = "Chihuahua";
        dictionary["CDMX"] = "CDMX";
        dictionary["COAH."] = "Coahuila";
        dictionary["COL."] = "Colima";
        dictionary["DGO"] = "Durango";
        dictionary["GTO."] = "Guanajuato";
        dictionary["GRO."] = "Guerrero";
        dictionary["HGO."] = "Hidalgo";
        dictionary["JAL."] = "Jalisco";
        dictionary["MEX."] = "Edo. de México";
        dictionary["MICH."] = "Michoacán";
        dictionary["MOR."] = "Morelos";
        dictionary["NAY."] = "Nayarit";
        dictionary["N.L."] = "Nuevo León";
        dictionary["OAX."] = "Oaxaca";
        dictionary["PUE."] = "Puebla";
        dictionary["QRO."] = "Querétaro";
        dictionary["Q.R."] = "Quintana Roo";
        dictionary["S.L.P."] = "San Luis Potosí";
        dictionary["SIN."] = "Sinaloa";
        dictionary["SON."] = "Sonora";
        dictionary["TAB."] = "Tabasco";
        dictionary["TAMPS."] = "Tamaulipas";
        dictionary["TLAX."] = "Tlaxcala";
        dictionary["VER."] = "Veracruz";
        dictionary["YUC."] = "Yucatán";
        dictionary["ZAC."] = "Zacatecas";

        let outter = [];
        this.tabla = data;
        outter.push(['Estado', 'Leads']);
        let i = 1;

        for (let k in this.tabla) {
          if (i <= 5) {
            var inner = [];
            inner.push(dictionary[this.tabla[k]['abreviacion']]);
            inner.push(this.tabla[k]['leads']);
            outter.push(inner);
          }
          i++;
        }
        this.tableChartData.dataTable = outter
      },
      (error) => {
        console.log(error);
      });
  }
  //Llena la grafica de puntos (4to grafico)
  public getLeadsDias() {
    this.provedor.getLeadsDias()
      .then(
      (data) => {
        let outter = [];
        this.dias = data;
        outter.push(['Día', 'Leads']);
        let max = 0;

        for (let k in this.dias) {
          let inner = [];
          this.dias[k]['Date'] = this.dias[k]['Date'].substring(8, 10) + this.dias[k]['Date'].substring(4, 7)
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-01', '-Ene');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-02', '-Feb');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-03', '-Mar');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-04', '-Abr');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-05', '-May');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-06', '-Jun');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-07', '-Jul');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-08', '-Ago');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-09', '-Sep');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-10', '-Oct');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-11', '-Nov');
          this.dias[k]['Date'] = this.dias[k]['Date'].replace('-12', '-Dic');
          inner.push(this.dias[k]['Date']);
          if (this.dias[k]['DOWNLOADCOUNT'] > max) {
            max = this.dias[k]['DOWNLOADCOUNT'];
          }
          inner.push(this.dias[k]['DOWNLOADCOUNT']);
          outter.push(inner);
        }
        this.lineChartData.dataTable = outter
      },
      (error) => {
        console.log(error);
      });
  }

  public getFacebookAge() {
    this.provedor.getFacebookAge()
      .then(
      (data) => {
        this.age = data;
        let total = Number(this.age[0].clicks) + Number(this.age[1].clicks) + Number(this.age[2].clicks) + Number(this.age[3].clicks) + Number(this.age[4].clicks);
        this.age0 = Math.round((this.age[0].clicks / total) * 100);
        this.age1 = Math.round((this.age[1].clicks / total) * 100);
        this.age2 = Math.round((this.age[2].clicks / total) * 100);
        this.age3 = Math.round((this.age[3].clicks / total) * 100);
        this.age4 = Math.round((this.age[4].clicks / total) * 100);
       /* age0 = Math.trunc((this.age[0].clicks / total) * 100);
        console.log(age0);
       if (age0 > 0) {
          if (age0 < 30) {
            age0p = "20"
          } else {
            if (age0 < 50) {
              age0p = "40"
            } else {
              if (age0 < 70) {
                age0p = "60"
              } else {
                if (age0 < 100) {
                  age0p = "80"
                } else {
                  age0p = "100"
                }
              }
            }
          }
        }*/
     /*    age1 = Math.trunc((this.age[1].clicks / total) * 100);
         if (age1 > 0) {
          if (age1 < 30) {
            age1p = "20"
          } else {
            if (age1 < 50) {
              age1p = "40"
            } else {
              if (age1 < 70) {
                age1p = "60"
              } else {
                if (age1 < 100) {
                  age1p = "80"
                } else {
                  age1p = "100"
                }
              }
            }
          }
        }*/
     /*    age2 = Math.trunc((this.age[2].clicks / total) * 100)
         if (age2 > 0) {
          if (age2 < 30) {
            age2p = "20"
          } else {
            if (age2 < 50) {
              age2p = "40"
            } else {
              if (age2 < 70) {
                age2p = "60"
              } else {
                if (age2 < 100) {
                  age2p = "80"
                } else {
                  age2p = "100"
                }
              }
            }
          }
        }*/
     /*    age3 = Math.trunc((this.age[3].clicks / total) * 100);
           if (age3 > 0) {
          if (age3 < 30) {
            age3p = "20"
          } else {
            if (age3 < 50) {
              age3p = "40"
            } else {
              if (age3 < 70) {
                age3p = "60"
              } else {
                if (age3 < 100) {
                  age3p = "80"
                } else {
                  age3p = "100"
                }
              }
            }
          }
        }*/
      /*   age4 = Math.trunc((this.age[4].clicks / total) * 100)
           if (age4 > 0) {
          if (age4 < 30) {
            age4p = "20"
          } else {
            if (age4 < 50) {
              age4p = "40"
            } else {
              if (age4 < 70) {
                age4p = "60"
              } else {
                if (age4 < 100) {
                  age4p = "80"
                } else {
                  age4p = "100"
                }
              }
            }
          }
        }
      }*/},
      (error) => {
        console.log(error);
      });
  }

  public getFacebookDevice() {
    this.provedor.getFacebookDevice()
      .then(
      (data) => {
        this.device = data;
        let total = 0;
        let cel = 0;
        let escritorio = 0;
        let otros = 0;
        for (var k in this.device) {
          total = total + Number(this.device[k].clicks);
          if (this.device[k].impression_device == "android_smartphone" || this.device[k].impression_device == "iphone") {
            cel = cel + +Number(this.device[k].clicks);
          } else {
            if (this.device[k].impression_device == "desktop") {
              escritorio = escritorio + Number(this.device[k].clicks);
            } else {
              otros = otros + Number(this.device[k].clicks);
            }
          }
        }
        this.computadora = Math.round((escritorio / total) * 100);
        this.smartphone = Math.round((cel / total) * 100)
        this.tablet = Math.round((otros / total) * 100)
      },
      (error) => {
        console.log(error);
      });
  }

  public getFacebookGender() {
    this.provedor.getFacebookGender()
      .then(
      (data) => {
        this.gender = data;
        let total = Number(this.gender[0].clicks) + Number(this.gender[1].clicks) + Number(this.gender[2].clicks);
        this.mujer = Math.round((this.gender[0].clicks / total) * 100);
        this.hombre = Math.round((this.gender[1].clicks / total) * 100)
      },
      (error) => {
        console.log(error);
      });
  }

  public getLeadsReport() {
    this.provedor.getLeadsReport()
      .then(
      (data) => {
        this.leadsr = data;
        console.log(this.leadsr);
      },
      (error) => {
        console.log(error);
      });
  }

  ionViewDidLoad() {
    //console.log(this.datagraph);
  }

  goBack(): void {
    this.navCtrl.pop();
  }

}
