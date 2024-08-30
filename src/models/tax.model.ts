//tax.model.ts
export interface TAX {
  id: number;
  tax_code: string;
  tax: string;
  rate: number;
  is_inclusive: boolean;
}