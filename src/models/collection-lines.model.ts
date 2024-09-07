export interface COLLECTIONS_LINES {
    id: number;
    collection_id: number;
    paytype_id: number;
    particulars: string;
    amount: number;
    change: number;
}

export class COLLECTIONS_LINES_DTO {
    id: number =0;
    collection_id: number =0;
    paytype_id: number =0;
    paytype:string ='';
    is_default_value: boolean = false;
    particulars: string ='';
    amount: number =0;
    change: number =0;
}