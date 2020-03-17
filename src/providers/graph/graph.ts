import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class GraphProvider {
  private url = "http://192.168.0.173:5010/";

  // TODO: user_id & status

  constructor(public http: Http) {
    console.log("Hello GraphProvider Provider");
  }

  upGraph(id: number, obj: Object) {
    return this.http.post(`${this.url}updateQuotationBot`, {
      user_id: id,
      record: obj
    });
  }

  getGraph(id: number): Observable<any> {
    return this.http.get(`${this.url}getQuotationBot`, {
      params: {
        user_id: id
      }
    });
  }
}
