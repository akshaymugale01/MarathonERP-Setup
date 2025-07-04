import axiosInstance from "../../lib/axios";
import type { City } from "../../types/General/cities";

export interface fetchCityParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FullResponseCity {
//   total_count(total_count: any): unknown;
  cities: City[];
  total_count: number;
  current_page: number;
  total_pages: number;
}

export async function getCities(
  params: fetchCityParams
): Promise<FullResponseCity> {
  const { search, ...rest } = params;
  const ransacQuery = search ? { "q[name_cont]": search } : {};
  const response = await axiosInstance.get("/pms/cities.json", {
    params: { ...rest, ...ransacQuery },
  });
  console.log("Response Of Cities", response);
  return response.data;
}

export async function getCityById(id: number): Promise<City> {
  const response = await axiosInstance.get(`pms/cities/${id}`);
  return response.data;
}

export async function updateCityStatus(
  id: number,
  data: Partial<City>
): Promise<City> {
  const res = await axiosInstance.patch(`/pms/cities/${id}.json`, {
    pms_city: data,
  });
  return res.data;
}

export async function createCity(data: City) {
  return axiosInstance.post(`/pms/cities.json`, {
    pms_city: data,
  });
}

export async function deletCity(id: number): Promise<City> {
    return axiosInstance.delete(`/pms/cities/${id}`)
}

export async function updateCity(id: number, data: City) {
  return axiosInstance.put(`/pms/cities/${id}.json`, {
    pms_city: data,
  });
}
