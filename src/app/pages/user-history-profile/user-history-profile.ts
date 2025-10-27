import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/api/users';
import { UsersGetRes } from '../../model/user_get_res';
import { Header } from "../header/header";
import { TransactionGetRes } from '../../model/trans_get_res';
import { AuthService } from '../../services/api/auth';
import { TranSactionService } from '../../services/api/trans';
import { Constants } from '../../config/costants';
import { NgIf,NgForOf,CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-history-profile',
  imports: [Header, NgIf, NgForOf,CommonModule],
  templateUrl: './user-history-profile.html',
  styleUrl: './user-history-profile.scss',
})
export class UserHistoryProfile implements OnInit {
  
  
  
  isLoading: boolean = true;
  errorMessage = '';
  selectedFilter: string = 'all';

  user: UsersGetRes |null=null;
  trans:TransactionGetRes[] = [];
  filteredTransactions: any[] = [];
  activeFilter: string = 'all';  
  userId?: number;
  apiUrl = '';
  constructor(private activeRoute:ActivatedRoute,private userService:UsersService ,private router:Router,private authService:AuthService,private transService: TranSactionService,private constants:Constants) {
this.apiUrl = constants.API_ENDPOINT;
  }
  ngOnInit(): void {
  this.applyFilter();
   this.loadUserData();
   this.loadTransactionDat();
 
  }
        
setFilter(filter: string) {
  this.selectedFilter = filter;
  this.applyFilter();
}

  async loadUserData() {
   try {
      const idFromUrl = this.activeRoute.snapshot.paramMap.get('id');
      if(idFromUrl){
            
          this.userId = Number(idFromUrl);
          console.error('user profile: ',this.userId);
          this.user = await this.userService.getProfile(this.userId);
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

  
async loadTransactionDat() {
  if(this.userId){
     const response = await this.transService.getMyTrans(this.userId);
     this.trans = response.rows; 
     this.applyFilter();  // ⚡ เรียกตรงนี้หลังโหลดข้อมูล
  }
}



applyFilter() {
  if (this.selectedFilter === 'all') {
    this.filteredTransactions = this.trans;
  }
  else if (this.selectedFilter === 'deposit') {
    this.filteredTransactions = this.trans.filter(t => t.type === 1);
  } else if (this.selectedFilter === 'purchase') {
    this.filteredTransactions = this.trans.filter(t => t.type === 0);
  }
}
      
      
 
  }


