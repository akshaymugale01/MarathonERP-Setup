// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { User } from "../types/user";

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
    const rasackQuery = search ? {'q[employee_code_or_name_title_name_or_firstname_or_middlename_or_lastname_or_birth_date_or_group_join_date_or_confirm_date_or_last_working_date_or_branch_name_or_department_name_or_designation_name_or_email_or_division_name_or_band_name_or_mobile_or_reporting_manager_id_or_gender_or_username_or_password_or_role_name_or_company_company_name_or_lock_role_name_cont]", params.dig(:s, "employee_code_or_name_title_name_or_firstname_or_middlename_or_lastname_or_birth_date_or_group_join_date_or_confirm_date_or_last_working_date_or_branch_name_or_department_name_or_designation_name_or_email_or_division_name_or_band_name_or_mobile_or_reporting_manager_id_or_gender_or_username_or_password_or_role_name_or_company_company_name_or_lock_role_name_cont]': search} : {};

    const response = await axiosInstance.get("/users.json", {
        params: {...rest, ...rasackQuery},
    });
    console.log("User API Response", response);
    return response.data
}

export async function createUser(userData: User) {
    return axiosInstance.post('/users', userData);
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
