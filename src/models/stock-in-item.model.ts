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
    date_time: string ='';
    item_id: number =0;
    item_code: string = '';
    item_barcode: string = '';
    item_description:string = '';
    item_image_path: string = '';
    unit_id: number =0;
    unit_code:string ='';
    unit:string ='';
    quantity: number = 0;
    cost: number = 0;
    amount: number =0;
    particulars?: string ='';
}