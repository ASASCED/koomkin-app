import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Payment } from '../../models/Payment';


@Injectable()
export class UserProvider {
  public apiUrl = 'http://www.koomkin.com:5545/';
  constructor(private httpClient: HttpClient) {

  }

  public userRequest(url: string): Promise<any> {
    return this.httpClient.get(this.apiUrl + url)
      .toPromise();
  }

  public fileRequest(url: string): Promise<any> {
    // console.log(this.apiUrl + url);
    return this.httpClient.get(this.apiUrl + url, this.options())
      .toPromise();
  }

  public updateUserData(url: string) {
    // console.log(this.apiUrl + url);
    return this.httpClient.put(this.apiUrl + url, {})
      .toPromise();
  }

  public options() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf'
      })
    };
  }

  public downloadInvoice(file: string, invoice: Payment) {
    try {
      const nombre = `${invoice.nombre_d} ${invoice.apaterno_d} ${invoice.amaterno_d}`;
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      /*pdfMake.createPdf(YOUR_DEFINITION_HERE).getBlob(buffer => {
        this.file.resolveDirectoryUrl(this.file.externalRootDirectory)
          .then(dirEntry => {
            this.file.getFile(dirEntry, 'test1.pdf', { create: true })
              .then(fileEntry => {
                fileEntry.createWriter(writer => {
                  writer.onwrite = () => {
                    this.fileOpener.open(fileEntry.toURL(), 'application/pdf')
                      .then(res => { })
                      .catch(err => {
                        const alert = this.alertCtrl.create({ message: err.message, buttons: ['Ok'] });
                        alert.present();
                      });
                  }
                  writer.write(buffer);
                })
              })
              .catch(err => {
                const alert = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
                alert.present();
              });
          })
          .catch(err => {
            const alert = this.alertCtrl.create({ message: err, buttons: ['Ok'] });
            alert.present();
          });
  
      });*/

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/pdf'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.FechaCorta}-${nombre}-${invoice.NombreMembresia}.pdf`;
      link.click();
    } catch (err) {
    }
  }

}
