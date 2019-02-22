import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage({ name: 'reporte', segment: 'reporte-1/:param' })
@Component({
  selector: 'page-reporte',
  templateUrl: 'reporte.html',
})
export class ReportePage implements OnInit {

  titulo: string;
  reportepage = ReportePage;
  leads;
  estado;
  meses;
  dias;
  tabla;
  device;
  gender;
  leadsr;
  costo;
  likes;
  total;
  rated;
  dislike;
  like;
  monto;
  montoTotal;
  diasPagados;
  diasRegalados;
  diasTotales;
  today;
  inicio;
  datosenvio;
  diasTranscurridos;
  calificacion;
  public costoFinal = '$0';
  public result;
  public calif;
  public share;
  public age;
  public age0 = 0;
  public age1 = 0;
  public age2 = 0;
  public age3 = 0;
  public age4 = 0;
  public age0p = '0';
  public age1p = '0';
  public age2p = '0';
  public age3p = '0';
  public age4p = '0';
  public computadora = 0;
  public smartphone = 0;
  public tablet = 0;
  public hombre = 0;
  public mujer = 0;
  public hombrep = '0';
  public mujerp = '0';
  public datagraph: any;
  public empresa;
  public id;
  public exitoso;
  public resultexito;
  public app;
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
    dataTable: [['Mes', 'Leads', { "role": "style" }], ["", 0, ""]],
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
              public provedor: RestProvider,
              public authService: AuthServiceProvider) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
    this.app = this.provedor.app;
    // // console.log(this.app);
    if (this.app === 1) {
      this.app = 'Si';
    } else {
      this.app = 'No';
    }
  }

  ngOnInit() {
    this.titulo = this.navParams.get('numero');
    this.titulo = this.navParams.get('numero');

    this.columnChartData.dataTable = [["Mes", "Leads", { "role": "style" }],
      ["ABR", 0, "#00A6D4"],
      ["MAY", 0, "#00A6D4"],
      ["JUN", 0, "#00A6D4"],
      ["JUL", 0, "#00A6D4"],
      ["AGO", 0, "#00A6D4"],
      ["SEP", 0, "#00A6D4"],
      ["OCT", 0, "#00A6D4"],
      ["NOV", 0, "#00A6D4"],
      ["DIC", 0, "#00A6D4"],
      ["ENE", 0, "#00A6D4"],
      ["FEB", 0, "#00A6D4"],
      ["MAR", 0, "#00A6D4"]];

    const arregloEstados = [["Estado", "Leads"],
      ["Aguascalientes", 0],
      ["Baja California", 0],
      ["Baja California Sur", 0],
      ["Campeche", 0],
      ["Chiapas", 0],
      ["Chihuahua", 0],
      ["Distrito Federal", 0],
      ["Coahuila", 0],
      ["Colima", 0],
      ["Durango", 0],
      ["Guanajuato", 0],
      ["Guerrero", 0],
      ["Hidalgo", 0],
      ["Jalisco", 0],
      ["Estado de México", 0],
      ["Michoacán", 0],
      ["Morelos", 0],
      ["Nayarit", 0],
      ["Nuevo León", 0],
      ["Oaxaca", 0],
      ["Puebla", 0],
      ["Querétaro", 0],
      ["Quintana Roo", 0],
      ["San Luis Potosí", 0],
      ["Sinaloa", 0],
      ["Sonora", 0],
      ["Tabasco", 0],
      ["Tamaulipas", 0],
      ["Tlaxcala", 0],
      ["Veracruz", 0],
      ["Yucatán", 0],
      ["Zacatecas", 0]
    ];

    this.tableChartData.dataTable = arregloEstados;
    this.geoChartData.dataTable = arregloEstados;
    this.getInsertClickPagina();
    this.getLeadsMapa();
    this.getLeadsMeses();
    this.getLeadsDias();
    this.getLeadsTabla();
    this.getFacebookAge();
    this.getFacebookGender();
    this.getFacebookDevice();
    this.getLeadsReport();
    this.getLikeDias();
    this.getCostoCampania();
    this.getDiasRestantes();
    this.getObtieneContactoSexCte();
  }

  //Llena la grafica de columnas (primer grafico)
  public getLeadsMeses() {

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

    this.provedor.getLeadsMeses()
      .then(data => {
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

          this.columnChartData = {
            chartType: 'ColumnChart',
            dataTable: outter,
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
              vAxis: {},
              colors: ['#10cebc']
            }
          };
        }
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

            if (this.estado[i].nombre === 'Mexico') {

              inner.push('Estado de México');
              inner.push(this.estado[i].leads);
            } else if (this.estado[i].nombre === 'San Luis Potosi') {

              inner.push('San Luis Potosí');
              inner.push(this.estado[i].leads);

            } else if (this.estado[i].nombre === 'Ciudad de México') {

              inner.push('Distrito Federal');
              inner.push(this.estado[i].leads);

            } else if (this.estado[i].nombre === 'Veracruz-Llave') {

              inner.push('Veracruz');
              inner.push(this.estado[i].leads);

            } else if (this.estado[i].nombre === 'Queretaro de Arteaga') {

              inner.push('Querétaro');
              inner.push(this.estado[i].leads);

            } else {

              inner.push(this.estado[i].nombre);
              inner.push(this.estado[i].leads);

            }

            outter.push(inner);
          }

          this.geoChartData = {
            chartType: 'GeoChart',
            dataTable: outter,
            options: {
              region: 'MX',
              resolution: 'provinces',
              legend: 'none',
              colorAxis: { colors: ['#10cebc', '#165a88'] }
            }
          };

        },
        (error) => {
          // console.log(error);
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
          dictionary["CDMX"] = "Distrito Federal";
          dictionary["COAH."] = "Coahuila";
          dictionary["COL."] = "Colima";
          dictionary["DGO"] = "Durango";
          dictionary["GTO."] = "Guanajuato";
          dictionary["GRO."] = "Guerrero";
          dictionary["HGO."] = "Hidalgo";
          dictionary["JAL."] = "Jalisco";
          dictionary["MEX."] = "Estado de México";
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



          this.tableChartData = {
            chartType: 'Table',
            dataTable: outter,
            options: {
              title: 'Countries',
              allowHtml: true
            }
          };
        },
        (error) => {
          // console.log(error);
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
          this.lineChartData = {
            chartType: 'LineChart',
            dataTable: outter,
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
        },
        (error) => {
          // console.log(error);
        });
  }

  public getFacebookAge() {
    this.provedor.getFacebookAge()
      .then(
        (data) => {
          this.age = data;
          if (data) {
            let total = Number(this.age[0].clicks) + Number(this.age[1].clicks) + Number(this.age[2].clicks) + Number(this.age[3].clicks) + Number(this.age[4].clicks);
            this.age0 = Math.round((this.age[0].clicks / total) * 100);
            this.age1 = Math.round((this.age[1].clicks / total) * 100);
            this.age2 = Math.round((this.age[2].clicks / total) * 100);
            this.age3 = Math.round((this.age[3].clicks / total) * 100);
            this.age4 = Math.round((this.age[4].clicks / total) * 100);
            // // console.log(this.age0);
            if (this.age0 < 10) {
              this.age0p = "0"
            } else if (this.age0 < 30) {
              this.age0p = "20"
            } else if (this.age0 < 50) {
              this.age0p = "40"
            } else if (this.age0 < 70) {
              this.age0p = "60"
            } else if (this.age0 < 100) {
              this.age0p = "80"
            } else {
              this.age0p = "100"
            }

            if (this.age1 < 10) {
              this.age1p = "0"
            } else if (this.age1 < 30) {
              this.age1p = "20"
            } else if (this.age1 < 50) {
              this.age1p = "40"
            } else if (this.age1 < 70) {
              this.age1p = "60"
            } else if (this.age1 < 100) {
              this.age1p = "80"
            } else {
              this.age1p = "100"
            }

            if (this.age2 < 10) {
              this.age2p = "0"
            } else if (this.age2 < 30) {
              this.age2p = "20"
            } else if (this.age2 < 50) {
              this.age2p = "40"
            } else if (this.age2 < 70) {
              this.age2p = "60"
            } else if (this.age2 < 100) {
              this.age2p = "80"
            } else {
              this.age2p = "100"
            }

            if (this.age3 < 10) {
              this.age3p = "0"
            } else if (this.age3 < 30) {
              this.age3p = "20"
            } else if (this.age3 < 50) {
              this.age3p = "40"
            } else if (this.age3 < 70) {
              this.age3p = "60"
            } else if (this.age3 < 100) {
              this.age3p = "80"
            } else {
              this.age3p = "100"
            }

            if (this.age4 < 10) {
              this.age4p = "0"
            } else if (this.age4 < 30) {
              this.age4p = "20"
            } else if (this.age4 < 50) {
              this.age4p = "40"
            } else if (this.age4 < 70) {
              this.age4p = "60"
            } else if (this.age4 < 100) {
              this.age4p = "80"
            } else {
              this.age4p = "100"
            }
          }
        },
        (error) => {
          // console.log(error);
        });
  }

  public getFacebookDevice() {
    this.provedor.getFacebookDevice()
      .then(
        (data) => {
          this.device = data;
          if (data) {
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
          }
        },
        (error) => {
          // console.log(error);
        });
  }

  public getFacebookGender() {
    this.provedor.getFacebookGender()
      .then(
        (data) => {
          this.gender = data;
          // // console.log(data);
          if (data) {
            let total = Number(this.gender[0].clicks) + Number(this.gender[1].clicks) + Number(this.gender[2].clicks);
            this.mujer = Math.round((this.gender[0].clicks / total) * 100);
            this.hombre = Math.round((this.gender[1].clicks / total) * 100)
            if (this.mujer < 10) {
              this.mujerp = "0"
            } else if (this.mujer < 30) {
              this.mujerp = "20"
            } else if (this.mujer < 50) {
              this.mujerp = "40"
            } else if (this.mujer < 70) {
              this.mujerp = "60"
            } else if (this.mujer < 100) {
              this.mujerp = "80"
            } else {
              this.mujerp = "100"
            }

            if (this.hombre < 10) {
              this.hombrep = "0"
            } else if (this.hombre < 30) {
              this.hombrep = "20"
            } else if (this.hombre < 50) {
              this.hombrep = "40"
            } else if (this.hombre < 70) {
              this.hombrep = "60"
            } else if (this.hombre < 100) {
              this.hombrep = "80"
            } else {
              this.hombrep = "100"
            }
          }
        },
        (error) => {
          // console.log(error);
        });
  }

  public getLeadsReport() {
    this.provedor.getLeadsReport()
      .then(
        (data) => {
          this.leadsr = data;
          //// console.log(this.leadsr);
        },
        (error) => {
          // console.log(error);
        });
  }

  public getObtieneContactoSexCte() {
    this.provedor.getObtieneContactoSexCte()
    .then(
      (data) => {
        // // console.log(this.exitoso);
        this.exitoso = data;
        // // console.log(this.exitoso);
        const exito = data[0].LEADS90EX;
        const exitotal = data[0].LEADS90;
        if (exito === 0) {
          this.result = '0%';
        } else {
          const resultexito = (exito * 100) / exitotal;

          if (resultexito > 0 && resultexito < 50) {
            this.resultexito = Math.ceil(resultexito) + '%';
          } else if (resultexito >= 50) {
            this.resultexito = Math.floor(resultexito) + '%';
          } else {
            this.resultexito = '0%';
          }
        }
      },
      (error) => {
        // console.log(error);
      });
  }

  public getCostoCampania() {
    this.provedor.getCostoCampania()
      .then(
        (data) => {
          this.costo = data;
          if (this.costo.length > 0) {
            if (this.costo[0].monto) {
              this.monto = this.costo[0].monto;
            } else {
              this.monto = '0';
            }

            this.diasPagados = this.costo[0].DiasPagados;
            this.diasRegalados = this.costo[0].DiasRegalados;
            this.diasTotales = this.diasPagados + this.diasRegalados;
            this.montoTotal = this.monto + ((this.diasRegalados * this.monto) / this.diasPagados)
            this.today = new Date(this.costo[0].today)
            this.inicio = new Date(this.costo[0].Finicio)
            this.diasTranscurridos = Math.floor((this.today - this.inicio) / (1000 * 60 * 60 * 24));

            if (this.diasTranscurridos == 0) {
              this.diasTranscurridos = 1;
            }
            this.costo = ((this.diasTranscurridos * this.montoTotal) / this.diasTotales);

            var first = Math.trunc(this.costo / 1000);
            var second = Math.trunc(this.costo - (first * 1000));
            // // console.log(first);
            // // console.log(second);
            if (first > 0) {
              if (second == 0) {
                this.costoFinal = "$" + first + ",000"
              } else {
                if (second < 10) {
                  this.costoFinal = "$" + first + ",00" + second
                } else {
                  if (second < 100) {
                    this.costoFinal = "$" + first + ",0" + second
                  } else {
                    this.costoFinal = "$" + first + "," + second
                  }
                }
              }
            } else {
              this.costoFinal = "$" + second;
            }
          }
        },
        (error) => {
          // console.log(error);
        });
  }

  public getDiasRestantes() {
    this.provedor.getDiasRestantes()
      .then(
        (data) => {
          //// console.log(data);

          if (data[0]) {
            let result = data[0].DIAS_RESTANTES;
            //// console.log(result);
            if (result > 0) {
              this.share = result + ' días';
            } else {
              this.share = 'Renueva tu campaña';
            }
          } else {
            this.share = "Renueva tu campaña";
          }
        },
        (error) => {
          // console.log(error);
        });
  }

  public getLikeDias() {
    this.provedor.getLikeDias()
      .then(
        (data) => {
          this.likes = data;
          const total = this.likes[0].Total;
          const rated = this.likes[0].Rated;
          const like = this.likes[0].Like;
          const dislike = this.likes[0].Dislike;
          //Leads calificados
          if (total === 0 && rated === 0) {
            this.result = '0%';
            this.rated = 'not-rated';
          } else {
            let result = (rated * 100) / total;

            if (result > 0 && result < 50) {
              this.result = Math.ceil(result) + '%';
              this.rated = 'rated';
            } else if (result >= 50) {
              this.result = Math.floor(result) + '%';
              this.rated = 'rated';
            } else {
              this.result = '0%';
              this.rated = 'not-rated';
            }
          }
          //Leads con like
          if (like === 0 && dislike === 0) {
            this.calif = 'Sin Información';
            this.rated = 'not-rated';
          } else {

            let calif = (like * 100) / (like + dislike);

            if (calif > 0 && calif < 50) {
              this.calif = Math.ceil(calif) + '%';
              this.rated = 'rated';
            } else if (calif >= 50) {
              this.calif = Math.floor(calif) + '%';
              this.rated = 'rated';
            } else {
              this.calif = '0%';
              this.rated = 'not-rated';
            }
          }
        },
        (error) => {
          // console.log(error);
          //Leads calificados
          this.result = '0%';
          //Leads con like
          this.calif = '0%';
          this.rated = 'not-rated';
        });
  }

  public getInsertClickPagina(){
    const usuario = this.id;
    const pagina = 'reporte';
    const acceso = 'App';
    // // console.log(usuario,pagina,acceso);
    this.provedor.getInsertClickPagina(usuario,pagina,acceso).then((data) => {
      this.datosenvio = data;
    }, (err) => {
      // console.log('error');
    });
  }

  ionViewDidLoad() {
    //// console.log(this.datagraph);
  }

  goBack(): void {
    this.navCtrl.pop();
  }

}
