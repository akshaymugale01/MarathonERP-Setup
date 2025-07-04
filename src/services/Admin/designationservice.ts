// src/services/userService.ts

import axiosInstance from "../../lib/axios";
import type { Department } from "../../types/Admin/department";

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

export async function getDesignation(
  params: FetchDepartmentParams
): Promise<FetchDepartmentParamResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("/pms/designations.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("API Response", response);
  return response.data;
}

export async function createDesignation(data: Department) {
  return axiosInstance.post("/pms/designations.json", {
    pms_designation: data,
  });
}

// 2. For Detail/Edit Page
export async function getDesignationById(id: number): Promise<Department> {
  const response = await axiosInstance.get(`/pms/designations/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusDesignation(
  id: number,
  data: Partial<Department>
): Promise<Department> {
  const response = await axiosInstance.patch(`/pms/designations/${id}.json`, {
    pms_designation: data,
  });
  return response.data;
}

export async function updateDesignation(
  id: number,
  data: Partial<Department>
): Promise<Department> {
  const response = await axiosInstance.patch(`/pms/designations/${id}.json`, {
    pms_designation: data,
  });
  return response.data;
}

export async function deleteDesignation(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/designations/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
