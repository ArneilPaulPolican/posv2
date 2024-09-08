
export interface CUSTOMER {
  id?: number;
  customer_code: string;
  customer: string;
  contact_number: string;
  contact_person: string;
  credit_limit: number;
  category: string;
  email: string;
  address: string;
  tin: string;
  reward_number: string;
  image_path?: string;
  is_locked: boolean;
  is_default_value?: boolean;
}

class ContactNumber extends String {
  constructor(value?: any) {
    let valueCopy = value as string;
    if (valueCopy.length === 11 && valueCopy.startsWith('0')) {
      // NOTE: replace leading zero with country code; default to (+63) PH
      valueCopy = `+63${valueCopy.substring(1)}`;
    }
    super(valueCopy);
  }
}