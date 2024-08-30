export interface STOCK_INS {
    id: number;
    user_id: number;
    in_number: string;
    in_date: string;
    remarks?: string;
    status: string;
}

export class STOCK_INS_DTO {
    id: number= 0;
    user_id: number= 0;
    user: string =''
    in_number: string ='';
    in_date: string ='';
    remarks?: string ='';
    status: string ='';
}