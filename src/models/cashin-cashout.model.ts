export interface CASH_IN_OUTS {
    id: number;
    user_id: number;
    cash_in_out_number: string;
    cash_in_out_date: string;
    amount: number;
    cash_1000: number;
    cash_500: number;
    cash_200: number;
    cash_100: number;
    cash_50: number;
    cash_20: number;
    cash_10: number;
    cash_5: number;
    cash_1: number;
    cash_dot_25: number;
    cash_dot_10: number;
    cash_dot_5: number;
    cash_dot_1: number;
    type: string;
    refund_reference_number?: string;
    remarks?: string;
    is_locked: boolean;
    status: string;
}

export class CASH_IN_OUTS_DTO {
    id: number =0;
    user_id: number =0;
    user: string = '';
    cash_in_out_number: string ='';
    cash_in_out_date: string ='';
    amount: number =0;
    cash_1000: number =0;
    cash_500: number =0;
    cash_200: number =0;
    cash_100: number =0;
    cash_50: number =0;
    cash_20: number =0;
    cash_10: number =0;
    cash_5: number =0;
    cash_1: number =0;
    cash_dot_25: number =0;
    cash_dot_10: number =0;
    cash_dot_5: number =0;
    cash_dot_1: number =0;
    type:  string ='';
    refund_reference_number?:  string ='';
    remarks?: string ='';
    is_locked: boolean= false;
    status:  string ='';
}