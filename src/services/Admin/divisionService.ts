// src/services/userService.ts

import axiosInstance from "../../lib/axios";
import type { Division } from "../../types/Admin/division";

export interface FetchDivisionParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FetchDivisionParamResponse {
  pms_divisions(pms_divisions: unknown): unknown;
  pms_departments: Division[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getDivision(
  params: FetchDivisionParams
): Promise<FetchDivisionParamResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("/pms/divisions.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("API Response", response);
  return response.data;
}

export async function createDivision(data: Division) {
  return axiosInstance.post("/pms/divisions.json", {
    pms_division: data,
  });
}

// 2. For Detail/Edit Page
export async function getDivisionById(id: number): Promise<Division> {
  const response = await axiosInstance.get(`/pms/divisions/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusDivision(
  id: number,
  data: Partial<Division>
): Promise<Division> {
  const response = await axiosInstance.patch(`/pms/divisions/${id}.json`, {
    pms_division: data,
  });
  return response.data;
}

export async function updateDivision(
  id: number,
  data: Partial<Division>
): Promise<Division> {
  const response = await axiosInstance.patch(`/pms/divisions/${id}.json`, {
    pms_division: data,
  });
  return response.data;
}

export async function deleteDivision(id: number): Promise<void> {
  await axiosInstance.delete(`/pms/divisions/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
