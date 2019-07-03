import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, Platform } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media';
import { Storage } from '@ionic/storage';
import { ElementRef, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { ChatServiceProvider, ChatMessage } from "../../providers/chat-service/chat-service";
import { HttpHeaders } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import * as distanceinWordsStrict from 'date-fns/distance_in_words_strict';
import * as esLocale from 'date-fns/locale/es';
import swal from 'sweetalert2';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-lead',
  templateUrl: 'lead.html',
})

export class LeadPage implements OnInit {

  leadActual;
  apiUrl = 'https://www.koomkin.com.mx/api/app';

  public califica;
  public calificacion;
  public categoria;
  public clasifica;
  public clasificacion;
  public color = ''
  public email;
  public estatus;
  public fechallamada;
  public horallamada;
  public marcador;
  public noleidos;
  public complemento;
  public mensaje;
  public mensajeLead;
  public mensajeMailing;
  public urgencia = 'No';
  public cantidad;
  public frecuencia;
  public url = 'sinaudio';
  public audio;
  public mostrar
  public urlaudio;
  dispositivo = '';

  //Proveedor
  public urgenciaproveedor;
  public cantidadproveedor;
  public frecuenciaproveedor;
  public envioproveedor;
  public usoproveedor;
  public unidadesproveedor;
  public mensajeproveedor;

  //Servicio
  public urgenciaservicio = 'No';
  public frecuenciaservicio;
  public usoservicio;
  public mensajeservicio;

  //Medico
  public mensajemedico;
  public fechaCitaM;
  public horaCitaM;
  public urgenciamedico = 'No';
  public generoM;
  public edadM;

  //Profesionista
  public mensajeprofesionista;
  public fechaCitaP;
  public horaCitaP;
  public urgenciaprofesionista = 'No';
  public usoprofesionista;

  //PuntoVenta
  public mensajeventa;
  public urgenciaventa = 'No';
  public usoventa;

  //Restaurante
  public mensajerestaurante;
  public fechaCitarestaurante;
  public horaCitarestaurante;
  public personasrestaurante;

  //Hotel
  public personashotel;
  public hotelEntrada;
  public hotelSalida;
  public mensajehotel;

  //Inmobiliaria
  public mensajeinmobiliaria;
  public urgenciainmobiliaria = 'No';
  public edadinmobiliaria;
  public personasinmobiliaria;
  public horaCitainmobiliaria;
  public fechaCitainmobiliaria;
  
  //
  public fechaCita;
  public horaCita;
  public genero;
  public uso;
  public envio;
  public unidades;
  public datosenvio;
  public clientUUID = this.authService.getClientUUID();
  
  //Estatus llamadas
  llamadas: any = [];
  public llamada;
  public perdida = '0';
  public exitosa = '0';
  public exitosa_v = '0';
  public exitosa_c = '0';
  public buzon = '0';
  public invalido = '0';
  public tel: any = ' ';
  public page: string = "Lead";
  public pages: Array<string> = ['Lead', 'Comentarios', 'Llamadas', 'Chat'];
  isAndroid: boolean = false;
  public tc: any;
  public loadingMessages: boolean;
  public intentosExitoso:any = '-';
  public attentionSpeed:any = '-';
  public contacto:any = '-';
  public razones;
  public razonDescarto;
  public garantia = 'No';
  public diasContacto = '-';
  public comentarios;
  public comentario;
  public show = false;
  public fechaComentario;
  public idComentario;
  public clasificaComentario;
  public valorLead;
  public fecha;
  public fechaExitoso;
  public scheduledAt;
  private autoScroller: MutationObserver;

  @ViewChild(Content) content: Content;

  @ViewChild('chat_input') messageInput: ElementRef;

