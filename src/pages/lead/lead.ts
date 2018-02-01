import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lead',
  templateUrl: 'lead.html',
})
export class LeadPage {

  leadActual;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController, 
              public navParams: NavParams) {
      this.leadActual = navParams.data;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LeadPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

 /* FbotonOn() {
    var uno = document.getElementById('tel');
    if (uno.innerHTML == '26222194 ID cliente 1094') 
        uno.innerHTML = 'Llamar a Juan Pérez';
    else uno.innerHTML = '26222194 ID cliente 1094'; 
  }*/

  FbotonOn() {
    var uno = document.getElementById('tel');
    uno.innerHTML = '26222194 ID cliente 1094'; 
  }

}

/* <ion-grid class="vista2”>
      <ion-row align-items-center>
        <ion-col>
          <div class="circulo">
            <p class="circulo">V</p>
          </div>
          <br>
        </ion-col>
        <ion-col col-6 align-self-center>
          <a class="inf-nombre">
            <strong>{{leadActual.NOMBRE}} </strong>
          </a>
          <div class="tooltip">
            <ion-icon class="urgente" alt="Urgente" name="ios-alert-outline"></ion-icon>
            <span class="tooltiptext"> Urgente</span>
          </div>
        </ion-col>
        <ion-col col-4>
          <div class="rate-fechal">{{leadActual.FECHA}}</div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="rate-calidad">Clasificación Lead = 85%</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-empresa">{{leadActual.EMPRESA}}</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-estado">{{leadActual.ESTADO}}</div>
        </ion-col>
        <ion-col col2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-correo">{{leadActual.EMAIL}}</div>
        </ion-col>
        <ion-col col2 style="text-align: right;">
        </ion-col>
      </ion-row>
      <!-- Esto es lo que cambia -->
   <!--   <ion-row>
        <ion-col>
          <p class="cotiza">Cotización para mi empresa</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="mensaje">Hola,Me gustaría que me diera más información sobre sus servicios. Por favor comuníquese conmigo lo antes posible.
            Gracias.</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="frecuencia">Frecuencia de servicio: Mensual</p>
        </ion-col>
      </ion-row>
      <!-- Termina lo que cambia -->
   <!--   <ion-row>
        <ion-col col-6>
          <p class="califica">Clasifica este Lead</p>
        </ion-col>
        <ion-col col-5 offset-1>
          <p class="califica">Califica este Lead</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6>
          <button class="arribab">Vendido</button>
          <button class="arribab">En proceso</button>
          <br>
          <button class="arribab">Sin Contacto</button>
          <button class="arribab">Descartado</button>
        </ion-col>
        <ion-col col-5 offset-1 style="text-align:center">
          <ion-icon class="evaluado" name="md-thumbs-up"></ion-icon>
          <ion-icon class="noevaluado" name="md-thumbs-down"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button class="llamar"  (click)="FbotonOn();">
            <ion-icon class="telefono" name="md-call"></ion-icon>
            <a class="phone" id="tel">Llamar a {{leadActual.NOMBRE}}</a>
          </button>
        </ion-col>
      </ion-row>
  
    </ion-grid>
  
  
  <ion-grid class="vista 3”>
      <ion-row align-items-center>
        <ion-col>
          <div class="circulo">
            <p class="circulo">V</p>
          </div>
          <br>
        </ion-col>
        <ion-col col-6 align-self-center>
          <a class="inf-nombre">
            <strong>{{leadActual.NOMBRE}} </strong>
          </a>
          <div class="tooltip">
            <ion-icon class="urgente" alt="Urgente" name="ios-alert-outline"></ion-icon>
            <span class="tooltiptext"> Urgente</span>
          </div>
        </ion-col>
        <ion-col col-4>
          <div class="rate-fechal">{{leadActual.FECHA}}</div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="rate-calidad">Clasificación Lead = 85%</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-empresa">{{leadActual.EMPRESA}}</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-estado">{{leadActual.ESTADO}}</div>
        </ion-col>
        <ion-col col2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-correo">{{leadActual.EMAIL}}</div>
        </ion-col>
        <ion-col col2 style="text-align: right;">
        </ion-col>
      </ion-row>
      <!-- Esto es lo que cambia -->
     <!-- <ion-row>
        <ion-col>
          <p class="paciente">Información paciente:<a class="edadpaciente"> Mujer 32 años</a></p>
  
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="mensaje">Buen día, me gustaría agendar una cita para consulta con usted. Quedo atento a la respuesta de acuerdo a su disponibilidad.
            Gracias.
          </p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <a class="paciente">Hora y fecha de la cita</a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-icon class="cita" name="md-calendar"></ion-icon>
          <a class="paciented">18/02/18</a>
          <ion-icon class="cita" name="md-alarm"></ion-icon>
          <a class="paciented">16:35</a>
        </ion-col>
      </ion-row>
      <ion-row>
          <ion-col style="margin-top: 1em;">
            <ion-icon class="download" name="md-pin"></ion-icon>
            <a class="descarga">El paciente revisó tu dirección</a>
          </ion-col>
        </ion-row>
      <!-- Termina lo que cambia -->
   <!--   <ion-row>
        <ion-col col-6>
          <p class="califica">Clasifica este Lead</p>
        </ion-col>
        <ion-col col-5 offset-1>
          <p class="califica">Califica este Lead</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6>
          <button class="arribab">Vendido</button>
          <button class="arribab">En proceso</button>
          <br>
          <button class="arribab">Sin Contacto</button>
          <button class="arribab">Descartado</button>
        </ion-col>
        <ion-col col-5 offset-1 style="text-align:center">
          <ion-icon class="evaluado" name="md-thumbs-up"></ion-icon>
          <ion-icon class="noevaluado" name="md-thumbs-down"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button class="llamar"  (click)="FbotonOn();">
            <ion-icon class="telefono" name="md-call"></ion-icon>
            <a class="phone" id="tel">Llamar a {{leadActual.NOMBRE}}</a>
          </button>
        </ion-col>
      </ion-row>
  
    </ion-grid>
  
  
    <ion-grid class="vista 4”>
      <ion-row align-items-center>
        <ion-col>
          <div class="circulo">
            <p class="circulo">V</p>
          </div>
          <br>
        </ion-col>
        <ion-col col-6 align-self-center>
          <a class="inf-nombre">
            <strong>{{leadActual.NOMBRE}} </strong>
          </a>
          <div class="tooltip">
            <ion-icon class="urgente" alt="Urgente" name="ios-alert-outline"></ion-icon>
            <span class="tooltiptext"> Urgente</span>
          </div>
        </ion-col>
        <ion-col col-4>
          <div class="rate-fechal">{{leadActual.FECHA}}</div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="rate-calidad">Clasificación Lead = 85%</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-empresa">{{leadActual.EMPRESA}}</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-estado">{{leadActual.ESTADO}}</div>
        </ion-col>
        <ion-col col2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-correo">{{leadActual.EMAIL}}</div>
        </ion-col>
        <ion-col col2 style="text-align: right;">
        </ion-col>
      </ion-row>
  
  
      <!-- Esto es lo que cambia -->
  <!--    <ion-row>
        <ion-col>
          <p class="cotiza">Cotización para uso personal</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="mensaje">Hola,Me gustaría que me diera más información acerca de sus productos o servicios. Por favor comuníquese conmigo
            lo antes posible. Gracias.</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="frecuencia">Requiero: 22 cajas</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="frecuencia">Frecuencia de compra: Mensual</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col style="margin-top: 1em;">
          <ion-icon class="download" name="md-pin"></ion-icon>
          <a class="descarga">El cliente revisó tu dirección</a>
        </ion-col>
      </ion-row>
      <!-- Termina lo que cambia -->
  
  
   <!--   <ion-row>
        <ion-col col-6>
          <p class="califica">Clasifica este Lead</p>
        </ion-col>
        <ion-col col-5 offset-1>
          <p class="califica">Califica este Lead</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6>
          <button class="arribab">Vendido</button>
          <button class="arribab">En proceso</button>
          <br>
          <button class="arribab">Sin Contacto</button>
          <button class="arribab">Descartado</button>
        </ion-col>
        <ion-col col-5 offset-1 style="text-align:center">
          <ion-icon class="evaluado" name="md-thumbs-up"></ion-icon>
          <ion-icon class="noevaluado" name="md-thumbs-down"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button class="llamar"  (click)="FbotonOn();">
            <ion-icon class="telefono" name="md-call"></ion-icon>
            <a class="phone" id="tel">Llamar a {{leadActual.NOMBRE}}</a>
          </button>
        </ion-col>
      </ion-row>
  
    </ion-grid>
  
  <ion-grid class="vista 5”>
      <ion-row align-items-center>
        <ion-col>
          <div class="circulo">
            <p class="circulo">V</p>
          </div>
          <br>
        </ion-col>
        <ion-col col-6 align-self-center>
          <a class="inf-nombre">
            <strong>{{leadActual.NOMBRE}} </strong>
          </a>
          <div class="tooltip">
            <ion-icon class="urgente" alt="Urgente" name="ios-alert-outline"></ion-icon>
            <span class="tooltiptext"> Urgente</span>
          </div>
        </ion-col>
        <ion-col col-4>
          <div class="rate-fechal">{{leadActual.FECHA}}</div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="rate-calidad">Clasificación Lead = 85%</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-empresa">{{leadActual.EMPRESA}}</div>
        </ion-col>
        <ion-col col-2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-estado">{{leadActual.ESTADO}}</div>
        </ion-col>
        <ion-col col2>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-2>
        </ion-col>
        <ion-col col-8>
          <div class="inf-correo">{{leadActual.EMAIL}}</div>
        </ion-col>
        <ion-col col2 style="text-align: right;">
        </ion-col>
      </ion-row>
      <!-- Esto es lo que cambia -->
   <!--   <ion-row>
          <ion-col>
            <ion-icon class="reserva" name="md-restaurant"></ion-icon>
            <a class="tipo">Cita romántica</a>
          </ion-col>
        </ion-row>
      <ion-row>
        <ion-col>
          <ion-icon class="reserva" name="ios-people"></ion-icon>
          <a class="tipo">2 personas</a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <p class="mensaje">Buen día, me gustaría agendar una cita para consulta con usted. Quedo atento a la respuesta de acuerdo a su disponibilidad.
            Gracias.
          </p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <a class="paciente">Hora y fecha de la cita</a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-icon class="cita" name="md-calendar"></ion-icon>
          <a class="paciented">18/02/18</a>
          <ion-icon class="cita" name="md-alarm"></ion-icon>
          <a class="paciented">16:35</a>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col style="margin-top: 1em;">
          <ion-icon class="download" name="md-pin"></ion-icon>
          <a class="descarga">El cliente revisó tu dirección</a>
        </ion-col>
      </ion-row>
      <!-- Termina lo que cambia -->
    <!--  <ion-row>
        <ion-col col-6>
          <p class="califica">Clasifica este Lead</p>
        </ion-col>
        <ion-col col-5 offset-1>
          <p class="califica">Califica este Lead</p>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6>
          <button class="arribab">Vendido</button>
          <button class="arribab">En proceso</button>
          <br>
          <button class="arribab">Sin Contacto</button>
          <button class="arribab">Descartado</button>
        </ion-col>
        <ion-col col-5 offset-1 style="text-align:center">
          <ion-icon class="evaluado" name="md-thumbs-up"></ion-icon>
          <ion-icon class="noevaluado" name="md-thumbs-down"></ion-icon>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <button class="llamar"  (click)="FbotonOn();">
            <ion-icon class="telefono" name="md-call"></ion-icon>
            <a class="phone" id="tel">Llamar a {{leadActual.NOMBRE}}</a>
          </button>
        </ion-col>
      </ion-row>
    </ion-grid>*/
  
  
  
  
  
