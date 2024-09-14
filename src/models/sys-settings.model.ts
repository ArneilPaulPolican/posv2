export interface SYS_SETTINGS {
    id: number;
    customer: string;
    customer_address: string;
    customer_tin: string;
    terminal_number: string;
    pos_serial_number: string;
    pos_permit_number: string;
    pos_accreditation_number: string;
    pos_machine_identification_number: string;
    pos_vendor: string;
    pos_vendor_address: string;
    pos_vendor_tin: string;
    pos_vendor_accreditation_number: string;
    pos_vendor_accreditation_expiry_date: string;
    remarks: string;
    image: string;
    backoffice_domain: string;
    backoffice_access_token: string;
    is_backoffice_enabled: boolean;
    serial_number: string;
    license_key: string;
  }