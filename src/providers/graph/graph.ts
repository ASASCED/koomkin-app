import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class GraphProvider {
  // private url = "http://192.168.0.173:5010/";
  private url = "https://www.koomkin.com.mx/api/quotation_bot/";

  constructor(public http: Http) {
    console.log("Hello GraphProvider Provider");
  }

  postGraph(id: number, obj: any) {
    return this.http.post(`${this.url}updateQuotationBot`, {
      user_id: id,
      record: obj,
    });
  }

  getGraph(id: number): Observable<any> {
    return this.http.get(`${this.url}getQuotationBot`, {
      params: {
        user_id: id,
      },
    });
  }

  postTriggerQuotationBot(id: number) {
    return this.http.post(`${this.url}triggerQuotationBot`, {
      user_id: id,
    });
  }

  postStatusBot(id: number, status: number) {
    return this.http.post(`${this.url}setQuotationBotStatus`, {
      user_id: id,
      status: status,
    });
  }

  getStatusBot(id: number) {
    return this.http.get(`${this.url}getQuotationBotStatus`, {
      params: {
        user_id: id,
      },
    });
  }
}
