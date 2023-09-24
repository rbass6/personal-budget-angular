import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseURL: string = "http://localhost:3000";
  response: Observable<any> = new Observable<any>;

  constructor(private http: HttpClient) {
    this.response = this.getData();
  }

  getData(): Observable<any> {
    return this.http.get(this.baseURL + '/budget');
  }

  getResponse(): Observable<any> {
    return this.response;
  }
}
