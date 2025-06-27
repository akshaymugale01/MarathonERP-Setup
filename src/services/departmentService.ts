// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { Department } from "../types/department";

export interface FetchDepartmentParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FetchDepartmentParamResponse {
  pms_departments: Department[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getDepartment(
  params: FetchDepartmentParams
): Promise<FetchDepartmentParamResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("/pms/departments.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("API Response", response);
  return response.data;
}

export async function createDepartment(data: Department) {
  return axiosInstance.post("/pms/departments.json", {
    pms_department: data,
  });
}

// 2. For Detail/Edit Page
export async function getDepartmentById(id: number): Promise<Department> {
  const response = await axiosInstance.get(`/pms/departments/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusDepartment(
  id: number,
  data: Partial<Department>
): Promise<Department> {
  const response = await axiosInstance.patch(`/pms/departments/${id}.json`, {
    pms_department: data,
  });
  return response.data;
}

export async function updateDepartment(
  id: number,
  data: Partial<Department>
): Promise<Department> {
  const response = await axiosInstance.patch(
    `/pms/departments/${id}.json`,
    { pms_department: data } 
  );
  return response.data;
}

export async function deleteName(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/departments/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
