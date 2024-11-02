export interface ITEM_PRICE {
    id: number;
    item_id: number;
    unit_id: number;
    cost: number;
    particulars: string;
    price: number;
}

export class ITEM_PRICE_DTO {
    id: number=0;
    item_id: number=0;
    item_code: string = '';
    item_barcode: string = '';
    item_description:string = '';
    unit_id: number=0;
    unit_code: string = '';
    unit: string = '';
    particulars: string ='';
    cost: number=0;
    price: number=0;
}