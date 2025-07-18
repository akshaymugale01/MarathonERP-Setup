// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Floor } from "../../types/General/floor";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  pms_floors: never[];
  floors: Floor[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getFloor(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("pms/floors.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createFloor(userData: Floor) {
  return axiosInstance.post("/pms/floors.json", {
    pms_floor: userData,
  });
}

export async function updateFloor(id: number, userData: Partial<Floor>) {
  return axiosInstance.put(`/pms/floors/${id}.json`, {
    pms_floor: userData,
  });
}

// 2. For Detail/Edit Page
export async function getFloorById(id: number): Promise<Floor> {
  const response = await axiosInstance.get(`/pms/floors/${id}.json`);
  return response.data;
}

export async function deleteFloorById(id: number): Promise<Floor> {
  const response = await axiosInstance.delete(`/pms/floors/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusFloor(
  id: number,
  data: Partial<Floor>
): Promise<Floor> {
  const response = await axiosInstance.patch(`/pms/floors/${id}.json`, {
    pms_floor: data,
  });
  return response.data;
}
