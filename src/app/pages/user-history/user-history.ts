import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { UsersService } from '../../services/api/users';
import { AuthService } from '../../services/api/auth';
import { UsersGetRes } from '../../model/user_get_res';
import { Constants } from '../../config/costants';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule, Header, FormsModule, RouterLink],
  templateUrl: './user-history.html',
  styleUrls: ['./user-history.scss'],
})
export class UserHistory {

  allUsers: UsersGetRes[] = [];
  filterUser: UsersGetRes [] = [];


  loading = false;
  error: string | null = null;
  // searchTerm = '';
  userId:number=0;
  apiUrl:string = '';
  keyword: any;
  key: any;

  constructor(private usersService: UsersService, private authService: AuthService,private constants:Constants) {
     this.apiUrl = this.constants.API_ENDPOINT;
  }

  async ngOnInit() {
  
      this.allUsers = await this.usersService.getAllUser();
      this.filterUser = this.allUsers;
    
  }

search(keyword: string) {
  const lowerKeyword = keyword.trim().toLowerCase();

  // ถ้าไม่พิมพ์อะไรเลย ให้แสดงทั้งหมด
  if (!lowerKeyword) {
    this.filterUser = this.allUsers;
    return;
  }

  this.filterUser = this.allUsers.filter(user =>
    user.username.toLowerCase().includes(lowerKeyword)
  );
}
  
}

