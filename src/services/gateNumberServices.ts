// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { GateNumber } from "../types/gateNumber";

// Params for paginated API
export interface FetchCountryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedCountryResponse {
  countries: GateNumber[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getGateNumber(
  params: FetchCountryParams
): Promise<PaginatedCountryResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[gate_number_or_company_company_name_or_site_name_or_project_name_cont]": search } : {};

  const response = await axiosInstance.get("/gate_numbers.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("User API Response", response);
  return response.data;
}

export async function createGateNumber(userData: GateNumber) {
  return axiosInstance.post("/gate_numbers.json", {
    gate_number: userData,
  });
}

// 2. For Detail/Edit Page
export async function getGateNumberById(id: number): Promise<GateNumber> {
  const response = await axiosInstance.get(`/gate_numbers/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusGateNumber(
  id: number,
  data: Partial<GateNumber>
): Promise<GateNumber> {
  const response = await axiosInstance.patch(`/gate_numbers/${id}.json`, {
    gate_number: data,
  });
  return response.data;
}

export async function deleteGateNumber(id: number): Promise<void> {
  await axiosInstance.delete(`/gate_numbers/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
