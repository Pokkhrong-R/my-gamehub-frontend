import { Component, OnInit } from '@angular/core';
import { Header } from "../header/header";
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { UsersGetRes } from '../../model/user_get_res';
import { UsersService } from '../../services/api/users';
import { NgIf,CommonModule } from "@angular/common";
import { AuthService } from '../../services/api/auth';
import { TranSactionService } from '../../services/api/trans';
import { TransactionGetRes } from '../../model/trans_get_res';


@Component({
  selector: 'app-transpage',
  imports: [Header, RouterLink, NgIf,CommonModule],
  templateUrl: './transpage.html',
  styleUrl: './transpage.scss'
})


export class Transpage implements OnInit{


isLoading: boolean = true;
errorMessage = '';

userGetRes: UsersGetRes |null=null;
trans:TransactionGetRes[] = [];
activeFilter: string = 'all';  
  userId?: number;

constructor(private activeRoute:ActivatedRoute,private userService:UsersService ,private router:Router,private authService:AuthService,private transService: TranSactionService) {}

ngOnInit(): void {
  this.loadUserProfile();
  this.loadMyTrans();
  }

  async loadUserProfile(): Promise<void> {
    try {
      const idFromUrl = this.activeRoute.snapshot.paramMap.get('id');
      if(idFromUrl){
            
          this.userId = Number(idFromUrl);
          console.error('user profile: ',this.userId);
          this.userGetRes = await this.userService.getProfile(this.userId);
      }else{
        console.error('user id not found in url.');
      }
    } catch (error) {
      console.error('failed to load user profile: ',error);
      this.errorMessage = 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้';
    } 
    finally {
      this.isLoading = false;
    }

    
  }

    async loadMyTrans() {
   
      if(this.userId){
         const response = await this.transService.getMyTrans(this.userId);
       
         this.trans = response.rows; 
       
      }
  
 

  }

 


  
onLogout() {
  
    this.authService.logout();
    this.router.navigate(['/loginpage']);
}
}