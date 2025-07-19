// src/services/userService.ts

import axiosInstance from "../../lib/axios";
import type { User } from "../../types/Admin/user";

// Params for paginated API
export interface FetchUserParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedUserResponse {
  users: User[];
  total_count: number;
  total_pages: number;
  current_page: number;
}



export async function getUsers(params: FetchUserParams) : Promise<PaginatedUserResponse> {
    const {search, ...rest} = params;
    const rasackQuery = search ? {'q[email_or_division_name_or_band_name_or_mobile_or_reporting_manager_firstname_or_username_or_company_company_name_or_lock_role_name_or_gender_or_employee_code_or_name_title_name_or_email_or_firstname_or_middlename_or_lastname_or_birth_date_or_group_join_date_or_designation_name_or_confirm_date_or_last_working_date_or_branch_name_or_department_name_cont]': search} : {};
// _or_email_or_division_name_or_band_name_or_mobile_or_reporting_manager_firstname_or_gender_or_username_or_lock_role_name_or_company_company_name_cont]", params.dig(:s, "employee_code_or_name_title_name_or_firstname_or_middlename_or_lastname_or_birth_date_or_group_join_date_or_confirm_date_or_last_working_date_or_branch_name_or_department_name_or_designation_name_or_email_or_division_name_or_band_name_or_mobile_or_reporting_manager_id_or_gender_or_username_or_password_or_role_name_or_company_company_name_or_lock_role_name
    const response = await axiosInstance.get("/users.json", { 
        params: {...rest, ...rasackQuery},
    });
    console.log("User API Response", response);
    return response.data
}

export async function createUser(userData: Partial<User>) {
    return axiosInstance.post('/users', {user: userData}, {
        headers: { 'Accept': 'application/json' }
    });
}


// 2. For Detail/Edit Page
export async function getUserById(id: number): Promise<User> {
  const response = await axiosInstance.get(`/users/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusUser(id: number, data: Partial<User>): Promise<User> {
  const response = await axiosInstance.patch(`/users/${id}.json`, data);
  return response.data;
}

// Category API
export async function getCategoryData(category: string): Promise<{ id: number; name: string }[]> {
  const response = await axiosInstance.get("/fetch_category_data", {
    params: { category },
    headers: { 'Accept': 'application/json' }
  });
  console.log("Api response", response);
  return response.data.data;
}

//Wings On Selction
export async function getWingsByCategory(category: string, ids: number[]): Promise<{ id: number; name: string }[]> {
  let params: unknown = {};

  if (category === 'Company') {
    params = { company_ids: ids };
  } else if (category === 'Project') {
    params = { project_ids: ids };
  } else if (category === 'Sub-Project') {
    params = { sub_project_ids: ids };
  }

  const response = await axiosInstance.get("/pms/sites/fetch_wings", {
    params,
    headers: { 'Accept': 'application/json' }
  });

  return response.data.map((item: [string, number]) => ({
    name: item[0],
    id: item[1]
  }));
}

export async function getGateNumbersByCategory(category: string, ids: number[]): Promise<{ id: number; name: string }[]> {
  let params: unknown = {};

  if (category === 'Company') {
    params = { company_ids: ids };
  } else if (category === 'Project') {
    params = { project_ids: ids };
  } else if (category === 'Sub-Project') {
    params = { sub_project_ids: ids };
  }

  const response = await axiosInstance.get("/pms/sites/fetch_gate_numbers_from", {
    params,
    headers: { 'Accept': 'application/json' }
  });

  // ⚠ Correctly map array response
  return response.data.map((item: [string, number]) => ({
    id: item[1],
    name: item[0]
  }));
}

export async function deleteUser(id: number): Promise<void> {
  await axiosInstance.delete(`/users/${id}.json`, {
    headers: { 'Accept': 'application/json' }
  });
}

