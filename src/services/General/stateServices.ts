// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { States } from "../../types/General/states";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  states: never[];
  countries: States[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getStates(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};

  const response = await axiosInstance.get("pms/states.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createStates(userData: States) {
  return axiosInstance.post("/pms/states.json", {
    pms_state: userData,
  });
}

export async function updateStates(id: number, userData: States) {
  return axiosInstance.put(`/pms/states/${id}.json`, {
    pms_state: userData,
  });
}

// 2. For Detail/Edit Page
export async function getStatesById(id: number): Promise<States> {
  const response = await axiosInstance.get(`/pms/states/${id}.json`);
  return response.data;
}

export async function deleteStatesById(id: number): Promise<States> {
  const response = await axiosInstance.delete(`/pms/states/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusStates(
  id: number,
  data: Partial<States>
): Promise<States> {
  const response = await axiosInstance.patch(`/pms/states/${id}.json`, {
    pms_state: data,
  });
  return response.data;
}
