
export interface DiscountItem {
  discount_id: number;
  discount_code: string;
  discount_price:number;
  max_quantity: number;
  limit_user: number;
}

export interface DiscountGetRes {
  discount: DiscountItem[];
}