  private autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));
    autoScroller.observe(this.messageContent, {
      childList: true,
      subtree: true
    });
    return autoScroller;
  }

  private get messageContent(): Element {
    return document.querySelector('.falling');
  }

  private scrollDown() {
    if (this.content && this.page === 'Chat') {
      this.content.resize();
      this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 0).then(() => {
        if (this.content) {
          this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 80);
        }
      });
    }
  }

  private get scroller(): Element {
    return this.messageContent.querySelector('.scroll-content');
  }

  public msgListLead: ChatMessage[] = [];
  editorMsg = '';
  showEmojiPicker = false;

  openModalFuncionalidadPrueba() {
    const myModal = this.modal.create('ModalPage', { uuid: this.clientUUID }, { enableBackdropDismiss: false, cssClass: "Modal-prueba-chat" });
    myModal.present();
    myModal.onDidDismiss(() => {
      this.page = 'Lead';
      this.content.resize();
    });
  }

  openModalIniciarConversacion() {

    const myModal2 = this.modal.create('ModalPageIniciarChatPage', { uuid: this.leadActual.uuid, nombrelead: this.leadActual.NOMBRE }, { enableBackdropDismiss: false, cssClass: "Modal-iniciar-chat" });
    myModal2.present();
    myModal2.onDidDismiss((conversacionIniciada) => {
      if (conversacionIniciada) {
        this.leadActual.intentos = 1;
      } else {
        if (this.msgListLead.length === 0) {
          this.page = 'Lead';
        } else {
          this.leadActual.intentos = 1;
        }
      }
      this.content.resize();
    });
  }

  chatPageExecutelogic() {
    return new Promise((resolve, reject) => {
      if (this.authService.getUserIsLogged()) {
        if (this.authService.getEnableChat() === 1) {
          if (this.leadActual.intentos === 0 || this.leadActual.intentos === null) {
            if (this.msgListLead.length === 0) {
              this.openModalIniciarConversacion();
            }
            return resolve();
          } else {
            this.leerChat();
            return resolve();
          }
        } else {
          this.openModalFuncionalidadPrueba();
          return resolve();
        }
      } else {
        this.mostrarAlertaInicioSesionRequerido();
        return resolve();
      }
    });
  }

  pageChanged() {
    this.content.resize();
    if (this.page === 'Chat') {
      this.chatPageExecutelogic().then(() => {
        //this.connectChat();
      }, (err) => {
      });
    }
  }

  public leerChat() {
    const url = 'https://www.koomkin.com.mx/chat/api/read-messages/';
    return new Promise((resolve, reject) => {
      this.http.post(url + this.leadActual.uuid, { device: "app" })
        .subscribe(data => {
          return resolve();
        }, err => {
          return resolve(err);
        });
    });
  }

  mostrarAlertaInicioSesionRequerido() {

    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Por favor inicie sesión",
      subTitle: "",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.page = 'Lead';
            this.content.resize();
          }
        }
      ]

    });
    alert.present();
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollDown.bind(this);
  }

  sendMsg() {
    if (!this.editorMsg.trim()) return;
    if (this.chatService.tc.currentChannel) {
      this.chatService.tc.currentChannel.sendMessage(this.editorMsg).then(() => {
        this.editorMsg = '';
      });
      if (!this.showEmojiPicker) {
        this.focus();
      }
    }
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  onTabChanged(tabName) {
    this.page = tabName;
  }

  ngOnInit() {

    this.chatService.msgListActualizada.subscribe(
      result => {
        if (result.length === 0) {
          this.msgListLead = result;
          console.log(this.msgListLead);
        }
        if (result.length > 1) {
          this.ngz.run(() => {
            this.msgListLead = result;
            console.log(this.msgListLead);
            setTimeout(() => { this.scrollDown.bind(this) }, 5000);
          });
        } else {
          var temp = result[0];
          if (temp) {
            if (temp.type === 'media') {
              this.ngz.run(() => {
                setTimeout(() => { this.scrollDown.bind(this) }, 2500);
              });
            } else {
            }
          }
          this.ngz.run(() => {
            this.msgListLead = this.msgListLead.concat(result);
            console.log(this.msgListLead);
          });

        }
      }

    )

    this.chatService.loadingMessagesActualizado.subscribe(
      result => {
        this.ngz.run(() => { });
        this.loadingMessages = result;
      }
    );
    this.getRazones();
    this.getComentarios();
    this.getScheduled();
    this.getLeadCalls();
    this.getCheckLeadComplement();
    this.getCountLeadCalls();
    this.getUrlAudio();
  }

  ionViewDidEnter() {
    this.autoScroller = this.autoScroll();
    if (this.leadActual['gotopage']) { // Si es notificación de Chat metelo al chat page
      this.page = 'Chat';
      this.chatPageExecutelogic()
    }
    if (this.chatService.chatClientStarted === true) {
      this.chatService.connectToChatChannel(this.leadActual.uuid);
    } else {
      setTimeout(() => {
        if (this.chatService.chatClientStarted === true) {
          this.chatService.connectToChatChannel(this.leadActual.uuid);
        }
      }, 580);
    }
  }

  public fileTransfers: TransferObject = this.transfer.create();

  constructor(
    private modal: ModalController,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public platform: Platform,
    public authService: AuthServiceProvider,
    public chatService: ChatServiceProvider,
    private streamingMedia: StreamingMedia,
    public storage: Storage,
    public file: File,
    private fileOpener: FileOpener,
    private transfer: Transfer,
    public ngz: NgZone,
    public loadingCtrl: LoadingController
  ) {
    var f = new Date();
    this.fecha = f.getDate() + '/' + (f.getMonth() + 1) + '/' + f.getFullYear();
    let fecha2 = f.getFullYear() + '-' +  ('0' + (f.getMonth()+1)).slice(-2) + '-' + f.getDate();

    // Obtenemos parametros de la página de LEADS
    this.leadActual = navParams.data;
    this.razonDescarto = this.leadActual.RazonDescartado;
    this.mensajeLead = this.leadActual.MENSAJE;
    this.valorLead = this.leadActual.ValorLead;
    this.intentosExitoso = this.leadActual.IntentosAntesExitoso;
    if(this.intentosExitoso == null || this.intentosExitoso == 'null') {
      this.intentosExitoso = '-';
    }

    this.fechaExitoso = this.leadActual.FechaExitoso;

    if( this.fechaExitoso != null && this.fechaExitoso != 'null') {

      this.diasContacto = distanceinWordsStrict(
        new Date(this.fechaExitoso.substring(0,10)),
        new Date(fecha2),
        { locale: esLocale, addSuffix: false }
      );

    }

    if(this.leadActual.comentario.length > 0) {
      if(this.leadActual.comentario[0].IdComentario) {
        this.show = true;
        this.comentario = this.leadActual.comentario[0].Comentario;
        this.fechaComentario = this.leadActual.comentario[0].FechaRegistro;
        this.idComentario = this.leadActual.comentario[0].IdComentario;
        if(this.leadActual.comentario[0].ClasificaLead !== 'null' && this.leadActual.comentario[0].ClasificaLead !== null ) {
          this.clasificaComentario = this.leadActual.comentario[0].ClasificaLead;
        }
      } 
    }

    
    if (this.leadActual.fechaContacto) {
      this.leadActual.fechaContacto = this.leadActual.fechaContacto
        .substring(0, 16)
        .replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{5})$/g, '$3/$2/$1$4');
      const diff =
        (new Date(this.leadActual.fechaContacto).getTime() -
          new Date(this.leadActual.FECHA).getTime()) /
        1000;
      // diff = Math.abs(diff>10800);
      if (diff > 7200) {
        this.attentionSpeed = distanceinWordsStrict(
          new Date(this.leadActual.FECHA),
          new Date(this.leadActual.fechaContacto),
          { locale: esLocale, addSuffix: false }
        );
      } else {
        this.attentionSpeed = distanceinWordsStrict(
          new Date(this.leadActual.FECHA),
          new Date(this.leadActual.fechaContacto),
          { locale: esLocale, addSuffix: false, unit: 'm' }
        );
        this.garantia = 'Sí'
      }
    }
    if (!this.leadActual.clave) {
      this.leadActual.clave = this.leadActual.ID_LEAD;  // Por si llega el Lead por notificación.
    }
    if (this.leadActual.canalContacto == '' || this.leadActual.canalContacto == 'null' || this.leadActual.canalContacto == null) {
      this.leadActual.canalContacto = '-'
    }
    if (this.leadActual.fechaContacto == '' || this.leadActual.fechaContacto == 'null' || this.leadActual.fechaContacto == null) {
      this.leadActual.fechaContacto = ''
    }
    if (this.leadActual.canalContacto == 'chat' || this.leadActual.canalContacto == 'llamada') {
      this.contacto = 'Sí';
    } else {
      this.contacto = 'No';
    }
    if (this.leadActual.desdeNotificacion === true) {
      this.authService.setNotificationActive(true);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  FbotonOn() {
    let uno = document.getElementById('tel');
    uno.innerHTML = 'Llamando a ' + this.leadActual.NOMBRE;
    //  // console.log(this.leadActual);
  }

  public callClient() {

    const body = new URLSearchParams();
    body.set("uuid", this.leadActual.uuid);
    body.set("canal", 'reporte-app');

    const options = {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      )
    };

    const url = 'https://koomkin.com.mx/calltracker/calling/';

    return new Promise(resolve => {
      this.http.post(url, body.toString(), options).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  public changeClassification(classification: string) {
    switch (classification) {
      case 'V': {
        this.leadActual.clasificaLead = 'V';
        this.clasifica = 'Vendido';
        break;
      }
      case 'D': {
        this.leadActual.clasificaLead = 'D';
        this.clasifica = 'Descartado'
        break;
      }
      case 'P': {
        this.leadActual.clasificaLead = 'P';
        this.clasifica = 'En proceso de venta'
        break;
      }
      case 'C': {
        this.leadActual.clasificaLead = 'S';
        this.clasifica = 'Sin Contacto'
        break;
      }
      default:
        this.clasifica = ''
    }
    const body = {
      clave: this.leadActual.clave,
      classification: this.clasifica
    }
    this.http.get(this.apiUrl + "/clasificaLead2/" + body.clave + '/' + body.classification + '/app')
      .subscribe(data => {
        this.clasificacion = data[0].clasificaLead;
        //// console.log(this.clasificacion);
      },
        err => {
          // console.log("Error occured");
        });
  }

  showConfirm() {

    let btnCancel = {
      text: 'Cancelar',
      role: 'cancelar',
      cssClass: 'cancel-button',
      handler: () => {
        // console.log('Disagree clicked');
      }
    }

    let btnOk = {
      text: 'Aceptar',
      cssClass: 'exit-button',
      handler: () => {
        this.callClient();
        this.FbotonOn();
        // console.log('Agree clicked');
      }
    }

    let confirm = this.alertCtrl.create({
      title: '¿Desea llamar a ' + this.leadActual.NOMBRE + '?',
      cssClass: 'buttonCss',
      buttons: [
        btnCancel,
        btnOk
      ]
    });
    confirm.present();
  }

  public getLeadCalls() {
    this.http.get(this.apiUrl + '/getLeadCalls/' + this.leadActual.clave).subscribe(data => {
      this.llamadas = data;
      if (this.llamadas) {
        for (let k in this.llamadas) {
          this.llamadas[k].CallStatus = this.llamadas[k].CallStatus;
          // console.log(this.llamadas[k].CallStatus,this.llamadas[k].LlamadaLead);
          if (this.llamadas[k].CallStatus == 'failed' || this.llamadas[k].CallStatus == 'completed' && this.llamadas[k].exitosa == 0) {
            this.llamadas[k].CallStatus = 'perdida';
          }
          if (this.llamadas[k].CallStatus == 'inv-lead' || this.llamadas[k].CallStatus == 'inv-cliente') {
            this.llamadas[k].CallStatus = 'invalido';
          }
          if (this.llamadas[k].CallStatus == 'ringing') {
            this.llamadas[k].CallStatus = 'llamando';
          }
          if (this.llamadas[k].LlamadaLead == 0 && this.llamadas[k].exitosa == 1) {
            this.llamadas[k].CallStatus = 'cliente';
          } else if (this.llamadas[k].LlamadaLead == 1 && this.llamadas[k].exitosa == 1) {
            this.llamadas[k].CallStatus = 'comprador';
          }

          this.llamadas[k].horallamada = this.llamadas[k].FechaLlamada
          if(this.llamadas[k].horallamada != 'null' && this.llamadas[k].horallamada != null){
            this.llamadas[k].horallamada = this.llamadas[k].FechaLlamada.substring(11, 16);
            this.llamadas[k].FechaLlamada = this.llamadas[k].FechaLlamada.substring(0, 10).replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
          }

          if (this.llamadas[k].FechaLlamada == this.fecha) {
            this.llamadas[k].FechaLlamada = 'Hoy';
          }
        }
      }
    });
  }

  public getCountLeadCalls() {
    this.http.get(this.apiUrl + '/getCountLeadCalls/' + this.leadActual.clave).subscribe(data => {
      //// console.log(data);
      this.llamada = data;
      if (this.llamada.length > 0) {
        this.exitosa_c = this.llamada[0].COMPLETED_COMPRADOR;
        if (this.exitosa_c == null) {
          this.exitosa_c = '0';
        }
        this.exitosa_v = this.llamada[0].COMPLETED_VENDEDOR;
        if (this.exitosa_v == null) {
          this.exitosa_v = '0';
        }
        this.exitosa = this.llamada[0].CUENTA_COMPLETED;
        if (this.exitosa == null) {
          this.exitosa = '0';
        }
        this.perdida = this.llamada[0].CUENTA_FAILED;
        if (this.perdida == null) {
          this.perdida = '0';
        }
        this.invalido = this.llamada[0].CUENTA_INVALIDO;
        if (this.invalido == null) {
          this.invalido = '0';
        }
        this.buzon = this.llamada[0].CUENTA_BUZON;
        if (this.buzon == null) {
          this.buzon = '0';
        }
        //// console.log(this.exitosa_c, this.exitosa_v, this.exitosa, this.perdida, this.buzon);
      }
    });
  }

  public getCheckLeadComplement() {
    return new Promise(resolve => {
      const apiUrl2 = this.apiUrl + '/getLeadComplement/' + this.leadActual.clave;
      this.http.get(apiUrl2).subscribe(data => {
        if (data == null || Object.keys(data).length == 0) {
          this.mensaje = this.leadActual.MENSAJE;
          this.urgencia = "No";
          this.cantidadproveedor = "";
          this.frecuenciaproveedor = "";
          this.envioproveedor = "";
          this.usoproveedor = "";
          this.unidadesproveedor = "";
          this.categoria = 1;
          //  // console.log(this.mensaje);
        }
        else
          if (Object.keys(data).length > 0) {
            this.categoria = data[0].CompanyType;
            // console.log(this.categoria);
            switch (this.categoria) {
              case 1:
                if ((data[0] === null)) {
                  // this.mensajeproveedor = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.urgencia = "No";
                  this.cantidadproveedor = "";
                  this.frecuenciaproveedor = "";
                  this.envioproveedor = "";
                  this.usoproveedor = "";
                  this.unidadesproveedor = "";
                } else {
                  if (data) {

                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == "null" || this.urgencia == "None" || this.urgencia == undefined) {
                      this.urgencia = "No";
                    }
                    /*this.mensajeproveedor = data[0].Details;
                    if (this.mensajeproveedor == "Escribe aquí..." || this.mensajeproveedor == "" ||
                      this.mensajeproveedor == null || this.mensajeproveedor == undefined || this.mensajeproveedor == "null" || this.mensajeproveedor == "None") {
                      this.mensajeproveedor = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.cantidadproveedor = data[0].Quantity;
                    if (this.cantidadproveedor == "0" || this.cantidadproveedor == "null" || this.cantidadproveedor == null || this.cantidadproveedor == "None" || this.cantidadproveedor == undefined) {
                      this.cantidadproveedor = "";
                    }
                    this.unidadesproveedor = data[0].Unit;
                    if (this.unidadesproveedor == "null" || this.unidadesproveedor == null || this.unidadesproveedor == undefined || this.unidadesproveedor == "None") {
                      this.unidadesproveedor = "";
                    }
                    this.frecuenciaproveedor = data[0].Frequency;
                    if (this.frecuenciaproveedor == "null" || this.frecuenciaproveedor == "None" || this.frecuenciaproveedor == null || this.frecuenciaproveedor == undefined) {
                      this.frecuenciaproveedor = "";
                    }
                    this.usoproveedor = data[0].Usage;
                    if (this.usoproveedor == "null" || this.usoproveedor == null || this.usoproveedor == "None" || this.usoproveedor == undefined || this.usoproveedor == "undefined") {
                      this.usoproveedor = "";
                    } else if (this.uso == "0") {
                      this.usoproveedor = "Uso personal";
                    } else if (this.uso == "1") {
                      this.usoproveedor = "Mi empresa";
                    }
                    this.envioproveedor = data[0].Shipping;
                    if (this.envioproveedor == "False" || this.envioproveedor == "null" || this.envioproveedor == null || this.envioproveedor == undefined || this.mensajemedico == "null" || this.envioproveedor ==
                      "None" || this.envioproveedor == undefined) {
                      this.envioproveedor = "";
                    }
                  }

                }
              case 2:
                if (data[0] === null) {
                  // this.mensajeservicio = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.urgencia = "No";
                  this.frecuenciaservicio = "";
                  this.usoservicio = "";
                } else {
                  if (data) {
                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == "null" || this.urgencia == undefined || this.urgencia == null || this.urgencia == "None") {
                      this.urgencia = "No";
                    }
                    /*this.mensajeservicio = data[0].Details;
                    if (this.mensajeservicio == "Escribe aquí..." || this.mensajeservicio == "" ||
                      this.mensajeservicio == null || this.mensajeservicio == "null" || this.mensajeservicio == undefined || this.mensajeservicio == null || this.mensaje == "None") {
                      this.mensajeservicio = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.usoservicio = data[0].Usage;
                    if (this.usoservicio == "null" || this.usoservicio == null || this.usoservicio == undefined || this.usoservicio == "None") {
                      this.usoservicio = "";
                    } else if (this.usoservicio == "0") {
                      this.usoservicio = "Uso personal";
                    } else if (this.usoservicio == "1") {
                      this.usoservicio = "Mi empresa";
                    }
                    // console.log(this.usoservicio);
                    this.frecuenciaservicio = data[0].Frequency;
                    if (this.frecuenciaservicio == null || this.frecuenciaservicio == "null" || this.frecuenciaservicio == undefined || this.frecuenciaservicio == "None") {
                      this.frecuenciaservicio = "";
                    }
                  }
                }
                return;
              case 3:
                if (data[0] === null) {
                  // this.mensajemedico = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.urgencia = "No";
                  this.generoM = "";
                  this.fechaCitaM = "";
                  this.horaCitaM = "";
                  this.edadM = "";
                } else {
                  if (data) {
                    /*if (data[0].Details) {
                      this.mensajemedico = data[0].Details;
                      if (this.mensajemedico == "Escribe aquí..." || this.mensajemedico == "" || this.mensajemedico == null || this.mensajemedico == undefined || this.mensajemedico == "null" || this.mensajemedico ==
                        "None") {
                        this.mensajemedico = this.leadActual.MENSAJE;
                      }
                    } else {
                      this.mensajemedico = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == undefined || this.urgencia == "null" || this.urgencia == "None") {
                      this.urgencia = "No";
                    }
                    this.edadM = data[0].Age;
                    if (this.edadM == "null" || this.edadM == null || this.edadM == undefined || this.edadM == "None") {
                      this.edadM = "0";
                    }
                    this.generoM = data[0].Gender;
                    if (this.generoM == "null" || this.generoM == null || this.generoM == undefined || this.generoM == "None") {
                      this.generoM = " sssss" +
                        "";
                    }

                    if (data[0].Date) {
                      this.fechaCitaM = data[0].Date.substring(0, 10);
                      if (this.fechaCitaM == "" || this.fechaCitaM == null || this.fechaCitaM == undefined || this.fechaCitaM == "null" ||
                        this.fechaCitaM == "None") {
                        this.fechaCitaM = "";
                      }
                    } else {
                      this.fechaCitaM = "";
                    }
                    if (data[0].Time) {
                      this.horaCitaM = data[0].Time.substring(11, 16);
                      if (this.horaCitaM == "" || this.horaCitaM == "null" || this.horaCitaM == null || this.horaCitaM == undefined || this.horaCita ==
                        "None") {
                        this.horaCitaM = "";
                      }
                    } else {
                      this.horaCitaM = "";
                    }
                  }

                }
              case 4:
                if (data[0] === null) {
                  // this.mensajeprofesionista = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.urgencia = "No";
                  this.usoprofesionista = "";
                  this.fechaCitaP = "";
                  this.horaCitaP = "";

                } else {
                  if (data) {
                    /*this.mensajeprofesionista = data[0].Details;
                    if (this.mensajeprofesionista == "Escribe aquí..." || this.mensajeprofesionista == "" ||
                      this.mensajeprofesionista == "null" || this.mensajeprofesionista == null || this.mensajeprofesionista == undefined || this.mensajeprofesionista == "None") {
                      this.mensajeprofesionista = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.usoprofesionista = data[0].Usage;
                    if (this.usoprofesionista == null || this.usoprofesionista == "null" || this.usoprofesionista == undefined || this.usoprofesionista == "None") {
                      this.usoprofesionista = "";
                    } else if (this.usoprofesionista == "0") {
                      this.usoprofesionista = "Uso personal";
                    } else if (this.usoprofesionista == "1") {
                      this.usoprofesionista = "Mi empresa";
                    }
                    if (data[0].Date) {
                      this.fechaCitaP = data[0].Date.substring(0, 10);
                      if (this.fechaCitaP == "" || this.fechaCitaP == "null" || this.fechaCitaP == null || this.fechaCitaP == undefined ||
                        this.fechaCitaP == "None") {
                        this.fechaCitaP = "";
                      }
                    }
                    if (data[0].Time) {
                      this.horaCitaP = data[0].Time.substring(11, 16);
                      if (this.horaCitaP == "" || this.horaCitaP == "null" || this.horaCitaP == null || this.horaCitaP == undefined || this.horaCitaP ==
                        "None") {
                        this.horaCitaP = "";
                      }
                    }
                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == "null" || this.urgencia == undefined || this.urgencia == null || this
                      .urgencia == "None") {
                      this.urgencia = "No";
                    }
                  }

                }

              case 5:
                if (data[0] === null) {
                  // this.mensajeventa = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.usoventa = "";
                  this.urgencia = "No";
                } else {
                  if (data) {
                    /*this.mensajeventa = data[0].Details;
                    if (this.mensajeventa == "Escribe aquí..." || this.mensajeventa ==
                      "" || this.mensajeventa == null || this.mensajeventa == "null" || this.mensajeventa == undefined || this.mensajeventa ==
                      "None") {
                      this.mensajeventa = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.usoventa = data[0].Usage;
                    if (this.usoventa == null || this.usoventa == "null" || this.usoventa == undefined || this.usoventa == "None") {
                      this.usoventa = "";
                    } else if (this.usoventa == "0") {
                      this.usoventa = "Uso personal";
                    } else if (this.usoventa == "1") {
                      this.usoventa = "Mi empresa";
                    }
                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == "null" || this.urgencia == undefined || this.urgencia == null || this
                      .urgencia == "None") {
                      this.urgencia = "No";
                    }
                  }
                }
              case 6:
                if (data[0] === null) {
                  // this.mensajerestaurante = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.fechaCitarestaurante = "";
                  this.personasrestaurante = "";
                  this.horaCitarestaurante = "";
                } else {
                  if (data) {
                    /*this.mensajerestaurante = data[0].RestaurantUsage;
                    if (this.mensajerestaurante == "Escribe aquí..." || this.mensajerestaurante == "" ||
                      this.mensajerestaurante == null || this.mensajerestaurante == "null" || this.mensajerestaurante == undefined || this.mensajerestaurante == "None") {
                      this.mensajerestaurante = "";
                    }*/

                    this.mensaje = data[0].RestaurantUsage;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    if (data[0].Date) {
                      this.fechaCitarestaurante = data[0].Date.substring(0, 10);
                      if (this.fechaCitarestaurante == " " || this.fechaCitarestaurante == "null" || this.fechaCitarestaurante == undefined || this.fechaCitarestaurante == null ||
                        this.fechaCitarestaurante == "None") {
                        this.fechaCitarestaurante = "";
                      }
                    }
                    if (data[0].Time) {
                      this.horaCitarestaurante = data[0].Time.substring(11, 16);
                      if (this.horaCitarestaurante == " " || this.horaCitarestaurante == "null" || this.horaCitarestaurante == undefined || this.horaCitarestaurante == null || this
                        .horaCitarestaurante == "None") {
                        this.horaCitarestaurante = "";
                      }
                    }

                    this.personasrestaurante = data[0].BookingFor;
                    if (this.personasrestaurante == " " || this.personasrestaurante == "null" || this.personasrestaurante == undefined || this.personasrestaurante == null || this
                      .personasrestaurante == "None") {
                      this.personasrestaurante = "";
                    }
                  }
                }
              case 7:
                if (data[0] === null) {
                  // this.mensajehotel = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.personashotel = "";
                  this.hotelEntrada = "";
                  this.hotelSalida = "";
                } else {
                  if (data) {
                    /*this.mensajehotel = data[0].HotelUsage;
                    if (this.mensajehotel == "Escribe aquí..." || this.mensajehotel == "" ||
                      this.mensajehotel == null || this.mensajehotel == "null" || this.mensajehotel == undefined || this.mensajehotel == "None") {
                      this.mensajehotel = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].HotelUsage;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }

                    if (data[0].CheckIn) {
                      this.hotelEntrada = data[0].CheckIn.substring(0, 10);
                      if (this.hotelEntrada == "null" || this.hotelEntrada == null || this.hotelEntrada == undefined || this.hotelEntrada == "None") {
                        this.hotelEntrada = "";
                      }
                    }
                    if (data[0].CheckOut) {
                      this.hotelSalida = data[0].CheckOut.substring(0, 10);
                      if (this.hotelSalida == "null" || this.hotelSalida == null || this.hotelSalida == undefined || this.hotelSalida == "None") {
                        this.hotelSalida = "";
                      }
                    }
                    this.personashotel = data[0].BookingFor;
                    if (this.personashotel == " " || this.personashotel == "null" || this.personashotel == null || this.personashotel == undefined || this
                      .personashotel == "None") {
                      this.personashotel = "";
                    }
                  }
                }
              case 8:
                if (data[0] === null) {
                  // this.mensajeinmobiliaria = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.fechaCitainmobiliaria = "";
                  this.edadinmobiliaria = "";
                  this.horaCitainmobiliaria = "";
                  this.personasinmobiliaria = "";
                  this.urgencia = "No";
                } else {
                  if (data) {
                    /*this.mensajeinmobiliaria = data[0].Details;
                    if (this.mensajeinmobiliaria == "Escribe aquí..." || this.mensajeinmobiliaria == "" ||
                      this.mensajeinmobiliaria == null || this.mensajeinmobiliaria == "null" || this.mensajeinmobiliaria == undefined || this.mensajeinmobiliaria == "None") {
                      this.mensajeinmobiliaria = this.leadActual.MENSAJE;
                    }*/

                    this.mensaje = data[0].Details;
                    if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                      this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                      this.mensaje = this.leadActual.MENSAJE;
                    }
                    this.personasinmobiliaria = data[0].BookingFor;
                    if (this.personasinmobiliaria == " " || this.personasinmobiliaria == "null" || this.personasinmobiliaria == undefined || this.personasinmobiliaria == null || this
                      .personasinmobiliaria == "None") {
                      this.personasinmobiliaria = "";
                    }
                    this.edadinmobiliaria = data[0].Age;
                    if (this.edadinmobiliaria == "null" || this.edadinmobiliaria == null || this.edadinmobiliaria == undefined || this.edadinmobiliaria == "None") {
                      this.edadinmobiliaria = "";
                    }
                    if (data[0].Date) {
                      this.fechaCitainmobiliaria = data[0].Date.substring(0, 10);
                      if (this.fechaCitainmobiliaria == " " || this.fechaCitainmobiliaria == "null" || this.fechaCitainmobiliaria == undefined || this.fechaCitainmobiliaria == null ||
                        this.fechaCitainmobiliaria == "None") {
                        this.fechaCitainmobiliaria = "";
                      }
                    }
                    if (data[0].Time) {
                      this.horaCitainmobiliaria = data[0].Time.substring(11, 16);
                      if (this.horaCitainmobiliaria == " " || this.horaCitainmobiliaria == "null" || this.horaCitainmobiliaria == undefined || this.horaCitainmobiliaria == null || this
                        .horaCitainmobiliaria == "None") {
                        this.horaCitainmobiliaria = "";
                      }
                    }
                    this.urgencia = data[0].Urgency;
                    if (this.urgencia == "0" || this.urgencia == "null" || this.urgencia == undefined || this
                      .urgencia == "None") {
                      this.urgencia = "No";
                    }
                  }
                }
              case 9:
                if (data[0] === null) {
                  // this.mensajeMailing = this.leadActual.MENSAJE;
                  this.mensaje = this.leadActual.MENSAJE;
                  this.frecuencia = "";
                  this.uso = "";
                  this.urgencia = "No";
                } else {
                  /*this.mensajeMailing = data[0].Details;
                  if (this.mensajeMailing == "Escribe aquí..." || this.mensajeMailing == "" ||
                    this.mensajeMailing == null || this.mensajeMailing == undefined || this.mensajeMailing == "null" || this.mensajeMailing == "None") {
                    this.mensajeMailing = this.leadActual.MENSAJE;
                  } else {
                    this.mensaje = this.leadActual.MENSAJE;
                  }*/

                  this.mensaje = data[0].Details;
                  if (this.mensaje == "Escribe aquí..." || this.mensaje == "" ||
                    this.mensaje == null || this.mensaje == undefined || this.mensaje == "null" || this.mensaje == "None") {
                    this.mensaje = this.leadActual.MENSAJE;
                  }
                  this.uso = data[0].Usage;
                  if (this.uso == "null" || this.uso == "None" || this.uso == undefined || this.uso == null) {
                    this.uso = "";
                  } else if (this.uso == "0") {
                    this.uso = "Uso personal";
                  } else if (this.uso == "1") {
                    this.uso = "Mi empresa";
                  }
                  this.frecuencia = data[0].Frequency;
                  if (this.frecuencia == "null" || this.frecuencia == "None" || this.frecuencia == undefined || this.frecuencia == null) {
                    this.frecuencia = "";
                  }
                  this.urgencia = data[0].Urgency;
                  if (this.urgencia == "0" || this.urgencia == "null" || this
                    .urgencia == "None" || this.urgencia == null || this
                      .urgencia == undefined) {
                    this.urgencia = "No";
                  }
                }

            }
          }

      }, err => {

      });
    });
  }

  public changeLike(classification: string, lead) {

    switch (classification) {
      case 'L': {
        this.leadActual.calificaLead = 'true';
        this.califica = 'l';
        this.leadActual.calificaLead = 'like';
        break;
      }
      case 'DL': {
        this.leadActual.calificaLead = 'false';
        this.califica = 'd';
        this.leadActual.calificaLead = 'dislike';
        break;
      }
      default:
        this.califica = null;
        lead.calificaLead = 'vacio'
    }

    const body = {
      clave: this.leadActual.clave,
      classification: this.califica
    }

    this.http.get(this.apiUrl + "/calificaLead2/" + body.clave + '/' + body.classification + '/app')
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
      },
      err => {
          // console.log("Error occured");
      });
  }

  public changeLikeChat(classification: string, lead) {

    switch (classification) {
      case 'L': {
        this.leadActual.calificaLead = 'true';
        this.califica = 'l';
        this.leadActual.calificaLead = 'like';
        break;
      }
      case 'DL': {
        this.leadActual.calificaLead = 'false';
        this.califica = 'd';
        this.leadActual.calificaLead = 'dislike';
        break;
      }
      default:
        this.califica = null;
        lead.calificaLead = 'vacio'
    }

    const body = {
      clave: this.leadActual.clave,
      classification: this.califica
    }

    this.http.get(this.apiUrl + "/calificaLead2/" + body.clave + '/' + body.classification + '/appchat')
      .subscribe(data => {
        this.calificacion = data[0].calificaLead;
      },
      err => {
          // console.log("Error occured");
      });
  }

  public changeLikeToggle() {
    if (this.leadActual.calificaLead === 'like') {
      this.changeLikeChat('DL', this.leadActual);
    } else {
      this.changeLikeChat('L', this.leadActual);
    }
  }

  public getUrlAudio() {
    this.http.get(this.apiUrl + '/getUrlAudio/' + this.leadActual.clave).subscribe(data => {
      this.audio = data;

      for (let k in this.audio) {
        if (this.audio.length > 0) {
          this.url = this.audio[k].recordingsid;
          this.mostrar = this.audio[k].CallStatus;
          this.urlaudio = 'https://storage.googleapis.com/audios-call-tracking/' + this.url + '.mp3';
          if (this.url == null) {
            this.url = 'sinaudio';
          }
        } else {
          this.audio = 'sinaudio';
        }
      }
    });
  }

  public getInsertClickLlamar() {
    const usuario = this.leadActual.ID;
    const id = this.leadActual.clave;
    const acceso = 'App';
    if (this.platform.is('ios')) {
      this.dispositivo = 'ios';
    } else if (this.platform.is('android')) {
      this.dispositivo = 'android';
    }
    // console.log(usuario, this.dispositivo, acceso, id);
    this.provedor.getInsertClickLlamar(usuario, id, acceso, this.dispositivo).then((data) => {
      this.datosenvio = data;
    }, (err) => {
      // console.log('error');
    });
  }

  startAudio() {
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log() },
      errorCallback: () => { console.log() },
      initFullscreen: false,
    }
    // // console.log(this.urlaudio);
    this.streamingMedia.playAudio(this.urlaudio, options);
  }

  stopAudio() {
    this.streamingMedia.stopAudio();
  }

  chooseFile() {

    (async () => {
      const file = await (<any>window).chooser.getFile("");
      var formData = new FormData();
      var blob = new Blob([file.data], { type: file.mediaType });
      formData.append(file.name, blob, file.name);
      this.chatService.tc.currentChannel.sendMessage(formData).then(() => {
        this.chatService.tc.currentChannel.getMessages().then((messagesPaginator) => {
          const message = messagesPaginator.items[messagesPaginator.items.length - 1];
          if (message.type === 'media') {
            // console.log('Media attributes', message.media);
            message.media.getContentUrl().then((url) => {
              this.http.post('https://koomkin.com.mx/call-tracking/api/twilio-media-message', { channelsid: this.chatService.tc.currentChannel.sid, url: url, mime: file.mediaType, filename: file.name })
                .subscribe(data => {
                  //alert('enviado a whatsapp'+ JSON.stringify(data));
                }, err => {
                  //alert('not good '+ JSON.stringify(err));
                });
            });
          }
        });
      });
    })();
  }

  openFile(url, contentType) {

    let loading = this.loadingCtrl.create({
      content: 'Cargando archivo multimedia...'
    });

    loading.present().then(() => {
      this.fileOpener.open(url['__zone_symbol__value'], contentType
      ).then(() => {
        loading.dismiss();
      }).catch(e => {
        loading.dismiss();
      });
    }).catch((err) => {

    });

  }

  launch(url) {
    this.platform.ready().then(() => {
      cordova.InAppBrowser.open(url, "_system", "location=no");
    });
  }

  getRazones() {
    this.provedor.getReasons().then(
      data => {
        let razones = data;
        this.razones = razones;
        // console.log(this.razones);
      },
      err => {
        // console.log('error');
      }
    );
  }

  getComentarios() {
    this.provedor.getComments(this.leadActual.clave).then(
      data => {
        let comentarios = data;
        this.comentarios = comentarios;
        // console.log(this.comentarios);
      },
      err => {
        // console.log('error');
      }
    );
  }

  public btnDeleteComentario(idComentario) {
    swal({
      title: '¿Estás seguro que deseas eliminar este comentario?',
      showCancelButton: true,
      confirmButtonColor: '#288AC1',
      cancelButtonColor: '#2AB4BC',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if (result.value) {
        this.deleteComentario(idComentario);
      }
    });
  }

  public deleteComentario(idComentario) {

    const body = new URLSearchParams();
    body.set('idComentario', idComentario);

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'https://www.koomkin.com.mx/api/app/deleteComment/';

    return new Promise((resolve, reject) => {
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          console.log(data);
        },
        err => {
          return reject(err);
        }
      );
    });
  }

  openModal(tipo,clasificaLead,idComentario,comentario) {
    const myModal = this.modal.create(
      "ModalComentariosPage",
      { tipo: tipo, leadActual: this.leadActual, clasificaLead: clasificaLead, idComentario: idComentario, comentario: comentario},
      { enableBackdropDismiss: false, cssClass: "Modal-comentario" }
    );
    myModal.present();
    myModal.onDidDismiss(() => { });
  }

  getScheduled() {
    this.provedor.getScheduled(this.leadActual.clave).then(
      data => {
        let scheduledAt = data;
        this.scheduledAt = scheduledAt;
        // console.log(this.razones);
      },
      err => {
        // console.log('error');
      }
    );
  }

}

