export interface STOCK_OUT {
    id: number;
    user_id: number;
    out_number: string;
    out_date: string;
    remarks?: string;
    status: string;
    is_locked: boolean;
}

export class STOCK_OUT_DTO {
    id: number=0;
    user_id: number =0;
    user: string =''
    out_number: string = '';
    out_date: string = '';
    remarks?: string = '';
    status: string = '';
    is_locked: boolean=false;
}