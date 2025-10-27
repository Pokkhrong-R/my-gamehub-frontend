import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ต้องมีสำหรับ *ngIf, *ngFor
import { Header } from '../header/header'; // <-- Header
import { DiscountService } from '../../services/api/discount';
import { DiscountItem } from '../../model/discount_get_res'; // <-- Import Model
import { RouterLink } from '@angular/router';

// (Optional) Imports สำหรับ Material UI
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-show-all-discount',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    MatCardModule, // (Optional)
    MatProgressSpinnerModule, // (Optional)
    RouterLink // <-- สำหรับลิงก์ไปยังหน้าแก้ไข
  ],
  templateUrl: './show-all-discount.html',
  styleUrls: ['./show-all-discount.scss'],
})
export class ShowAllDiscount implements OnInit {
  // <-- ใช้ OnInit

  discounts: DiscountItem[] = []; // ตัวแปรสำหรับเก็บส่วนลดทั้งหมด
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private discountService: DiscountService) {}

  // ngOnInit คือฟังก์ชันที่จะรันอัตโนมัติ 1 ครั้ง เมื่อ component นี้ถูกโหลด
  ngOnInit(): void {
    this.loadDiscounts();
  }

  // สร้างฟังก์ชันสำหรับโหลดข้อมูล
  async loadDiscounts(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      // ▼▼▼ แก้ไข: เปลี่ยนชื่อฟังก์ชันที่เรียกใช้ ▼▼▼
      const response = await this.discountService.getAllDiscount(); // (จาก getAllDiscounts)
      // ▲▲▲ ▲▲▲
      // ▼▼▼ เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูล ▼▼▼
    console.log('Data from API:', response.discount);
      // บรรทัดนี้จะทำงานได้ถูกต้อง
      this.discounts = response.discount;
    } catch (err) {
      this.errorMessage = 'ไม่สามารถโหลดข้อมูลส่วนลดได้';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async onDelete(id: number, code: string): Promise<void> {
    // 1. ยืนยันก่อนลบ
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบส่วนลด "${code}"?`)) {
      return;
    }

    this.isLoading = true; // (Optional) แสดงสถานะโหลด
    try {
      // 2. เรียก Service (ใช้ชื่อใหม่)
      await this.discountService.deleteDiscount(id);
      
      // 3. ลบรายการออกจาก Array ในหน้าเว็บ (โดยไม่ต้องโหลดใหม่)
      this.discounts = this.discounts.filter(d => d.discount_id !== id);

    } catch (err) {
      this.errorMessage = 'เกิดข้อผิดพลาดในการลบ';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
}
