

export interface SALES_ITEM {
    id?: number;
    sales_id: number;
    date_time?: string;
    item_id: number;
    unit_id: number;
    quantity: number;
    price?: number;
    discount_id: number;
    discount_rate: number;
    discount_amount?: number;
    net_price?: number;
    amount?: number;
    tax_id: number;
    tax_rate?: number;
    tax_amount?: number;
    particulars?: string;
    user_id?: number;
  }
  
  export class SALES_ITEM_DTO {
    id?: number = 0;
    sales_id: number = 0;
    date_time?: string = '';
    item_id: number = 0;
    item_code: string = '';
    item_description: string = '';
    item_barcode: string = '';
    item_alias: string = '';
    item_category: string = '';
    item_cost: number = 0;
    item_image:string = '';
    unit_id: number = 0;
    unit: string = '';
    unit_code: string = '';
    quantity: number = 0;
    price?: number = 0;
    discount_id: number = 0;
    discount: string = '';
    discount_rate: number = 0;
    discount_amount?: number = 0;
    net_price?: number = 0;
    amount?: number = 0;
    tax_id: number = 0;
    tax:string = '';
    tax_rate:number = 0;
    tax_amount?: number = 0;
    particulars?: string = '';
    user_id?: number = 0;
    user: string = '';
  }