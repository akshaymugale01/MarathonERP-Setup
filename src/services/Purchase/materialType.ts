// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { MaterialType } from "../../types/Purchase/material_type";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  inventory_types: never[];
  pms_floors: never[];
  floors: MaterialType[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getMaterialType(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("/pms/inventory_types.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createMaterialType(formData: FormData) {
  return axiosInstance.post("/pms/inventory_types.json", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateMaterialType(id: number, formData: FormData) {
  return axiosInstance.put(`/inventory_types/${id}.json`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 2. For Detail/Edit Page
export async function getMaterialTypeById(id: number): Promise<MaterialType> {
  const response = await axiosInstance.get(`/inventory_types/${id}.json`);
  return response.data;
}

export async function deleteMaterialTypeById(
  id: number
): Promise<MaterialType> {
  const response = await axiosInstance.delete(`/inventory_types/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusMaterialType(
  id: number,
  data: Partial<MaterialType>
): Promise<MaterialType> {
  const response = await axiosInstance.patch(`/inventory_types/${id}.json`, {
    MaterialType: data,
  });
  return response.data;
}
