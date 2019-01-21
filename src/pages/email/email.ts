import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from './../../providers/rest/rest';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatServiceProvider } from "../../providers/chat-service/chat-service";

@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html'
})
export class EmailPage implements OnInit {
  public vista;
  public saludo;
  public slogan;
  public id;
  public email;
  public datos;
  public pdf;
  public facebook;
  public instagram;
  public linkedIn;
  public web;
  public twitter;
  apiUrl3 = 'http://18.235.164.159/call-tracking/api/v1/mailing/';
  channelsidaux = 'CHbc465fbe83434937b7382db97e8896b1';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: RestProvider,
    public authService: AuthServiceProvider,
    public http: HttpClient,
    public chatService: ChatServiceProvider,

  ) {
    this.id = this.authService.id;
    this.email = this.authService.email;
    this.pdf = this.id + '.pdf';
  }

  ngOnInit() {
    this.vista = 'informacion';
    this.getMailCliente(this.id);
  }

  changePage(pagina) {
    this.vista = pagina;
  }

  copiarAlPortapapeles(id_elemento) {
    const aux = document.createElement('input');
    aux.setAttribute('value', document.getElementById(id_elemento).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
  }

  getMailCliente(idUsuario) {
    this.provedor.getMailCliente(idUsuario).then(
      data => {
        this.datos = data;
        console.log(this.datos);
        if (this.datos) {
          this.facebook = this.datos[0].facebook;
          this.instagram = this.datos[0].instagram;
          this.linkedIn = this.datos[0].linkedin;
          this.web = this.datos[0].web;
          this.twitter = this.datos[0].twitter;
          this.saludo = this.datos[0].SaludoCorreo;
          this.slogan = this.datos[0].Slogan;

          if (this.facebook == null || this.facebook == '') {
            this.facebook = 'No cuento con esta red';
          } 
          
          if (this.instagram == null || this.instagram == '') {
            this.instagram = 'No cuento con esta red';
          } 
          
          if (this.linkedIn == null || this.linkedIn == '') {
            this.linkedIn = 'No cuento con esta red';
          } 
          
          if (this.web == null || this.web == '') {
            this.web = 'No cuento con esta red';
          } 
          
          if (this.twitter == null || this.twitter == '') {
            this.twitter = 'No cuento con esta red';
          }
          
        }
      },
      err => {
        //   console.log('error');
       
      }
    );
  }

  changeInfo() {
    console.log('entro');

    const body = new URLSearchParams();
    body.set('id_usuario', this.id);
    body.set('saludo', this.saludo);
    body.set('instagram', this.instagram);
    body.set('facebook', this.facebook);
    body.set('web', this.web);
    body.set('linkedin', this.linkedIn);
    body.set('twitter', this.twitter);
    body.set('tipo', '1');

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      )
    };

    const url = 'http://18.235.164.159/call-tracking/api/v1/mailing/';
    console.log(url, body.toString(), options);
      this.http.post(url, body.toString(), options).subscribe(
        data => {
          console.log(JSON.stringify(data));
          
        },
        err => {
          console.log(err);
        }
      );
  }

  chooseFile() {
    (async () => {
      const file = await (<any>window).chooser.getFile('application/pdf');
      var formData = new FormData();
      var blob = new Blob([file.data],{type: file.mediaType});
      formData.append(file.name,blob,file.name);

     const headers = {
       headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
     };

     this.http.post(this.apiUrl3, formData, headers).subscribe(data => {
         console.log(data);
       },
       err => {
         console.log('Error', err);
       }
     );
    })();
  }

  chooseFile2(){

    this.chatService.connectAuxiliarChannel().then(()=>{

      (async () => {
        const file = await (<any>window).chooser.getFile('application/pdf');
        var formData = new FormData();
        var blob = new Blob([file.data],{type: file.mediaType});
        formData.append(file.name,blob,file.name);
        this.chatService.tc.currentChannel.sendMessage( formData ).then((message)=>{
  
          this.chatService.tc.currentChannel.getMessages().then((messagesPaginator)=> {

            const message = messagesPaginator.items[messagesPaginator.items.length-1];
            if (message.type === 'media') {
              console.log('Media attributes', message.media);
              message.media.getContentUrl().then((url)=>{
                const httpOptions = {
                  headers: new HttpHeaders({
                    "Content-Type": "application/x-www-form-urlencoded",
                  })
                };
                this.http.post(this.apiUrl3, { nombre_archivo: this.pdf , url_archivo: url }, httpOptions)
                .subscribe(data => {
                  alert('enviado a whatsapp'+ JSON.stringify(data));
                }, err => {
                  alert('not good '+ JSON.stringify(err));
                  console.log(JSON.stringify(err));
                });
              });
            }
          });
  
        });
      })();

    });
    
  }
}