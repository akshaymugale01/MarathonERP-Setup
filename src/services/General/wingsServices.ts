// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Wing } from "../../types/General/wings";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  pms_wings: never[];
  wings: Wing[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getWing(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("pms/wings.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createWing(userData: Wing) {
  return axiosInstance.post("/pms/wings.json", {
    pms_wing: userData,
  });
}

export async function updateWing(id: number, userData: Partial<Wing>) {
  return axiosInstance.put(`/pms/wings/${id}.json`, {
    pms_wing: userData,
  });
}

// 2. For Detail/Edit Page
export async function getWingById(id: number): Promise<Wing> {
  const response = await axiosInstance.get(`/pms/wings/${id}.json`);
  return response.data;
}

export async function deleteWingById(id: number): Promise<Wing> {
  const response = await axiosInstance.delete(`/pms/wings/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusWing(
  id: number,
  data: Partial<Wing>
): Promise<Wing> {
  const response = await axiosInstance.patch(`/pms/wings/${id}.json`, {
    pms_wing: data,
  });
  return response.data;
}
