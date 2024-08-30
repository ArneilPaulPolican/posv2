export interface TABLE_GROUP_LINES {
    id: number;
    table_group_id: number;
    table_id: number;
    is_shown: boolean;
    is_default_value: boolean;
}

export class TABLE_GROUP_LINES_DTO {
    id: number =0;
    table_group_id: number =0;
    table_group: string ='';
    table_id: number =0;
    table_name:string ='';
    is_shown: boolean =false;
    is_default_value: boolean =false;
}