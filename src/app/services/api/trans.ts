import { Inject, Injectable } from '@angular/core';
import { Constants } from '../../config/costants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth';
import { lastValueFrom } from 'rxjs';
import { TransactionGetRes } from '../../model/trans_get_res';


@Injectable({
  providedIn: 'root',
})


export class TranSactionService {
  constructor(
    private constants: Constants,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public async getAllTransaction(options?:  {[param: string]: number | number | boolean;}): Promise<TransactionGetRes[]> {
    const url = this.constants.API_ENDPOINT + '/trans';
    const params = new HttpParams({ fromObject: options });
    const response = await lastValueFrom(this.http.get<TransactionGetRes[]>(url,{params}));
    return response;
  }

   public async getMyTrans(id:number): Promise<{rows:TransactionGetRes[]}> {
         
      const url = `${this.constants.API_ENDPOINT}/trans/mytrans/${id}`;
       const token = this.authService.getToken();
            if(!token){
                 this.authService.logout();
                 console.error('Authentication token not found!')
                 return Promise.reject('Authentication token not found!');
            }
            const headers = new HttpHeaders({
                 'Authorization': `Bearer ${token}`
            });
      return lastValueFrom(this.http.get<{rows:TransactionGetRes[]}>(url,{headers}));//
  
    }

  public async createTopup(userId: number, price: number): Promise<void> {

    const body = { price: price };
    const url = `${this.constants.API_ENDPOINT}/trans/topup/${userId}`;
    try {

          const response = await lastValueFrom(this.http.post(url, body));
          console.log('Top-up successful:', response);
    } catch (error) {
          console.error('Top-up failed:', error);
    }
  }


  
    public async createPayment(gameId:number): Promise<any> {
    const url = `${this.constants.API_ENDPOINT}/trans/pay/${gameId}`;
    try {
     
    const token = this.authService.getToken(); // สมมติว่ามีฟังก์ชันดึง token

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    return await lastValueFrom(this.http.post(url, {}, { headers: headers }));

    } catch (err) {
          console.error('Payment-up failed:', err);
          throw err;
    }
  }
}                  
