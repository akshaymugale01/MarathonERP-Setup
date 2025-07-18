// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { UOM } from "../../types/General/uom";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  pms_floors: never[];
  floors: UOM[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getUom(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("pms/unit_of_measures.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createUom(userData: UOM) {
  return axiosInstance.post("/pms/unit_of_measures.json", {
    pms_floor: userData,
  });
}

export async function updateUom(id: number, userData: Partial<UOM>) {
  return axiosInstance.put(`/pms/unit_of_measures/${id}.json`, {
    pms_floor: userData,
  });
}

// 2. For Detail/Edit Page
export async function getUomById(id: number): Promise<UOM> {
  const response = await axiosInstance.get(`/pms/unit_of_measures/${id}.json`);
  return response.data;
}

export async function deleteUomById(id: number): Promise<UOM> {
  const response = await axiosInstance.delete(`/pms/unit_of_measures/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusUom(
  id: number,
  data: Partial<UOM>
): Promise<UOM> {
  const response = await axiosInstance.patch(`/pms/unit_of_measures/${id}.json`, {
    pms_floor: data,
  });
  return response.data;
}