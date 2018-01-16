import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';

@IonicPage({name:'brief', segment:'brief-1/:param'})
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage {

  titulo:string;
  briefPage=BriefPage;
  leads;
  estado;
  matriz=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provedor:RestProvider) {
    this.titulo = navParams.get('numero');
    this.getLeadsDias();
    this.getLeadsMapa();
  }

  getLeadsDias(){
    this.provedor.getLeadsDias()
    .then(
      (data)=> {
        this.leads = data;
        for (var k in this.leads) {
          let matriz=[];
          let inner = [];
          inner.push([this.leads[k]['abreviacion']]);
          inner.push(this.leads[k]['leads']);
          matriz.push(inner);
      }
        console.log(this.leads);
        console.log(k.abreviacion);

      },
      (error)=> {
        console.log(error);
      });
  }

  getLeadsMapa(){
    this.provedor.getLeadsMapa()
    .then(
      (data)=> {
        this.estado = data;
        console.log(this.estado);  
      },
      (error)=> {
        console.log(error);
      });
  }

  ionViewDidLoad() {
    
  }
  
  goBack():void{
    this.navCtrl.pop();
  }

  public lineChartData:any =  {
    chartType: 'LineChart',
    dataTable: [
      ['Mes', 'Leads'],
      ['22-Nov',  10],
      ['23-Nov',  11],
      ['24-Nov',  6],
      ['25-Nov',  8],
      ['26-Nov',  10],
      ['27-Nov',  11],
      ['28-Nov',  6],
      ['29-Nov',  10],
      ['30-Nov',  9]
    ],
    options: {
      width: '100%',
      height: '100%',
      pointSize: 5,
      legend: 'none',
      hAxis: {
        minvalue: 0,
        format:0,
        gridlines:{
          count: 1
        }
      },
      vAxis: {
        
      },
      colors: ['#10cebc']
    }
  };
  public tableChartData =  {
    chartType: 'Table',
    dataTable: [
      ['Estado', 'Leads'],
      ['CDMX', 10],
      ['Chihuahua', 15],
      ['Baja California', 12],
      ['Jalisco', 21],
      ['San Luis Potosí', 22]
    ],
    options: {
      title: 'Countries', 
      allowHtml: true
    }
  };

  public columnChartData:any =  {
    chartType: 'ColumnChart',
    dataTable: [
      ['Mes', 'Leads', {role: 'style'}],
      ['DIC', 70, 'color:#00a8d8'],
      ['ENE', 30, 'color:#00a8d8'],
      ['FEB', 40, 'color:#00a8d8'],
      ['MAR', 50, 'color:#00a8d8'],
      ['ABR', 60, 'color:#00a8d8'],
      ['MAY', 80, 'color:#00a8d8'],
      ['JUN', 70, 'color:#00a8d8'],
      ['JUL', 30, 'color:#00a8d8'],
      ['AGO', 40, 'color:#00a8d8'],
      ['SEP', 50, 'color:#00a8d8'],
      ['OCT', 60, 'color:#00a8d8'],
      ['NOV', 70, 'color:#00a8d8'],
      ['ESTIM', 30, 'color:#10cebc']
    ],
    options: {
      pointSize: 5,
      legend: 'none',
      hAxis: {
        minvalue: 0,
        format:0,
        gridlines:{
          count: 1
        }
      },
      vAxis: {
        
      },
      colors: ['#10cebc']
    }
  };

  public geoChartData:any =  {
    chartType: 'GeoChart',
    dataTable: [
      ['State', 'Accent'],
      ['Baja California', 100],
      ['Sonora', '100'],
      ['Chihuahua', '100'],
      ['Coahuila', '100'],
      ['Nuevo León', '100'],
      ['Tamaulipas', '100'],
      ['Sinaloa', '100'],
      ['Nayarit', '100'],
      ['Durango', '100'],
      ['Zacatecas', '400'],
      ['Jalisco', '400'],
      ['Colima', '400'],
      ['Tlaxcala', '400'],
      ['Aguascalientes', '400'],
      ['Zacatecas', '400'],
      ['San Luis Potosí', '400'],
      ['Puebla', '400'],
      ['Guanajuato', '400'],
      ['Querétaro', '400'],
      ['Hidalgo', '400'],
      ['Morelos', '400'],
      ['Estado de México', 400],
      ['Distrito Federal', 400],
      ['Baja California Sur', '350'],
      ['Michoacán', '200'],
      ['Guerrero', '200'],
      ['Oaxaca', '200'],
      ['Veracruz', '200'],
      ['Tabasco', '200'],
      ['Campeche', '300'],
      ['Chiapas', '200'],
      ['Quintana Roo', '300'],
      ['Yucatán', '300']
    ],
    options: {
      region: 'MX',
      resolution:'provinces',
      legend:'none',
      colorAxis: {colors: ['#10cebc', '#165a88']}
    }
  };
}
