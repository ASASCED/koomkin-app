import { Injectable  } from '@angular/core';
import {AlertController, Events, LoadingController} from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject} from "rxjs";
import {LeadPage} from "../../pages/lead/lead";
import {take} from "rxjs/operator/take";
// import { LeadPage} from "../../pages/lead/lead";


@Injectable()


export class ChatServiceProvider {

  public chatClientStarted = false;

  loading: boolean = false;

  public msgList: ChatMessage[] = [];

  private msgListSource = new BehaviorSubject<any>(this.msgList);

  msgListActualizada = this.msgListSource.asObservable();


  private loadingMessagesSource = new BehaviorSubject<any>(this.loading);

  loadingMessagesActualizado = this.loadingMessagesSource.asObservable();

  indicadorLongitudConversacion = null;

  private longitudConversacionSource = new BehaviorSubject<any>(this.indicadorLongitudConversacion);

  longitudConversacion = this.longitudConversacionSource.asObservable();


  GENERAL_CHANNEL_UNIQUE_NAME = 'general';
  GENERAL_CHANNEL_NAME = 'General Channel';
  MESSAGES_HISTORY_LIMIT = 50;

  public tc: any;

  public accessManager: any;



  public loadingMessages;



  constructor(private http: HttpClient,
              private events: Events,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {

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
      //alert(error);
      window.location.reload();
      console.log(("connectclient" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
    });


  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  //getMsgList(): Observable<ChatMessage[]> {


  //  const msgListUrl = './assets/mock/msg-list.json';
   // return this.http.get<any>(msgListUrl).pipe(map(response => response.array));
  //}

  sendMsg(msg: ChatMessage) {
    this.mockNewMsg(msg);
    return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
      .then(() => this.mockNewMsg(msg));
  }

  getUserInfo(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: '140000198202211138',
      name: 'Luff',
      avatar: './assets/user.jpg'
    };
    return new Promise(resolve => resolve(userInfo));
  }



// ==========================================

  connectClientWithUsername(username) {
    var self = this;
    // var usernameText = $usernameInput.val();
    // $usernameInput.val('');
    if (username == '') {

      return;
    }
    self.tc.username = username;
    return self.fetchAccessToken(self.tc.username,self.connectMessagingClient.bind(self));
    //return Promise.resolve();
  }



  fetchAccessToken(username, handler) {

    return new Promise((resolve, reject)=> {


      this.http.post('http://www.koomkin.com:4835/token' , {device: "mobile", identity: username})
        .subscribe(data => {

          var token = data['token'];

          //alert(token);

          handler(token);

          return resolve();

        }, err => {


          console.log(JSON.stringify(err));
          return reject(err);

        });


    });


  }


  connectMessagingClient(token) {




    var self = this;
    // Initialize the IP messaging client
    self.tc.messagingClient = new window["TwilioChat"].Client(token);
    self.accessManager = window["TwilioCommon"].AccessManager(token);
    return self.tc.messagingClient.initialize()
      .then(() => {

        this.chatClientStarted = true;


        //self.accessManager.on('tokenExpired', function() {

          //window.location.reload();
          // get new token from AccessManager and pass it to the library instance
          //self.tc.messagingClient.updateToken(am.token);
        //});



        //accessManager.on('tokenUpdated', function(am) {
          // get new token from AccessManager and pass it to the library instance
        //  chatClient.updateToken(am.token);
        //});





        //this.updateConnectedUI();
        //this.loadChannelList(this.joinGeneralChannel.bind(this));
        //tc.messagingClient.on('channelAdded', $.throttle(tc.loadChannelList));
        //tc.messagingClient.on('channelRemoved', $.throttle(tc.loadChannelList));
        self.tc.messagingClient.on('tokenExpired', ()=>{self.refreshToken()});
        //this.joinChannel2("HEY HEY");
        // console.log("MessageList:  "+  JSON.stringify(this.tc.channelArray, this.getCircularReplacer()));
      }).catch(function(error) {
        console.log(("" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
      });
  }


  refreshToken() {
    var self = this;

    self.fetchAccessToken(self.tc.username, self.setNewToken.bind(self));
  }

  setNewToken(token) {
    var self = this;


    //if (typeof self.tc.messagingClient.updateToken === 'function'){


    //}else{



    //}


    //self.accessManager.on('tokenExpired', function() {
      // generate new token here and set it to the accessManager
      // const updatedToken = generateToken();
      self.accessManager.updateToken(token);
    //});

    window.location.reload();


    //self.tc.messagingClient.updateToken(token);

  }



  joinChannel2(channel_uniqueName){

    var self = this;

    //alert(channel_uniqueName);

    return self.tc.messagingClient.getChannelByUniqueName(channel_uniqueName).then((channelR)=>{

      //alert("success");


      return self.setupChannel(channelR).then(()=>{

        return Promise.resolve();

      }).catch(function(error) {
        console.log(("YOUR" +JSON.stringify(error, Object.getOwnPropertyNames(error))))
        return Promise.reject("problem setting channel 2");
      });



    }).catch(function(error) {

      //alert(("YOUR" +JSON.stringify(error, Object.getOwnPropertyNames(error))));

      return Promise.reject(error);
    });


  }


  setupChannel(channel) {

    // return Promise.resolve();


    return this.leaveCurrentChannel().then(()=>{
      this.joinChannel(channel).then(()=>{
        this.initChannelEvents();
        this.loadMessages("setupchannel");



      })
    })

    //  .then(()=> {

    //    return this.initChannel(channel);

    //  })
    //  .catch(function(error) {
    //    console.log(("" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
    //  })
    //  .then((_channel)=> {

    //    return this.joinChannel(_channel);
    //  }).catch(function(error) {
    //    console.log(("XXXXXXXXXXXXXXXXXXX" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
    //  }).then(()=>{

    //    return this.initChannelEvents()}).catch(function(error) {

    //   console.log(("" +JSON.stringify(error, Object.getOwnPropertyNames(error))))});
  }


  initChannel(channel) {

    //var selectedChannel = this.tc.channelArray.filter((channel)=> {
    //  return channel.uniqueName === "830B6F41-2A67-4891-8FAF-98FC2145202F";
    //})[0];

    return this.tc.messagingClient.getChannelBySid(channel.sid);
  }

  joinChannel(_channel) {


    var self = this;

    return _channel.join().then((joinedChannel)=> {


      //this.updateChannelUI(_channel);
      self.tc.currentChannel = _channel;
      //self.loadMessages();

      return joinedChannel;

    }).catch(function(error) {

      //console.log(("hello3" +JSON.stringify(error, Object.getOwnPropertyNames(error))));

      //this.updateChannelUI(_channel)
      self.tc.currentChannel = _channel;
      //self.loadMessages();

      return _channel;

    });


  }


  leaveCurrentChannel() {
    var self = this;


    if (this.tc.currentChannel) {
      return this.tc.currentChannel.leave().then((leftChannel)=> {
        // this.longitudConversacionSource.next(0);

        leftChannel.removeListener('messageAdded', ()=>{self.loadMessages("loading fromleavecurrentchannel")});
        // leftChannel.removeListener('typingStarted', this.loadMessages );
        //leftChannel.removeListener('typingEnded', this.hideTypingStarted);
        //leftChannel.removeListener('memberJoined', this.notifyMemberJoined);
        //leftChannel.removeListener('memberLeft', this.notifyMemberLeft);
        //return Promise.reject("WAT");
      }).catch(function(error) {

        console.log(("leave error" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
      });
    } else {

      return Promise.resolve();
    }
  }


  initChannelEvents() {

    var self = this;

    self.tc.currentChannel.on('messageAdded', ()=>{self.loadMessages("loading from innitchannelevents")});
    //this.tc.currentChannel.on('typingStarted', this.showTypingStarted);
    //this.tc.currentChannel.on('typingEnded', this.hideTypingStarted);
    //this.tc.currentChannel.on('memberJoined', this.notifyMemberJoined);
    //this.tc.currentChannel.on('memberLeft', this.notifyMemberLeft);
    // $inputText.prop('disabled', false).focus();
  }


  loadMessages(fromstring: string): any {

    // this.refreshToken();



    var arr : Array<ChatMessage>;
    arr = [];
    var self = this;

    // self.refreshToken


    if(fromstring === "setupchannel"){
      this.loadingMessagesSource.next(true);
    }


    return self.tc.currentChannel.getMessages(self.MESSAGES_HISTORY_LIMIT).then( (messages)=> {



      if(fromstring === "setupchannel"){

        this.loadingMessagesSource.next(false);

      }

      //messages.items.forEach(addMessageToList);

      //console.log("zzzzzzzzzzzz"+JSON.stringify(messages.items,this.getCircularReplacer()));



      const totalMessages = messages.items.length;


      //console.log("LLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOAAAAAAAAAAAADDDDDDDDDIIIIIIINNNNNNNNNNGGGGGGGGGG");

      //console.log("SIZE: "+ messages.items.length);

      //this.indicadorLongitudConversacion = messages.items.length;


      this.longitudConversacionSource.next(totalMessages);

      for (var i = 0; i < totalMessages; i++) {

        const message = messages.items[i];

        var messageGUI: ChatMessage;

        messageGUI = {
          messageId: "90",
          userId: message.author,
          userName: "",
          userAvatar: null,
          toUserId: null,
          time: message.timestamp,
          message: message.body,
          status: ""
        }

        arr.push(messageGUI);

        //msgList.push(messageGUI);

        // console.log("help" + JSON.stringify(messages.items[i],this.getCircularReplacer()));
        console.log(message.author);

      }

      console.log('Total Messages:' + totalMessages);

      // self.msgList = arr;

      this.msgListSource.next(arr);

      //self.scrollToBottom("loadmessages NEW");
      //self.content.scrollToBottom();
      // self.scrollToBottom("self");
      // this.scrollToBottom("this")
      return Promise.resolve(arr);

    }).catch(function(error) {

      if(fromstring === "setupchannel"){

        this.loadingMessagesSource.next(false);

      }

      console.log(("PROBLEM" +JSON.stringify(error, Object.getOwnPropertyNames(error))));

      //self.content.scrollToBottom(   "hey"  );
      return Promise.resolve(arr);
    });

  };

  addChannel(channel) {


    if (channel.uniqueName === this.GENERAL_CHANNEL_UNIQUE_NAME) {
      this.tc.generalChannel = channel;
    }
    /*
    //var rowDiv = $('<div>').addClass('row channel-row');
    rowDiv.loadTemplate('#channel-template', {
      channelName: channel.friendlyName
    });

    var channelP = rowDiv.children().children().first();

    rowDiv.on('click', selectChannel);
    channelP.data('sid', channel.sid);
    if (tc.currentChannel && channel.sid === tc.currentChannel.sid) {
      //tc.currentChannelContainer = channelP;
      channelP.addClass('selected-channel');
    }
    else {
      channelP.addClass('unselected-channel')
    }

    $channelList.append(rowDiv);

      */
  }


  actualizarmensajes(fromstring:string){

    var self = this;



    self.loadMessages("3").then((array)=>{

      self.msgList = array;
      //self.scrollToBottom("actualizarmensajes");


    }).catch(function(error) {
      console.log(("loadmessages" +JSON.stringify(error, Object.getOwnPropertyNames(error))));
    });






  }

  //showLoader() {
  //  this.loading = this.loadingCtrl.create({
  //    content: 'Cargando Mensajes...'
  //  });
  //  this.loading.present();

  //}


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
            //this.mandarSolicitudChat();
            //this.setStorage(this.leadActual.clave,Date.now()+ 1*1800000).then(()=>{

            //});

            // this.page='Lead';
          }
        }
      ]

    });
    alert.present();
  }



}

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}











