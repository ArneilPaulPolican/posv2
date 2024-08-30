//unit.model.ts
export interface DISCOUNT {
  id: number;
  discount: string;
  discount_rate: string;
  vat_inclusive: boolean;
  particular: string;
  is_locked: boolean;
  image_url: string;
}
