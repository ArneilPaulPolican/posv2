export interface STOCK_OUT_ITEMS {
    id: number;
    out_id: number;
    date_time: string;
    item_id: number;
    unit_id: number;
    quantity: number;
    cost: number;
    amount: number;
    particulars?: string;
}

export class STOCK_OUT_ITEMS_DTO {
    id: number =0;
    out_id: number =0;
    date_time: string ='';
    item_id: number =0;
    item_barcode: string = '';
    item_description:string = '';
    item_image_path: string ='';
    unit_id: number =0;
    unit_code: string = '';
    unit: string = '';
    quantity: number =0;
    cost: number =0;
    amount: number =0;
    particulars?: string = '';
}