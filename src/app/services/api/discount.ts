import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../../config/costants';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth';
import { DiscountGetRes, DiscountItem } from '../../model/discount_get_res';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  constructor(
    private constants: Constants,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public async getAllDiscount(options?: {
    [param: string]: string | number | boolean;
  }): Promise<DiscountGetRes> {
    //ลบ []
    const url = this.constants.API_ENDPOINT + '/discount/';
    const params = new HttpParams({ fromObject: options });
    const response = await lastValueFrom(this.http.get<DiscountGetRes>(url, { params })); //ลบ []
    return response;
  }

  //---------------------------------------------------------------
  public async getDiscountById(discountId: number): Promise<DiscountItem> {
    const url = `${this.constants.API_ENDPOINT}/discount/${discountId}`;

    const response = await lastValueFrom(this.http.get<DiscountItem>(url));
    return response;
  }
  //-------------------------------------------------------------------
  public async createDiscount(
    discount_code: string,
    discount_price: number,
    max_quantity: number
  ): Promise<any> {
    const body = {
      discountCode: discount_code,
      discountPrice: discount_price,
      maxQuantity: max_quantity,
    };

    const url = this.constants.API_ENDPOINT + '/discount/create';
    console.log('Sending create discount request with FormData:', body);

    try {
      const response = await lastValueFrom(this.http.post(url, body));
      console.log('Create New Discount success: ', response);
      return response;
    } catch (error) {
      console.error('POST failed: ', error);
    }
  }
  //--------------------------------------------------------------------------------------------------

  //edit discount
  public async updateDiscount(
    discountId: number,
    discountData: {
      // 1. รับเป็น Object เพื่อความง่าย
      discount_code?: string;
      discount_price?: number;
      max_quantity?: number;
    }
  ): Promise<any> {
    // 2. [FIX] ส่งเป็น JSON
    //    Key (discount_code) ต้องตรงกับ req.body ที่ Backend คาดหวัง
    const body = {
      discount_code: discountData.discount_code,
      discount_price: discountData.discount_price,
      max_quantity: discountData.max_quantity,
    };

    const url = `${this.constants.API_ENDPOINT}/discount/update/${discountId}`;

    // 3. ส่ง 'body' (JSON) เข้าไปตรงๆ
    return lastValueFrom(this.http.put(url, body));
  }

  //--------------------------------------------------------------------------------------------------
  //delete
  public async deleteDiscount(discountId: number): Promise<void> {
    // 1. แก้ชื่อ
    // 2. แก้ URL จาก /games/delete/ -> /discount/delete/
    const url = `${this.constants.API_ENDPOINT}/discount/delete/${discountId}`;
    try {
      await lastValueFrom(this.http.delete(url));
      console.log(`Discount with ID ${discountId} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete discount with ID ${discountId}:`, error);
      throw error;
    }
  }

  public async getDiscountByCode(code: string): Promise<DiscountItem> {
    const url = `${this.constants.API_ENDPOINT}/discount/code/${code}`;
    try {
      // (อาจจะต้องเพิ่ม Header Authorization ถ้า API นี้ต้องการ)
      const response = await lastValueFrom(this.http.get<DiscountItem>(url));
      return response;
    } catch (error) {
      console.error(`Failed to get discount code ${code}:`, error);
      throw error; // โยน error ต่อให้ component
    }
  }
}
