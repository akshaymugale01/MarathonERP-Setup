export interface AddressAttributes {
  id?: number;
  pms_state: string;
  pms_country: string;
  pms_city: string;
  address: string;
  address_type: string;
  address_line_two: string;
  pms_country_id: number;
  pms_state_id: number;
  pms_city_id: number;
  pms_location_id: number;
  pin_code: string;
  telephone_number: string;
  fax_number: string;
  _destroy?: boolean;
}

interface GSTINEntry {
  id?: string | number;
  address: string;
  pms_state_id: number;
  pin_code: string;
  gstin: string;
  _destroy?: boolean;
}

export interface LogoAttributes {
  id?: number;
  active?: boolean;
  document?: File | null;
  _destroy?: boolean;
}

export interface Company {
  id: number;
  name: string;
  active: boolean;
  country_id: number;
  created_by: number;
  companylogo_file_name: string;
  companylogo_content_type: string;
  companylogo_file_size: number;
  companylogo_updated_at: string;
  logo: string;
  user_id: number;
  attendance_enabled: string;
  welcome_mail_enabled: boolean;
  organization_id: number;
  user_approval_level: boolean;
  cost_approval_enabled: boolean;
  daily_pms_report: boolean;
  white_label: boolean;
  solution_type: string;
  solution_for: string;
  billing_term: string;
  billing_rate: number;
  billing_cycle: string;
  test: boolean;
  start_date: string;
  end_date: string;
  business_name: string;
  legal_entity_name: string;
  gst_number: string;
  pan_number: string;
  commercial_details: string;
  payment_terms: string;
  signed_agreement_available: boolean;
  work_order_available: boolean;
  live_date: string;
  remarks: string;
  consolidated_billing: boolean;
  billing_note: string;
  otp: string;
  approve: boolean;
  approved_by_id: number;
  visitor_pass_enabled: boolean;
  additional_visitor_hide: boolean;
  visitor_building_enabled: boolean;
  all_sites_enabled: boolean;
  ticket_wing_enabled: boolean;
  ticket_area_enabled: boolean;
  sub_category_location_enabled: boolean;
  visitor_enabled: boolean;
  email_sender_name: string;
  created_at: string;
  updated_at: string;
  domain_name: string;
  corporate_identity_no: string;
  tax_deduction_acc_no: string;
  service_tax_no: string;
  vat_no: string;
  constitution_type: string;
  currency: string;
  contact_person_name: string;
  contact_number: string;
  address: string;
  pin_code: number;
  tan_no: string;
  pf_applicable: boolean;
  pf_no: string;
  esi_applicable: boolean;
  esi_no: string;
  company_name: string;
  company_code: string;
  fiscal_year_from: string;
  fiscal_year_to: string;
  company_billing_name: string;
  email: string;
  server_host: string;
  accounting_package: string;
  state: string;
  city: string;
  location: string;
  // Form specific nested attributes
  office_address_attributes: AddressAttributes;
  billing_address_attributes: AddressAttributes;
  company_gstin_details_attributes: GSTINEntry[];
  // Logo attributes for Rails nested attributes
  logo_attributes?: LogoAttributes;
  // Backend response structure
  office_address?: AddressAttributes;
  billing_address?: AddressAttributes;
  company_gstin_details?: GSTINEntry[];

  major_customers: object;
  user_companies: object;
  rule_engine_rules: object;
  type_of_organization: object;
  good_receive_notes: object;
  projects: object;
  sites: object;
  // end
  company_logo:{
    id: number;
    filename:string;
    document:string;
  }
  phone_number: string;
  same_as_above_address: boolean;
  salary_calculation: string;
  days: number;
  start_days: number;
  gstin: string;
  pin_zip: number;
  country: string;
  company_print_name: string;
  fax_no: string;
  deleted: boolean;
  type_of_organization_id: number;
  material_selection_enabled: boolean;
  mor_selection_enabled: boolean;
  sor_selection_enabled: boolean;
  service_selection_enabled: boolean
}
