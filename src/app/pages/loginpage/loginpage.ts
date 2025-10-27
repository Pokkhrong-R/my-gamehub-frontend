import { Component, ViewChild} from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import { UsersService } from '../../services/api/users';
import { AuthService } from '../../services/api/auth'; 
import { Header } from '../header/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
   selector: 'app-loginpage',
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
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.scss',


})
export class Loginpage{
email?: string ;
password?: string;

@ViewChild('loginForm') loginForm!: NgForm;

  constructor(
    private usersService: UsersService,
    private authService: AuthService, 
    private router: Router           
  ) {}

  async onLogin() {
    if (this.loginForm.invalid) {
      console.log('Form is invalid')
      alert('กรุณากรอกข้อมูลให้ถูกต้อง')
      return;
    }

    try {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      

      const response = await this.usersService.login(email, password);

      this.authService.saveToken(response.token); 

      this.authService.setCurrentUser(response.user);
       
      const userRole = response.user.role;

      if(userRole === 0){
        this.router.navigate(['/admin/home']);
      }else if(userRole === 1){
        this.router.navigate(['/user/home'])
      }else{
        console.error('Unknow user role: ', userRole);
          this.router.navigate(['/'])
      }
    
        alert('เข้าสู่ระบบ สำเร็จแล้วว!');

    } catch (error) {
      console.error('Login failed in component:', error);
      alert('เข้าสู่ระบบ ไม่สำเร็จ!');
    }
  }
}