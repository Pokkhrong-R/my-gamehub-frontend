import { Component } from '@angular/core';
import { Header } from "../header/header";
import { CommonModule } from '@angular/common';
import { DiscountService } from '../../services/api/discount';
import { FormsModule } from '@angular/forms';
import { MatCard } from "@angular/material/card";
import { MatInput } from "@angular/material/input";
import { DiscountGetRes } from '../../model/discount_get_res';


@Component({
  selector: 'app-create-discount',
  standalone: true, // <-- เพิ่ม standalone: true (เพราะคุณใช้ imports)
  imports: [Header, CommonModule, FormsModule, MatCard, MatInput],
  templateUrl: './create-discount.html',
  styleUrl: './create-discount.scss'
})
export class CreateDiscount {

  discounts: DiscountGetRes[] = [];
  presetAmounts: number[] = [50, 100, 300, 500, 1000, 1500];
  selectedAmount: number | null = null;
  discountCode: string = '';
  discountMax: number | null = null; // <-- แนะนำให้ใช้ null เพื่อการตรวจสอบที่ง่ายขึ้น

  // --- (แนะนำ) เพิ่มตัวแปรสำหรับจัดการสถานะ UI ---
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  // ---------------------------------------------

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  constructor(private discountService: DiscountService) { }

  async onCreate() {
    // 1. รีเซ็ตข้อความสถานะ
    this.errorMessage = null;
    this.successMessage = null;

    // 2. ตรวจสอบข้อมูล (Validation)
    if (!this.discountCode || this.discountCode.trim() === '') {
      this.errorMessage = 'กรุณากรอกชื่อโค้ดส่วนลด';
      return; // หยุดทำงาน
    }
    if (!this.selectedAmount || this.selectedAmount <= 0) {
      this.errorMessage = 'กรุณากำหนดส่วนลด (ต้องมากกว่า 0)';
      return; // หยุดทำงาน
    }
    if (!this.discountMax || this.discountMax <= 0) {
      this.errorMessage = 'กรุณากำหนดจำนวนผู้ใช้สูงสุด (ต้องมากกว่า 0)';
      return; // หยุดทำงาน
    }

    // 3. เริ่มสถานะ Loading
    this.isLoading = true;

    try {
      console.log("Sending create discount request:", this.discountCode, this.selectedAmount, this.discountMax);

      // 4. เรียกใช้ Service (เรามั่นใจว่าค่าไม่เป็น null เพราะผ่านการตรวจสอบแล้ว)
      await this.discountService.createDiscount(
        this.discountCode,
        this.selectedAmount!,
        this.discountMax!
      );

      // 5. จัดการเมื่อสำเร็จ
      this.successMessage = "สร้างส่วนลดสำเร็จ!";
      console.log("Discount created successfully");
      alert(this.successMessage); // แสดงข้อความสำเร็จ

      // 6. (แนะนำ) ล้างฟอร์มหลังสร้างสำเร็จ
      // this.discountCode = '';
      // this.selectedAmount = null;
      // this.discountMax = null;

    } catch (err) {
      // 7. จัดการเมื่อเกิดข้อผิดพลาด
      this.errorMessage = 'เกิดข้อผิดพลาดในการสร้างส่วนลด';
      console.error('Error creating discount:', err);
    } finally {
      // 8. หยุดสถานะ Loading เสมอ (ไม่ว่าจะสำเร็จหรือล้มเหลว)
      this.isLoading = false;
    }
  }
}