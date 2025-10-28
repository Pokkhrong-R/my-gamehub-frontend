import { Injectable } from '@angular/core';
import { Constants } from '../../config/costants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth';
import { lastValueFrom } from 'rxjs';
import { orderItem } from '../../model/orders_ges_res';
import { DiscountItem } from '../../model/discount_get_res';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private constants: Constants,
    private http: HttpClient,
    private authSerVice: AuthService
  ) {}

  /////////////////////////////////////////////
  public async getAllOnCart(userId: number) {
    const url = `${this.constants.API_ENDPOINT}/orders/onCart/${userId}`;
    try {
      const token = this.authSerVice.getToken();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      return await lastValueFrom(this.http.get(url, { headers }));
    } catch (err) {
      console.error('Orders failed:', err);
      throw err;
    }
  }

  //state = add cart
  public async getAddCart(gameId: number) {
    const url = `${this.constants.API_ENDPOINT}/orders/addCart/${gameId}`;
    try {
      const token = this.authSerVice.getToken();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      return await lastValueFrom(this.http.post(url, {}, { headers }));
    } catch (err) {
      console.error('Orders failed:', err);
      throw err;
    }
  }

  public async getCheckOrders(gameId: number, checked: boolean) {
    const url = `${this.constants.API_ENDPOINT}/orders/checkOrder/${gameId}`;
    const body = checked;
    try {
      const token = this.authSerVice.getToken();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      return await lastValueFrom(this.http.put(url, { checked }, { headers: headers }));
    } catch (err) {
      console.error('Orders failed:', err);
      throw err;
    }
  }

  public async removeItemFromCart(itemId: number): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/orders/removeItem/${itemId}`;
    try {
      const token = this.authSerVice.getToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      // ใช้ http.delete เพื่อเรียก API
      return await lastValueFrom(this.http.delete(url, { headers }));
    } catch (err) {
      console.error('Remove item failed:', err);
      throw err;
    }
  }
  //fetch discount by code
  
}
