import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';


@IonicPage({name:'brief', segment:'brief-1/:param'})
@Component({
  selector: 'page-brief',
  templateUrl: 'brief.html',
})
export class BriefPage implements OnInit{

  titulo:string;
  briefPage=BriefPage;
  leads;
  estado;
  public datagraph: any;
  
  public geoChartData =  {
    chartType: 'GeoChart',
    dataTable: [],
    options: {
      region: 'MX',
      resolution:'provinces',
      legend:'none',
      colorAxis: {colors: ['#10cebc', '#165a88']}
    }
  };

  public lineChartData =  {
    chartType: 'LineChart',
    dataTable: [],
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provedor:RestProvider) {
  }

  ngOnInit() {
    this.titulo = this.navParams.get('numero');
    this.getLeadsMapa();
   }
 

  public getLeadsMapa(){
    this.provedor.getLeadsMapa()
    .then(
      (data)=> {
        let outter = [];
        this.estado = data;
        outter.push(['Estado','Leads']);
        for(let i=0;i<this.estado.length ; i++){
          let inner = [];
          inner.push(this.estado[i].nombre);
          inner.push(this.estado[i].leads);
          outter.push(inner);
        }
        this.geoChartData.dataTable = outter
        // console.log(this.datagraph);
      },
      (error)=> {
        console.log(error);
      });
  }

  ionViewDidLoad() {
    //console.log(this.datagraph);
  }
  
  goBack():void{
    this.navCtrl.pop();
  }

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

  

}
