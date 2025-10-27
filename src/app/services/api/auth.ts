import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject,lastValueFrom } from 'rxjs';


export interface UserModel{
  userId: number;
  name: string;
  email:string;
  profile_image:string;
  role:number;
  wallet_balance:number;
}

@Injectable({ providedIn: 'root' })
export class AuthService  {
  private API_URL = 'https://node-gamehub.onrender.com';
  public currentUser: UserModel | null = null;

private currentUserSubject = new BehaviorSubject<UserModel | null>(this.getCurrentUser());
public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router){
    this.currentUser = this.getCurrentUser();
  }

  public login(email: string, password: string){
    return lastValueFrom(this.http.post<any>(`${this.API_URL}/users/login`, { email, password }))
      .then(res => {
        if(res.token){
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.userData));
          this.currentUser = res.userData;
        }
        return res;
      });
  }

  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/homepage']);
      this.currentUserSubject.next(null);
  }

  
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getCurrentUser(): UserModel | null {
    const str = localStorage.getItem('currentUser');
    return str ? JSON.parse(str) : null;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get isAdmin(): boolean {
  return this.currentUser?.role === 0;
}

get isUser(): boolean {
  return this.currentUser?.role === 1;
}

getCurrentUserId(): number | null {
  return this.currentUser?.userId ?? null;
}

  // save token
  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }


  // save user info
  public setCurrentUser(user: UserModel): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
     this.currentUserSubject.next(user); // แจ้ง subscribers
  }





}
