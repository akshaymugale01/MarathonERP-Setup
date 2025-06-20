// src/types/user.ts
export interface User {
  id: number;
  employee_code: string;
  title_id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  birth_date: string;
  group_join_date: string;
  confirm_date: string;
  last_working_date: string;
  company_id: number;
  branch_id: number;
  department_id: number;
  designation_id: number;
  email: string;
  division_id: number;
  band_id: number;
  mobile: string;
  reporting_manager_id: number;
  gender: string;
  username: string;
  password: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  access_level: string;
  access_ids: [];
  url: string;
  gate_number_id: number;
  wing_ids: [];
  role_ids: [];
  company_name: string;
  selected_ids: string;
}

