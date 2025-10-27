import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public readonly API_ENDPOINT: string = 'http://localhost:3012'; //https://node-gamehub.onrender.com  ;http://localhost:3000
     static API_ENDPOINT: any;
                                          
}