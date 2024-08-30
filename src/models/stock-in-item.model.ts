export interface STOCK_IN_ITEMS {
    id: number;
    in_id: number;
    date_time: string;
    item_id: number;
    unit_id: number;
    quantity: number;
    cost: number;
    amount: number;
    particulars?: string;
}

export class STOCK_IN_ITEMS_DTO {
    id: number =0;
    in_id: number =0;
    in_date: string ='';
    in_number:string ='';
    date_time: string ='';
    item_id: number =0;
    item_barcode: string = '';
    item_description:string = '';
    unit_id: number =0;
    unit:string ='';
    quantity: number=0;
    cost: number =0;
    amount: number =0;
    particulars?: string ='';
}