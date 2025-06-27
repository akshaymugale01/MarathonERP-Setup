// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { DevelopmentType } from "../types/development";

export interface FetchDepartmentParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FetchDepartmentParamResponse {
  pms_departments: DevelopmentType[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getDevelopmentType(
  params: FetchDepartmentParams
): Promise<FetchDepartmentParamResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("/pms/development_types.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("API Response", response);
  return response.data;
}

export async function createDevelopmentType(data: DevelopmentType) {
  return axiosInstance.post("/pms/development_types.json", {
    pms_development_type: data,
  });
}

// 2. For Detail/Edit Page
export async function getDevelopmentTypeById(
  id: number
): Promise<DevelopmentType> {
  const response = await axiosInstance.get(`/pms/development_types/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusDevelopmentType(
  id: number,
  data: Partial<DevelopmentType>
): Promise<DevelopmentType> {
  const response = await axiosInstance.patch(
    `/pms/development_types/${id}.json`,
    {
      pms_development_type: data,
    }
  );
  return response.data;
}

export async function updateDevelopmentType(
  id: number,
  data: Partial<DevelopmentType>
): Promise<DevelopmentType> {
  const response = await axiosInstance.patch(
    `/pms/development_types/${id}.json`,
    {
      pms_development_type: data,
    }
  );
  return response.data;
}

export async function deleteDevelopmentType(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/development_types/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
