// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Country } from "../../types/General/countries";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  countries: Country[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getCountry(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};

  const response = await axiosInstance.get("pms/countries.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createCountry(userData: Country) {
  return axiosInstance.post("/pms/countries.json", {
    pms_country: userData,
  });
}

export async function updateCountry(id: number, userData: Country) {
  return axiosInstance.put(`/pms/countries/${id}.json`, {
    pms_country: userData,
  });
}

// 2. For Detail/Edit Page
export async function getCountryById(id: number): Promise<Country> {
  const response = await axiosInstance.get(`/pms/countries/${id}.json`);
  return response.data;
}

export async function deleteCountryById(id: number): Promise<Country> {
  const response = await axiosInstance.delete(`/pms/countries/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusCountry(
  id: number,
  data: Partial<Country>
): Promise<Country> {
  const response = await axiosInstance.patch(`/pms/countries/${id}.json`, {
    pms_country: data,
  });
  return response.data;
}
