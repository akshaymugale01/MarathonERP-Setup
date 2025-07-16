// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Site } from "../../types/General/sites";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  pms_sites: never[];
  sites: Site[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getSite(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("pms/sites.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createSite(userData: Site) {
  return axiosInstance.post("/pms/sites.json", {
    pms_site: userData,
  });
}

export async function updateSite(id: number, userData: Site) {
  return axiosInstance.put(`/pms/sites/${id}.json`, {
    pms_site: userData,
  });
}

// 2. For Detail/Edit Page
export async function getSiteById(id: number): Promise<Site> {
  const response = await axiosInstance.get(`/pms/sites/${id}.json`);
  return response.data;
}

export async function deleteSiteById(id: number): Promise<Site> {
  const response = await axiosInstance.delete(`/pms/sites/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusSite(
  id: number,
  data: Partial<Site>
): Promise<Site> {
  const response = await axiosInstance.patch(`/pms/sites/${id}.json`, {
    pms_site: data,
  });
  return response.data;
}
