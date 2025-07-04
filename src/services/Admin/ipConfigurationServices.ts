// src/services/userService.ts

import axiosInstance from "../../lib/axios";
import type { IpConfig } from "../../types/Admin/ipConfig";

export interface FetchDepartmentParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FetchDepartmentParamResponse {
  ip_configuration: IpConfig[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getIpconfig(
  params: FetchDepartmentParams
): Promise<FetchDepartmentParamResponse> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[name_cont]": search } : {};

  const response = await axiosInstance.get("/ip_configurations.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("API Response", response);
  return response.data;
}

export async function createIpconfig(data: IpConfig) {
  return axiosInstance.post("/ip_configurations.json", {
    ip_configuration: data,
  });
}

// 2. For Detail/Edit Page
export async function getIpconfigById(id: number): Promise<IpConfig> {
  const response = await axiosInstance.get(`/ip_configurations/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusIpconfig(
  id: number,
  data: Partial<IpConfig>
): Promise<IpConfig> {
  const response = await axiosInstance.patch(`/ip_configurations/${id}.json`, {
    ip_configuration: data,
  });
  return response.data;
}

export async function updateIpconfig(
  id: number,
  data: Partial<IpConfig>
): Promise<IpConfig> {
  const response = await axiosInstance.patch(
    `/ip_configurations/${id}.json`,
    { ip_configuration: data } 
  );
  return response.data;
}

export async function deleteIpName(id: number): Promise<void> {
  await axiosInstance.delete(`/ip_configurations/${id}.json`, {
    headers: { Accept: "application/json" },
  });
}
