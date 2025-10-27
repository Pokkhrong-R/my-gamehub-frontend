import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Constants } from "../../config/costants";
import { UsersGetRes } from "../../model/user_get_res";
import { lastValueFrom } from "rxjs";
import { AuthService, UserModel } from "./auth";


@Injectable({
     providedIn:'root'
})
export class UsersService{
       
    
     constructor (private constants: Constants,private http:HttpClient ,private authService:AuthService) {}
   

     public async getAllUser (options?:any){
          const url = this.constants.API_ENDPOINT + '/users/';
          // const params = new HttpParams({ fromObject: options });
          const response = await lastValueFrom(this.http.get(url,));
          return response as UsersGetRes[];
     }

   
  public async getProfile(idx: number,): Promise<UsersGetRes|null> {
       
    const url = `${this.constants.API_ENDPOINT}/users/profile/${idx}`;
     const token = this.authService.getToken();
          if(!token){
               this.authService.logout();
               console.error('Authentication token not found!')
               return Promise.reject('Authentication token not found!');
          }
          const headers = new HttpHeaders({
               'Authorization': `Bearer ${token}`
               
          });
          

          console.log('Token from localStorage:', token);
    return lastValueFrom(this.http.get<UsersGetRes>(url,{headers}));//

  }

     //get Id
     public async getOneUser(id:number):Promise<UsersGetRes>{
          const url = `${this.constants.API_ENDPOINT}/users/${id}`;
          const response = await lastValueFrom(this.http.get(url));
          return response as UsersGetRes;
     }

     //get Name
     // public async getUserName(username:string,options?:any) {
     //      const url =  `${this.constants.API_ENDPOINT}/users/`;
     //      const response = await lastValueFrom(
     //           this.http.get(url, {params:{username:username,}})
     //      );
     //      return response as UsersGetRes;
     // }




     //for register user
    // Register
public async createUser(
  username: string,
  email: string,
  password: string,
  wallet_balance: number = 0,
  role: number = 1
): Promise<any> {
  const body = { username, email, password, wallet_balance, role };
  const url = `${this.constants.API_ENDPOINT}/users/register`;
  console.log("Sending register request:", body);

  try {
    const response = await lastValueFrom(this.http.post(url, body));
    console.log("Register success:", response);
    return response;
  } catch (error) {
    console.error("POST failed:", error);
    throw error; // important to throw
  }
}

// Login
public async login(email: string, password: string): Promise<any> {
  const body = { email, password };
  const url = `${this.constants.API_ENDPOINT}/users/login`;

  try {
    const response: any = await lastValueFrom(this.http.post(url, body));
    console.log("Login success:", response);

    // เก็บ token ลง localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}


     //search anything of users 
     async searchUser(keyword?: string){
          const url = this.constants.API_ENDPOINT + '/users/search';
          let params = new HttpParams();
          if(keyword){
               params = params.set('keyword',keyword);
          }

          const response = await lastValueFrom(this.http.get(url,{params:params}));
          return response;
     }

     //edit users
     public async updateProfile( userId:number,formData:FormData):Promise<any> {
          // const data = {id:userId,username: username,email: email,password: password,profile_image: profile_image,};
          const url =  `${this.constants.API_ENDPOINT}/users/${userId}`;
          // console.log(data);
          const token = this.authService.getToken();
          if(!token){
               return Promise.reject('No token found');
          }
          const headers = new HttpHeaders({
               'Authorization': `Bearer ${token}`
          });

         return lastValueFrom(this.http.put(url,formData,{headers:headers}));
        

     }

     //delete data in users
     public async Deleted(id:number):Promise<UsersGetRes| null>{
          const url = `${this.constants.API_ENDPOINT}/users/${id}`;
          const response = await lastValueFrom(this.http.delete(url));
          return response as UsersGetRes;
     }
          
          
}


