export interface ITEM_COMPONENT {
    id: number;
    item_id: number;
    quantity: string;
    unit_id: string;
}

export class ITEM_COMPONENT_DTO {
    id: number=0;
    item_idd: number=0;
    item_barcode: string = '';
    item_description:string = '';
    quantity: number=0;
    unit_id: number=0;
    unit: string = '';
}