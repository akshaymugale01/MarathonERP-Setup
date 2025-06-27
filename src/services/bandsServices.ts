// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { Bands } from "../types/bands";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  countries: Bands[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getBand(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("pms/bands.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createBand(userData: Bands) {
  return axiosInstance.post("/pms/bands.json", {
    pms_band: userData
  });
}

// 2. For Detail/Edit Page
export async function getBandById(id: number): Promise<Bands> {
  const response = await axiosInstance.get(`/pms/bands/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusBand(
  id: number,
  data: Partial<Bands>
): Promise<Bands> {
  const response = await axiosInstance.patch(`/pms/bands/${id}.json`, {
    pms_band: data,
  });
  return response.data;
}

export async function deleteBand(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/bands/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
