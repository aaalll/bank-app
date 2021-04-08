import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BankService {
  API_URL: string = "https://2c2p.mocklab.io/v1/banks";

  constructor(private httpClient: HttpClient) { }

  getBank(productId) {
    return this.httpClient.get(`${this.API_URL}/${productId}`)
  }

  getBankList(page: number = 0) {
    const requestUrl =
      `${this.API_URL}?page=${page + 1}`;

    return this.httpClient.get(requestUrl);
  }
  createBank(bankData){
    // return this.httpClient.post(this.API_URL, bankData);
    const newBank = {
      "bankCode": bankData.bankCode,
      "bankName": bankData.bankName,
      "bankURL": bankData.bankURL,
    }
    return this.httpClient.post(this.API_URL, newBank);
  }
  updateBank(bankData){
    const bankCode = bankData.bankCode
    const newBank = {
      "bankCode": bankData.bankCode,
      "bankName": bankData.bankName,
      "bankURL": bankData.bankURL,
    }
    const requestUrl = `${this.API_URL}/${bankCode}`
    // delete bankData.bankCode
    // return this.httpClient.put(requestUrl, bankData);
    return this.httpClient.put(requestUrl, newBank);
  }
}