import { Component } from '@angular/core';
import { Header } from '../header/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/api/users';
import { FormsModule } from '@angular/forms';
import { UsersGetRes } from '../../model/user_get_res';

@Component({
  selector: 'app-registerpage',
  standalone: true,
  imports: [
    Header,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './registerpage.html',
  styleUrl: './registerpage.scss',
})
export class Registerpage {
  

  constructor(private userService: UsersService, private router: Router,) {}
  userGet:UsersGetRes[] =[];

 
  username: string = '';
  email: string = '';
  password: string = '';
  wallet_balance:number =0;
  role: number = 1;

  async onSingUp() {
  try {
     if (!this.username || !this.email || !this.password) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

     const newUser = await this.userService.createUser(this.username,this.email,this.password,this.wallet_balance,this.role);

      alert('สมัครสมาชิกสำเร็จ!');
      this.router.navigate(['/loginpage'])
  } catch (error) {
      console.error('Registration failed:', error);
     alert('สมัครสมาชิกไม่สำเร็จ');
  }
     
  }
 
}
