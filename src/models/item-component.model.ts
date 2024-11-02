export interface ITEM_COMPONENT {
    id: number;
    item_id: number;
    component_id: number;
    particulars: string;
    unit_id: string;
    quantity: string;
}

export class ITEM_COMPONENT_DTO {
    id: number=0;
    item_id: number=0;
    item_code: string = '';
    item_barcode: string = '';
    item_description:string = '';
    component_id: number=0;
    component_code: string = '';
    component_barcode: string = '';
    component_description:string = '';
    particulars: string ='';
    unit_id: number=0;
    unit_code: string = '';
    unit: string = '';
    quantity: number=0;
}