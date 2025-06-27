// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { Branchs } from "../types/branchs";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  countries: Branchs[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getBranch(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("pms/branches.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createBranch(userData: Branchs) {
  return axiosInstance.post("/pms/branches.json", {
    pms_branch: userData,
  });
}

// 2. For Detail/Edit Page
export async function getBranchById(id: number): Promise<Branchs> {
  const response = await axiosInstance.get(`/pms/branches/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusBranch(
  id: number,
  data: Partial<Branchs>
): Promise<Branchs> {
  const response = await axiosInstance.patch(`/pms/branches/${id}.json`, {
    pms_branch: data,
  });
  return response.data;
}

export async function deleteBranch(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/branches/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
