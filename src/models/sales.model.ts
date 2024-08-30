export interface SALES {
  id?: number;
  user_id: number;
  sales_number: string;
  sales_date: string;
  terminal_number: number;
  customer_id: number;
  table_id: number;
  total_amount: number;
  balance_amount: number;
  paid_amount:number;
  discount_id: number;
  discount_rate: number;
  discount_amount: number;
  no_of_pax: number;
  remarks?: string;
  status: string;
  is_locked?: boolean;
  is_billed_out?: boolean;
  is_cancelled?: boolean;
  senior_pwd_id?: string;
  senior_pwd_name?: string;
  discounted_pax : number;
}

export class SALES_DTO {
  id?: number = 0;
  user_id: number = 0;
  user: string = '';
  sales_number: string = '';
  sales_date: string = '';
  terminal_number: string = '';
  customer_id: number =0;
  customer_code: string = '';
  customer: string = '';
  customer_address:string = '';
  customer_tin:string = '';
  table_id: number =0;
  table: string = '';
  total_amount?: number = 0;
  balance_amount?: number =0;
  paid_amount?:number =0;
  discount_amount?: number =0;
  no_of_pax: number = 0;
  remarks?: string = '';
  status: string = '';
  is_locked?: boolean = false;
  is_billed_out?: boolean = false;
  is_cancelled?: boolean = false;
  discount_id?: number = 0;
  discount: string = '';
  discount_rate?: number = 0;
  senior_pwd_name?: string = '';
  senior_pwd_id?: string = '';
}
