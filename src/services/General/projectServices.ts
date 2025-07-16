// src/services/userService.ts
import axiosInstance from "../../lib/axios";
import type { Project } from "../../types/General/projects";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  projects: Project[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getProject(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search
    ? { "q[country_code_or_country_or_region_or_isd_code_cont]": search }
    : {};
  const response = await axiosInstance.get("pms/projects.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createProject(userData: Project) {
  return axiosInstance.post("/pms/projects.json", {
    pms_project: userData,
  });
}

export async function updateProject(id: number, userData: Project) {
  return axiosInstance.put(`/pms/projects/${id}.json`, {
    pms_project: userData,
  });
}

// 2. For Detail/Edit Page
export async function getProjectById(id: number): Promise<Project> {
  const response = await axiosInstance.get(`/pms/projects/${id}.json`);
  return response.data;
}

export async function deleteProjectById(id: number): Promise<Project> {
  const response = await axiosInstance.delete(`/pms/projects/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusProject(
  id: number,
  data: Partial<Project>
): Promise<Project> {
  const response = await axiosInstance.patch(`/pms/projects/${id}.json`, {
    pms_project: data,
  });
  return response.data;
}
