import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { OrdersService } from '../../services/api/orders';
import { AuthService } from '../../services/api/auth';
import { FormsModule } from '@angular/forms';
import { DiscountService } from '../../services/api/discount';
import { DiscountItem } from '../../model/discount_get_res';
import { TranSactionService } from '../../services/api/trans';

@Component({
  selector: 'app-cartpage',
  standalone: true,
  imports: [CommonModule, Header, FormsModule],
  templateUrl: './cartpage.html',
  styleUrls: ['./cartpage.scss'],
})
export class Cartpage implements OnInit {
  // 1. สร้างตัวแปรสำหรับเก็บข้อมูล
  cartItems: any[] = []; //
  isLoading: boolean = true;
  errorMessage: string | null = null;

  totalPrice: number = 0;
  // --- ตัวแปรสำหรับส่วนลด ---
  discountCodeInput: string = ''; // 5. ผูกกับ <input>
  appliedDiscount: DiscountItem | null = null; // เก็บข้อมูลส่วนลดที่ใช้ได้
  discountAmount: number = 0;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private discountService: DiscountService,
    private transactionService: TranSactionService
  ) {}

  // 2. เมื่อหน้าโหลดเสร็จ ให้เรียกฟังก์ชันโหลดข้อมูล
  ngOnInit(): void {
    this.loadCartItems();
  }

  // 3. ฟังก์ชันสำหรับโหลดข้อมูลจาก Service
  async loadCartItems(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      // (สมมติว่า AuthService มีฟังก์ชัน getUserId())
      const userId = this.authService.getCurrentUserId();
      if (!userId) {
        throw new Error('User not logged in');
      }

      // เรียก Service
      const response: any = await this.ordersService.getAllOnCart(userId);
      this.cartItems = response;

      this.calculateTotal(); // คำนวณราคารวม
    } catch (err: any) {
      this.errorMessage = 'ไม่สามารถโหลดข้อมูลตะกร้าได้: ' + err.message;
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  //ฟังก์ชันคำนวณราคารวม
  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  async removeItem(itemId: number): Promise<void> {
    // ดึงชื่อเกมมาแสดงใน popup ยืนยัน
    const item = this.cartItems.find((i) => i.item_oid === itemId);
    const itemName = item ? item.name : 'สินค้านี้'; // 'name' มาจาก SQL JOIN

    // 1. ยืนยันก่อนลบ
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${itemName}" ออกจากตะกร้า?`)) {
      return; // ถ้ากดยกเลิก ก็หยุดทำงาน
    }

    this.isLoading = true; // (Optional) แสดงสถานะโหลดทั้งหน้า
    this.errorMessage = null;

    try {
      // 2. เรียก Service เพื่อลบข้อมูลที่ Backend
      await this.ordersService.removeItemFromCart(itemId);

      // 3. ลบสินค้าออกจาก Array ในหน้านี้ (ไม่ต้องโหลดใหม่ทั้งหน้า)
      // นี่คือวิธีที่ทำให้เว็บดูเร็วขึ้น
      this.cartItems = this.cartItems.filter((item) => item.item_oid !== itemId);

      // 4. คำนวณราคารวมใหม่
      this.calculateTotal();
    } catch (err: any) {
      // 5. หากลบไม่สำเร็จ
      this.errorMessage = 'ไม่สามารถลบสินค้าได้: ' + err.message;
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async applyDiscount(): Promise<void> {
    // 1. ตรวจสอบว่าผู้ใช้กรอกอะไรมาหรือไม่
    if (!this.discountCodeInput || this.discountCodeInput.trim() === '') {
      this.errorMessage = 'กรุณากรอกโค้ดส่วนลด';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // 2. เรียก Service เพื่อค้นหาโค้ด
      const code = this.discountCodeInput.trim();
      const discount = await this.discountService.getDiscountByCode(code);

      // (Optional) 3. ตรวจสอบเงื่อนไขเพิ่มเติม
      // if (discount.max_quantity <= 0) { ... }

      // 4. ถ้าโค้ดถูกต้อง
      this.appliedDiscount = discount;
      this.discountAmount = discount.discount_price; // ใช้ราคาส่วนลดจาก DB
    } catch (err: any) {
      // 5. ถ้าโค้ดผิด (เช่น 404 Not Found)
      this.appliedDiscount = null;
      this.discountAmount = 0;
      if (err.status === 404) {
        this.errorMessage = 'โค้ดส่วนลดไม่ถูกต้อง หรือหมดอายุ';
      } else {
        this.errorMessage = 'เกิดข้อผิดพลาดในการตรวจสอบโค้ด';
      }
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
  // (Optional) ฟังก์ชันยกเลิกโค้ด
  cancelDiscount(): void {
    this.appliedDiscount = null;
    this.discountAmount = 0;
    this.discountCodeInput = '';
    this.errorMessage = null;
  }
  // async payment(): Promise<void> {
  //   try {
  //     const userId = this.authService.getCurrentUserId();
  //     if (!userId) {
  //       throw new Error('User not logged in');
  //     }

  //     // เรียก Service เพื่อทำรายการชำระเงิน
  //     await this.transactionService.createPayment(userId, this.totalPrice - this.discountAmount);

  //   } catch (error) {
  //     console.error('Payment failed:', error);
  //     alert('เกิดข้อผิดพลาดในการชำระเงิน');
  //   }
  // }
}