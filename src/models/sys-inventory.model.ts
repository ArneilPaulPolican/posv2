//sys-inventory.model.ts
export interface SYS_INVENTORY {
    id: number;
    trx_id: number;
    trx_date:string;
    trx_type: string;
    reference: string;
    item_id: number;
    unit_id: number;
    quantity: number;
    end_quantity: number;
    cost: number;
    price: number;
}
  

//sys-inventory.model.ts
export class SYS_INVENTORY_DTO {
    id: number =0;
    trx_id: number =0;
    trx_date: string ='';
    trx_type: string ='';
    reference: string ='';
    item_id: number =0;
    item_barcode: string ='';
    item_description: string ='';
    unit_id: number =0;
    unit_code: string ='';
    unit: string ='';
    quantity: number =0;
    end_quantity: number =0;
    cost: number =0;
    price: number =0;
  }
  