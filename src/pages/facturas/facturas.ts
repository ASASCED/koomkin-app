import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,Platform } from 'ionic-angular';
import { FacturaPage } from '../factura/factura';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Payment } from '../../models/Payment';
import { UserProvider } from '../../providers/user/user';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})

export class FacturasPage implements OnInit {

  public empresa;
  public id;
  public userFiscal;

  public paymentData: Payment[];
  public invoiceData: Payment[];

  pdfObj = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    public authService: AuthServiceProvider,
    public userService: UserProvider,
    private platform: Platform,
    private file: File, 
    private fileOpener: FileOpener) {
    this.empresa = this.authService.empresa;
    this.id = this.authService.id;
  }

  ngOnInit() {

    this.getPaymentData();
    // TODO: obtener id real del cliente
    this.authService.getUserFiscalData(this.id)
      .then(data => {
        this.authService.setUserFiscal(data[0]);
        this.userFiscal = data[0];
        // console.log(this.userFiscal);
      });
  }

  public getPaymentData() {
    this.userService.userRequest('datosPagos?id=' + this.id)
      .then((payments: [Payment]) => {
        this.paymentData = payments;
        this.invoiceData = this.removeDuplicates(payments.filter(x => x.TieneFactura === '1'));
      })
      .catch(err => {
        console.error(err);
      });
  }

  public removeDuplicates(arr) {
    const filtrado = [];
    arr.forEach(function (itm) {
      let unique = true;
      filtrado.forEach(function (itm2) {
        if (itm.IDPago === itm2.IDPago) unique = false;
      });
      if (unique) filtrado.push(itm);
    });
    return filtrado;
  }

  navegarPagina() {
    this.navCtrl.push(FacturaPage);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FacturasPage');
  }

  mostrar_modal() {
    let modal = this.modalCtrl.create(FacturaPage);
    modal.present();
  }

  public onDownloadInvoice(invoice: Payment) {
    // console.log(invoice);
    const year = parseInt(invoice.Fecha[3], 10) < 8 ? 2 : 3;
    this.userService.fileRequest(`descargarFactura?uid=${invoice.uid}&v=${year}`)
      .then(file => {
       // this.userService.downloadInvoice(file, invoice);
        this.pdfObj = this.userService.downloadInvoice(file, invoice);
        // console.log('93',this.pdfObj);
        const date = new Date();
        const formatedDate = date.toISOString().split('T')[0];

        if (this.platform.is('cordova')) {
          // console.log(this.pdfObj);

          this.pdfObj.getBuffer((buffer) => {
            const utf8 = new Uint8Array(buffer);
            const binaryArray = utf8.buffer;
            const blob = new Blob([binaryArray], { type: 'application/pdf' });

            this.file.writeFile(this.file.dataDirectory, 'MIT_GENESYS_REPORT' + formatedDate + '.pdf', blob, { replace: true })
              .then(fileEntry => {
                this.fileOpener.open(this.file.dataDirectory + 'MIT_GENESYS_REPORT' + formatedDate + '.pdf', 'application/pdf')
              })
              .catch(err => {
                console.error(err)
              });
          })
        } else {
          // console.log('else',this.pdfObj);
          this.userService.downloadInvoice(file, invoice);
        }
      })
      .catch((err) => {
        // console.log('Error al descargar factura', err);
        this.userService.downloadInvoice(err.error.text, invoice);
      });
  }

}
