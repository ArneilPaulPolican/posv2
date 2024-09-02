export interface STOCK_IN {
    id: number;
    user_id: number;
    in_number: string;
    in_date: string;
    remarks?: string;
    status: string;
}

export class STOCK_IN_DTO {
    id: number= 0;
    user_id: number= 0;
    user: string =''
    in_number: string ='';
    in_date: string ='';
    remarks?: string ='';
    status: string ='';
}