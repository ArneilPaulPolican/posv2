export interface ITEM_GROUP_LINES {
    id: number;
    item_group_id: number;
    item_id: number;
    sort_no: number;
    is_shown: boolean;
    is_default_value: boolean;
}

export class ITEM_GROUP_LINES_DTO {
    id: number = 0;
    item_group_id: number =0;
    item_group: string ='';
    item_id: number =0;
    item_barcode: string = '';
    item_description:string = '';
    sort_no: number =0;
    is_shown: boolean =false;
    is_default_value: boolean =false;
}