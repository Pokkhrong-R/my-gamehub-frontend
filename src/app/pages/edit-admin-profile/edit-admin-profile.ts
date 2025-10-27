import { Component, OnInit } from '@angular/core';
import { Header } from "../header/header";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from '../../services/api/users';
import { UsersGetRes } from '../../model/user_get_res';
import { NgIf } from "@angular/common";
import { AuthService } from '../../services/api/auth';
import { Constants } from '../../config/costants';


@Component({
  selector: 'app-editprofile',
  imports: [Header, MatFormFieldModule, MatIconModule, MatInputModule, MatDividerModule, MatButtonModule, NgIf],
 templateUrl: './edit-admin-profile.html',
  styleUrl: './edit-admin-profile.scss'
})
export class EditAdminProfile implements OnInit {
 
   private selectedImage: File | null = null;
   userGet?: UsersGetRes | null;
   userId!: number;
   errorMessage: string = '';
   profileImage: string = '';
   username: string = '';
   email: string = '';
   newPassword: string = '';
   confirmNewPassword: string = '';
   isLoading: boolean = true;
    apiUrl : string = '';
   constructor(
     private router: Router,
     private userService: UsersService,
     private activeRoute: ActivatedRoute,
     private authService:AuthService,
     private constants:Constants
   ) {
     this.apiUrl = this.constants.API_ENDPOINT;
   }
 
   ngOnInit(): void {
     this.loadUserProfile();
   }
 
   async loadUserProfile(): Promise<void> {
     this.isLoading = true;
     try {
       const idFromUrl = this.activeRoute.snapshot.paramMap.get('id')!;
       if (idFromUrl) {
         const userId = Number(idFromUrl);
         this.userId = userId;
         const profileData = await this.userService.getProfile(userId);
         this.userGet = profileData;
         console.log(userId);
         if (profileData) {
           this.username = profileData.username;
           this.email = profileData.email;
           this.profileImage = profileData.profile_image;
           console.log('profileData: ', profileData);
         }
       } else {
         console.error('id not found in url');
       }
     } catch (error) {
       console.error('failed to load  edit user profile: ', error);
       this.errorMessage = 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้';
     } finally {
       this.isLoading = false;
     }
   }
   async saveProfile(): Promise<void> {
     if (this.newPassword || this.confirmNewPassword) {
       if (this.newPassword !== this.confirmNewPassword) {
         alert('รหัสผ่านไม่ตรงกัน โปรดตรวจสอบรหัสอีกครั้ง!');
         return;
       }
     }
 
     const formData = new FormData();
 
     formData.append('username', this.username);
     formData.append('email', this.email);
 
     if (this.newPassword) {
       formData.append('newPassword', this.newPassword);
     }
 
     if (this.selectedImage) {
       formData.append('profile_image', this.selectedImage, this.selectedImage.name);
     }
 
     try {
       const res = await this.userService.updateProfile(this.userId, formData);
       alert('แก้ไขข้อมูลเสร็จสิ้น!');
       this.router.navigate(['/admin/admin-profile', this.userId]);
     } catch (error) {
       console.error('เกิดข้อผิดพลาด: ', error);
       alert('การบันทึกล้มเหลว');
     }
   }
 
   onFileSelected(event: Event): void {
     const input = event.target as HTMLInputElement;
     if (input.files && input.files[0]) {
       this.selectedImage = input.files[0]; //save file
 
       const reader = new FileReader(); //preview
       reader.onload = (e) => {
         this.profileImage = reader.result as string;
       };
       reader.readAsDataURL(this.selectedImage);
     }
   }
   onImageError(event: Event) {
     (event.target as HTMLImageElement).src = 'assets/images/default-pfp.jpg';
   }
 
   cancel() {
     //  console.log('ยกเลิกการแก้ไขข้อมูล profile');
     this.router.navigate(['/admin/admin-profile', this.userId]);
   }
    onLogout() {
      this.authService.logout();
     this.router.navigate(['/loginpage']);
   }
 }
