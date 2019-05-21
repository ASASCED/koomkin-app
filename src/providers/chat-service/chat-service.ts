import { Injectable } from '@angular/core';
import { AlertController, LoadingController} from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { HTTP } from '@ionic-native/http'
import { Storage } from '@ionic/storage';
import { File } from "@ionic-native/file";

@Injectable()

export class ChatServiceProvider {

  public tc: any;
  public loading: boolean = false;
  public chatClientStarted = false;
  public msgList: ChatMessage[] = [];
  public accessManager: any;
  public loadingMessages;
  private msgListSource = new BehaviorSubject<any>(this.msgList);
  private loadingMessagesSource = new BehaviorSubject<any>(this.loading);
  loadingMessagesActualizado = this.loadingMessagesSource.asObservable();
  msgListActualizada = this.msgListSource.asObservable();
  MESSAGES_HISTORY_LIMIT = 50;

  constructor(private http: HttpClient,
              private http2: HTTP,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public sanitizer: DomSanitizer,
              public storage: Storage,
              public file:File
  ) {
    this.tc = {
      messagingClient: null,
      channelArray: [],
      generalChannel: null,
      currentChannel: null,
      messageList: [],
      username: null
    };
  }

  updateMsgList(data: any){
    this.msgListSource.next(data);
  }

  startChatService(uuid:string){
    this.connectClientWithUsername(uuid).then(()=>{
      this.chatClientStarted = true;
    }).catch(function(error) {
      // alert(error);
      // window.location.reload();
      // console.log(("connectclient" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
    });
  }

  connectClientWithUsername(username) {
    var self = this;
    if (username == '') {
      return;
    }
    self.tc.username = username;
    return self.fetchAccessToken(self.tc.username,self.connectMessagingClient.bind(self));
  }

  fetchAccessToken(username, handler) {
    console.log('fetchAccessToken');
    return new Promise((resolve, reject)=> {
      this.http.post('https://www.koomkin.com.mx/chat/token' , {device: "mobile", identity: username})
        .subscribe(data => {
          var token = data['token'];
          handler(token);
          return resolve();
        }, err => {
          // console.log(JSON.stringify(err));
          return reject(err);
        });
    });
  }

  connectMessagingClient(token) {
    var self = this;
    self.tc.messagingClient = new window["TwilioChat"].Client(token);
    self.accessManager = window["TwilioCommon"].AccessManager(token);
    return self.tc.messagingClient.initialize()
      .then(() => {
        this.chatClientStarted = true;
        self.tc.messagingClient.on('tokenExpired', ()=>{self.refreshToken()});
      }).catch(function(error) {
        // console.log(("" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
      });
  }

  refreshToken() {
    var self = this;
    self.fetchAccessToken(self.tc.username, self.setNewToken.bind(self));
  }

  setNewToken(token) {
    var self = this;
    self.accessManager.updateToken(token);
  }

  connectAuxiliarChannel(){
    return new Promise((resolve, reject) => {
      this.tc.messagingClient.getChannelByUniqueName('CHbc465fbe83434937b7382db97e8896b1').then((channel) => {
        this.joinChannel(channel).then(() => {
          this.tc.currentChannel.removeAllListeners();
          resolve();
        }).catch(error =>  { alert(error); reject(error)})
      });
    });
  }

  connectToChatChannel(channel_uniqueName: string) {
    // alert(channel_uniqueName);
    let self = this;
    this.updateMsgList([]);
    self.tc.messagingClient.getChannelByUniqueName(channel_uniqueName).then((channel) => {
      self.loadingMessagesSource.next(true);
      this.leaveCurrentChannel().then(() => {
        this.joinChannel(channel).then(() => {
          this.tc.currentChannel.removeAllListeners();
          self.tc.currentChannel.on('messageAdded', (message) => {
            if(self.tc.currentChannel.sid  === message.channel.sid){
              // console.log('message accepted');
              var mediaPromisesArray = []; // Arreglo de archivos media. Cuando cargan se guarda la conversacion.
              let messageGUI: ChatMessage;
              if(message.type === 'media'){
                if(message.attributes.file_url){
                  messageGUI = {
                    userId: message.author,
                    time: message.timestamp,
                    message: message.body,
                    type: message.type,
                    url: this.getAwsLeadImageUrl(message).then((url)=>{return url }).catch((url)=>{ return url}),
                    attributes: message.attributes,
                    contentType: message.attributes.mime,
                    filename: message.attributes.filename,
                    index: message.index,
                    channel: message.channel.sid
                  }
                }else{
                  messageGUI = {
                    userId: message.author,
                    time: message.timestamp,
                    message: message.body,
                    type: message.type,
                    url: this.getTwilioImageUrl(message).then((url) => {return url}).catch((url)=>{return url}),
                    attributes: message.attributes,
                    contentType: message.media.state.contentType,
                    filename: message.media.filename,
                    index: message.index,
                    channel: message.channel.sid
                  };
                }
                mediaPromisesArray.push(messageGUI.url);
              }else{
                messageGUI = {
                  userId: message.author,
                  time: message.timestamp,
                  message: message.body,
                  type: message.type,
                  url: null,
                  attributes: message.attributes,
                  contentType: null,
                  filename: null,
                  index: message.index,
                  channel: message.channel.sid
                };
              }

              this.storage.get(this.tc.currentChannel['sid']).then((data)=> {
                if(data){
                  var storedConversation = JSON.parse(data);
                  storedConversation.push(messageGUI);
                  Promise.all(mediaPromisesArray).then((values) => {
                    this.loadingMessagesSource.next(false);
                    this.storeConversation(storedConversation);
                  }).catch((reason) => {
                    // console.log(reason);
                    this.loadingMessagesSource.next(false);
                    this.storeConversation(storedConversation);
                  });
                }else{
                  this.msgListSource.next([messageGUI]);
                }
              }).catch(reason => { console.log(reason);this.msgListSource.next([messageGUI]);});
            }else{
              // console.log('message rejected')
            }
          });

          this.loadMessages('setupchannel');
        }).catch((error) => {
          self.loadingMessagesSource.next(false);
            });
      }).catch((error) => {
        self.loadingMessagesSource.next(false);
         });
    }).catch((error) => {
      self.loadingMessagesSource.next(false);
      });
  }

