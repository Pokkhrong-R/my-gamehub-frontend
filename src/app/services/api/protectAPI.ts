import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../../config/costants';

@Injectable({ providedIn: 'root' })
export class ProtectedService {
  isLoggedIn: boolean = true;
  constructor(private http: HttpClient,private router:Router,private constants:Constants) {}
    //  const url = `${this.constants.API_ENDPOINT}`;
    // 


  getProtectedData() {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    const url = `${this.constants.API_ENDPOINT}/login`;
    return this.http.get(url, { headers });
  }

  getUserProfile() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  const url = `${this.constants.API_ENDPOINT}/users/`; 
  return this.http.get(url, { headers });
}

updateUserProfile(updatedData: any) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
 const url = `${this.constants.API_ENDPOINT}/users/`; 
  return this.http.put(url, updatedData, { headers });
}

logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  this.isLoggedIn = false;
  this.router.navigate(['/loginpage']);
}

}
