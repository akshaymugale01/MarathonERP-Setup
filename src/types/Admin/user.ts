// src/types/Admin/user.ts
export interface User {
  id: number;
  url?: string;
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
  access_ids: string[];
  accessLevelId: string;
  wingMapping: string;
  gateNumberId: string;
  selected_ids?: string[];
  gate_number_id?: number;
  wing_ids?: string[];
  role_ids?: string[];
  company_name?: string;
}

export interface Role {
  id: number;
  name: string;
  display_name?: string;
  permissions_hash?: string;
}

export interface UserFormData {
  employeeCode: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  groupJoinDate: string;
  confirmDate: string;
  lastWorkingDate: string;
  branchId: number;
  departmentId: number;
  divisionId: number;
  designationId: number;
  email: string;
  username: string;
  mobileNumber: string;
  gender: string;
  password: string;
  roleId: number;
  accessLevelId: string;
  accessIds: string[];
  wingMapping: string;
  gateNumberId: string;
  bandId: number;
}