  joinChannel(_channel) {
    const self = this;
    return _channel.join().then((joinedChannel) => {
      self.tc.currentChannel = _channel;
      return joinedChannel;
    }).catch(function (error) {
      self.tc.currentChannel = _channel;
      return _channel;
    });
  }

  leaveCurrentChannel() {
    let self = this;

    if (this.tc.currentChannel) {
      return this.tc.currentChannel.leave().then((leftChannel) => {
        // this.longitudConversacionSource.next(0);
        leftChannel.removeListener('messageAdded', () => { console.log("leaving current channel") });

        return Promise.resolve();
      }).catch(function (error) {
        // console.log(('leave error' + JSON.stringify(error, Object.getOwnPropertyNames(error))));
      });
    } else {
      return Promise.resolve();
    }
  }

  loadMessages(fromstring: string): any {

    var mediaPromisesArray = []; // Arreglo de archivos media. Cuando cargan se guarda la conversacion.
    var arr : Array<ChatMessage> = []; // Arreglo de mensajes para mostrar en pantalla.
    var self = this;

    this.loadingMessagesSource.next(true); // Desactiva el spinner de cargar mensajes.

    this.storage.get(this.tc.currentChannel['sid']).then((data)=>{
      //// console.log(this.tc.currentChannel);
      if(data){
        var storedConversation = JSON.parse(data); // Conversacion guardada con sid del canal de twilio (local)
        arr = storedConversation;
        this.loadingMessagesSource.next(false);
        var last = arr[arr.length-1];
        var storedConversationSize = storedConversation.length;  // longitud de la conversación (local)
        var lastStoredMessageIndex = last['index'];
      } else{
      }

      self.tc.currentChannel.getMessages(self.MESSAGES_HISTORY_LIMIT).then((messages)=> { // Extraer mensajes del canal
        const totalMessages = messages.items.length; // Longitud de conversacion (remota)
        for (let i = 0; i < totalMessages; i++) {
          const message = messages.items[i];
          if(message.index in arr){
            continue;
          }

          if(data){
            if (message.index in arr) { // si ya esta el mensaje guardado
              continue; // Salta esta iteracion.
            } else{
              //alert('adding message');
            }
          }

          let messageGUI: ChatMessage;
          if (message.type === 'media') {
            if (message.attributes.file_url) {
              messageGUI = {
                userId: message.author,
                time: message.timestamp,
                message: message.body,
                type: message.type,
                url: this.getAwsLeadImageUrl(message).then((url)=>{return url }).catch((url)=>{ return url}),
                attributes: message.attributes,
                contentType: message.attributes.mime,
                filename: this.getFileName(message.attributes.file_url),
                index: message.index,
                channel: message.channel.sid
              }
            } else {
              messageGUI = {
                userId: message.author,
                time: message.timestamp,
                message: message.body,
                type: message.type,
                url: this.getTwilioImageUrl(message).then(url => {return url}),
                attributes: message.attributes,
                contentType: message.media.state.contentType,
                filename: message.media.state.filename,
                index: message.index,
                channel: message.channel.sid
              };
            }

            mediaPromisesArray.push(messageGUI.url);

          } else {
            messageGUI = {
              userId: message.author,
              time: message.timestamp,
              message: message.body,
              type: message.type,
              url: null,
              attributes: message.attributes,
              contentType: null,
              filename: null,
              index: message.index,
              channel: message.channel.sid
            };
          }
          arr.push(messageGUI);
        }

        Promise.all(mediaPromisesArray).then((values) => {
          this.storeConversation(arr);
          this.loadingMessagesSource.next(false);
        }).catch((reason) => {
          // console.log('No se pudieron cargar uno o más mensajes multimedia')
          // console.log(reason);
          this.loadingMessagesSource.next(false);
          this.storeConversation(arr);
        });

      }).catch((reason)=>{
        // console.log('no se pudieron cargar los mensaejes')
        // console.log(reason);
        this.loadingMessagesSource.next(false);
      });

    }).catch((reason => {
      // console.log('falla en ionic storage');
      // console.log(reason);
      this.loadingMessagesSource.next(false);
    }));
  }

