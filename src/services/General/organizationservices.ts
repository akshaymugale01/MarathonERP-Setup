// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Organization } from "../../types/General/organization";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  organizations: never[];
  pms_floors: never[];
  floors: Organization[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getOrganization(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("/organizations.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createOrganization(formData: FormData) {
  return axiosInstance.post("/organizations.json", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function updateOrganization(
  id: number,
  formData: FormData
) {
  return axiosInstance.put(`/organizations/${id}.json`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 2. For Detail/Edit Page
export async function getOrganizationById(id: number): Promise<Organization> {
  const response = await axiosInstance.get(`/organizations/${id}.json`);
  return response.data;
}

export async function deleteOrganizationById(
  id: number
): Promise<Organization> {
  const response = await axiosInstance.delete(`/organizations/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusOrganization(
  id: number,
  data: Partial<Organization>
): Promise<Organization> {
  const response = await axiosInstance.patch(`/organizations/${id}.json`, {
    organization: data,
  });
  return response.data;
}
