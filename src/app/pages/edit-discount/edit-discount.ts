import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // <-- Import 3 ตัวนี้
import { FormsModule } from '@angular/forms'; // <-- Import
import { DiscountService } from '../../services/api/discount';
import { DiscountItem } from '../../model/discount_get_res';


// (Optional) Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Header } from "../header/header";

@Component({
  selector: 'app-edit-discount',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <--
    RouterModule, // <--
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    Header
],
  templateUrl: './edit-discount.html',
  styleUrls: ['./edit-discount.scss']
})
export class EditDiscount implements OnInit {

  discountId: number | null = null;
  // ใช้ 'any' หรือสร้าง Model ใหม่สำหรับ form binding
  discount: any = { 
    discount_code: '',
    discount_price: null,
    max_quantity: null
  }; 
  
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, // 1. ใช้ดึง ID จาก URL
    private router: Router,       // 2. ใช้ย้อนกลับ
    private discountService: DiscountService // 3. Service
  ) { }

  ngOnInit(): void {
    // 4. ดึง ID จาก URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.discountId = +idParam; // แปลง string 'id' เป็น number
      this.loadDiscount();
    } else {
      this.errorMessage = "ไม่พบ ID ของส่วนลด";
      this.isLoading = false;
    }
  }

  // 5. โหลดข้อมูลเดิม
  async loadDiscount(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      // ใช้ฟังก์ชันที่แก้ไขแล้ว (getDiscountById)
      const data = await this.discountService.getDiscountById(this.discountId!);
      this.discount = data;
    } catch (err) {
      this.errorMessage = "ไม่สามารถโหลดข้อมูลส่วนลดได้";
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  // 6. ฟังก์ชันสำหรับอัปเดต
  async onUpdate(): Promise<void> {
    if (!this.discount || !this.discountId) return;

    this.isLoading = true;
    this.errorMessage = null;

    try {
      // สร้าง Object ที่จะส่ง (ตรงกับที่ Service คาดหวัง)
      const updateData = {
        discount_code: this.discount.discount_code,
        discount_price: this.discount.discount_price,
        max_quantity: this.discount.max_quantity
      };
      
      // เรียก Service ที่แก้ไขแล้ว
      await this.discountService.updateDiscount(this.discountId, updateData);
      
      // 7. เมื่อสำเร็จ, กลับไปหน้ารายการ
      alert("อัปเดตข้อมูลส่วนลดสำเร็จ");
      this.router.navigate(['/admin/show-all-discount']); 

    } catch (err) {
      this.errorMessage = "อัปเดตข้อมูลไม่สำเร็จ";
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  }
}