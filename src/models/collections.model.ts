export interface COLLECTIONS {
    id: number;
    ci_date: string;
    ci_number: string;
    customer_id: number;
    // sales_id: number;
    total_amount: number;
    user_id: number;
    is_locked: boolean;
}

export class COLLECTIONS_DTO {
    id: number =0;
    ci_date: string='';
    ci_number: string='';
    customer_id: number =0;
    customer: string ='';
    // sales_id: number=0;
    // sales_date: string ='';
    // sales_number: string ='';
    total_amount: number =0;
    user_id: number =0;
    user:string ='';
    is_locked: boolean =false;
}