  loadMessagesStorageless(fromstring: string): any {

    var arr : Array<ChatMessage>;
    arr = [];
    var self = this;

    if(fromstring === 'setupchannel'){
      this.loadingMessagesSource.next(true);
    }
    return self.tc.currentChannel.getMessages(self.MESSAGES_HISTORY_LIMIT).then( (messages)=> {
      if(fromstring === 'setupchannel'){
        this.loadingMessagesSource.next(false);
      }

      const totalMessages = messages.items.length;
      for (let i = 0; i < totalMessages; i++) { //iterar sobre mensajes
        const message = messages.items[i]; //Extrae mensaje
        let messageGUI: ChatMessage;
        if (message.type === 'media') {

          if (message.attributes.file_url) {

            messageGUI = {
              userId: message.author,
              time: message.timestamp,
              message: message.body,
              type: message.type,
              url: this.getAwsLeadImageUrl(message).then((url)=>{return url }).catch((url)=>{ return url}),
              attributes: message.attributes,
              contentType: message.attributes.mime,
              filename: this.getFileName(message.attributes.file_url),
              index: message.index,
              channel: message.channel.sid
            }

          } else {

            messageGUI = {
              userId: message.author,
              time: message.timestamp,
              message: message.body,
              type: message.type,
              url: this.getTwilioImageUrl(message).then(url => {return url}),
              attributes: message.attributes,
              contentType: message.media.state.contentType,
              filename: message.media.state.filename,
              index: message.index,
              channel: message.channel.sid

            };

          }

        } else {
          messageGUI = {
            userId: message.author,
            time: message.timestamp,
            message: message.body,
            type: message.type,
            url: null,
            attributes: message.attributes,
            contentType: null,
            filename: null,
            index: message.index,
            channel: message.channel.sid
          };
        }
        arr.push(messageGUI);
      }
      this.msgListSource.next(arr);
      return Promise.resolve(arr);
    }).catch(function(error) {
      if(fromstring === 'setupchannel'){
        this.loadingMessagesSource.next(false);
      }
      // console.log(('PROBLEM' +JSON.stringify(error, Object.getOwnPropertyNames(error))));
      return Promise.resolve(arr);
    });

  };

  storeConversation(messagesArr){

    var currentChannel = this.tc.currentChannel['sid'];
    var messagesChannel = messagesArr[0].channel;
    if(currentChannel === messagesChannel){

      this.storage.set(currentChannel, JSON.stringify(messagesArr)).then((data) => {
        this.msgListSource.next(JSON.parse(data));
        this.loadingMessagesSource.next(false);
      }).catch(reason => {
        //alert('message not saved');
        this.loadingMessagesSource.next(messagesArr);
        // console.log(reason);
        this.loadingMessagesSource.next(false);
      });
    }
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };


  mostrarAlertaEnviarSolicitudChat(messageTitle: string, messageSubTitle: string) {
    let alert = this.alertCtrl.create({
      title: messageTitle,
      subTitle: messageSubTitle,
      buttons: [
        {
          text: 'Enviar Solicitud',
          handler: data => {
          }
        }
      ]
    });
    alert.present();
  }

  getAwsLeadImageUrl(message){

    var url = message.attributes.file_url;
    var mime = message.attributes.mime;

    return new Promise((resolve, reject) => {
      if(mime.startsWith('image')||mime.startsWith('audio') ||mime.startsWith('video')|| mime.startsWith('application/pdf')){
        this.http2.downloadFile(url, {}, {},this.file.cacheDirectory + this.getFileName(url)).then((fileEntry)=> {
          message.url = Promise.resolve(fileEntry.toURL());
          resolve(fileEntry.toURL());
        });
      }else{
        resolve(url);
      }
    });
  }

  getTwilioImageUrl(message){

    var contentType = message.media.state.contentType;
    return new Promise((resolve, reject) => {
      message.media.getContentUrl().then((url) => {
        if(contentType.startsWith('image')||contentType.startsWith('audio') ||contentType.startsWith('video')|| contentType.startsWith('application/pdf')){
          var rutaArchivo = this.file.dataDirectory +Date.now()+'.'+this.getFileName(message.media.state.contentType);
          this.http2.downloadFile(url, {}, {},rutaArchivo).then((fileEntry)=> {
            //message.url = Promise.resolve(rutaArchivo);
            resolve(rutaArchivo);
          }).catch((reason)=>{
            //alert('wow');
            //alert(JSON.stringify(reason, Object.getOwnPropertyNames(reason)))
          });
        }else{
          resolve(url);
        }
      }).catch((error)=>{
        // console.log(error);
        reject(error);
      });
    });
  }

  getFileName(url){
    let fileName = url.substr(url.lastIndexOf('/')+1);
    return fileName
  }

}

export class ChatMessage {
  userId: string;
  time: number | string;
  message: string;
  type: string;
  url: any;
  attributes: any;
  contentType: any;
  filename: any;
  index: any;
  channel: any;
}