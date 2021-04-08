import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL: string = "https://2c2p.mocklab.io/v1/masterData/";

  constructor(private httpClient: HttpClient) { }

  getCounties() {
    return this.httpClient.get(this.API_URL + 'countries')
  }

  getCardScheme() {
    return this.httpClient.get(this.API_URL + 'schemes')
  }

  
}