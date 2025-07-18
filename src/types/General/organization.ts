export interface Organization {
  id: number;
  name: string;
  active: boolean | null;
  created_by_id: number;
  logo?: FileList | {
    organization_logo?: {
      document: string;
    };
  };
  organization_logo: {
    document: string;
  }
  domain: string;
  sub_domain: string;
  created_at: string;
  updated_at: string;
  country_id: number | null;
  mobile: string | null;
  designation_id: number | null;
  department_id: number | null;
  state_id: number;
  country: string;
  state: string;
  city: string;
  city_id: number;
  pin_code: number;
  mobile_no: string;
  phone_no: string;
  address_line: string;
}
