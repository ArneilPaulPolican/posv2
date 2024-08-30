export interface STOCK_OUTS {
    id: number;
    user_id: number;
    out_number: string;
    out_date: string;
    remarks?: string;
    status: string;
}

export class STOCK_OUTS_DTO {
    id: number=0;
    user_id: number =0;
    user: string =''
    out_number: string = '';
    out_date: string = '';
    remarks?: string = '';
    status: string = '';
}