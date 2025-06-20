// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { NameTitle } from "../types/nameTitle";


export interface FetchnameTitleParam {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface FetchnameTitleParamResponse {
    name_titles: NameTitle[];
    total_count: number;
    total_pages: number;
    current_page: number;
}

export async function getnameTitles(params: FetchnameTitleParam) : Promise<FetchnameTitleParamResponse> {
    const {search, ...rest} = params;
    const rasackQuery = search ? {'q[name_or_code_cont]': search} : {};

    const response = await axiosInstance.get("/name_titles.json", {
        params: {...rest, ...rasackQuery},
    });
    console.log("API Response", response);
    return response.data
}


export async function createNameTitle(userData: NameTitle) {
    return axiosInstance.post('/name_titles', userData);
}

// 2. For Detail/Edit Page
export async function getNameTitleById(id: number): Promise<NameTitle> {
  const response = await axiosInstance.get(`/name_titles/${id}.json`);
  return response.data;
}

// Update User
export async function updateStatusNameTitle(id: number, data: Partial<NameTitle>): Promise<NameTitle> {
  const response = await axiosInstance.patch(`/name_titles/${id}.json`, data);
  return response.data;
}

export async function updateNameTitle(id: number, data: Partial<NameTitle>): Promise<NameTitle> {
  const response = await axiosInstance.patch(`/name_titles/${id}.json`, data);
  return response.data;
}

export async function deleteName(id: number): Promise<void> {
  await axiosInstance.delete(`/name_titles/${id}.json`, {
    headers: { 'Accept': 'application/json' }
  });
}