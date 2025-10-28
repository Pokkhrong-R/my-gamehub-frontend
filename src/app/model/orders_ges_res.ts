export interface order {
  order_id?: number;
  game_id?: number;
  user_id?: number;
  discount_id?: number;
  total_price:number;
  order_date:Date;
  state:string;
}
export interface orderItem {
  item_oid?: number;
  order_id?: number;
  game_id?: number;
  user_id?: number;
  price:number;
  state:string;
}