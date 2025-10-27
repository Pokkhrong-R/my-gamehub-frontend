import { Component, OnInit } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatFormField } from '@angular/material/input';
import { MatCardContent,MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Header } from "../header/header";
import { NgFor,CommonModule } from '@angular/common';
import { AuthService } from '../../services/api/auth';
import { TranSactionService } from '../../services/api/trans';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-top-up',
templateUrl: './topup-page.html',
  styleUrl: './topup-page.scss',
  imports: [MatInputModule, MatFormField, MatCardContent, MatCard, FormsModule, Header, NgFor,CommonModule]
})
export class TopupPage  {

  presetAmounts: number[] = [100, 300, 500, 1000, 1500];
  selectedAmount: number | null = null;
  userId: number | null = null;
  constructor(private authService:AuthService,private transService:TranSactionService,private activeRoute:ActivatedRoute,private router:Router) {}

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  
  ngOnInit(): void {
    
    const idFromUrl = this.activeRoute.snapshot.paramMap.get('id');
    if (idFromUrl) {
      this.userId = Number(idFromUrl);
      console.log(`Component นี้ถูกสร้างขึ้นเพื่อเติมเงินให้ User ID: ${this.userId}`);
    } else {
      console.error('ไม่พบ User ID ใน URL');
   
      this.router.navigate(['/user/home']);
    }
  }
  
  async performTopUp(): Promise<void> {
    if (this.userId && this.selectedAmount && this.selectedAmount > 0) {
      try {
      
        await this.transService.createTopup(this.userId,this.selectedAmount);

      console.log(`กำลังดำเนินการเติมเงินจำนวน: ${this.selectedAmount} บาท`);
      alert(`ดำเนินการเติมเงิน ${this.selectedAmount} บาท สำเร็จ!`);
      } catch (error) {
         console.error('กรุณาเลือกหรือระบุจำนวนเงินที่ถูกต้อง');
      alert('กรุณาระบุจำนวนเงินที่ต้องการเติม');
      }
    }
  }
}