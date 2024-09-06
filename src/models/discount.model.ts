//unit.model.ts
export interface DISCOUNT {
  id: number;
  discount: string;
  discount_rate: number;
  vat_inclusive: boolean;
  particular: string;
  is_locked: boolean;
  image_url: string;
}

export class DISCOUNT_DTO {
  id: number = 0;
  discount: string = '';
  discount_rate: number = 0;
  discount_amount?: number = 0;
  senior_pwd_id?: string = '';
  senior_pwd_name?: string = '';
  vat_inclusive: boolean = false;
  particular: string = '';
  is_locked: boolean = false;
  image_url: string = '';
}