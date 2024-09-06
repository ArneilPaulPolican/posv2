//item.model.ts

export interface ITEM {
  id: number;
  item_code: string;
  bar_code: string;
  item_description: string;
  alias: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  unit_id: number;
  is_inventory: boolean;
  generic_name: string;
  tax_id: number;
  remarks: string;
  image_path: string;
  is_package: boolean;
  is_locked: boolean;
  expiry_date: string;
  lot_number: string;
}


export interface IItemComponentFormData {
  id?: number;
  item_id: number;
  quantity: number;
  unit_id?: number;
}

export default class ITEM_DTO {
  id: number = 0;
  item_code: string = '';
  bar_code: string = '';
  item_description: string = '';
  alias: string = '';
  category: string = '';
  price: number = 0;
  cost: number = 0;
  quantity: number = 0;
  unit_id: number = 0;
  unit?: string = '';
  unit_code?: string ='';
  is_inventory: boolean = false;
  generic_name: string = '';
  tax?: string = '';
  tax_rate?: number = 0;
  is_tax_rate_inclusive?: boolean = false;
  tax_id: number = 0;
  remarks: string = '';
  image_path: string = '';
  is_package: boolean = false;
  is_locked: boolean = true;
  expiry_date: string = '';
  lot_number: string = '';
}

// export class ItemComponent {
//   id: number = 0;
//   item_code?: string;
//   item_id: number = 0;
//   quantity: number = 0;
//   unit: string = '';
//   unit_id: number = 0;
// }


