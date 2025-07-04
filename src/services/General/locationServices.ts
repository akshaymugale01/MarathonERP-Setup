import axiosInstance from "../../lib/axios";
import type { Location } from "../../types/General/locations";

export interface fetchLocationParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FullResponseLocation {
  //   total_count(total_count: any): unknown;
  cities?: Location[];
  locations?: Location[];
  total_count: number;
  current_page: number;
  total_pages: number;
}

export async function getLocation(
  params: fetchLocationParams
): Promise<FullResponseLocation> {
  const { search, ...rest } = params;
  const ransacQuery = search ? { "q[name_cont]": search } : {};
  const response = await axiosInstance.get("/pms/locations.json", {
    params: { ...rest, ...ransacQuery },
  });
//   console.log("Response Of locations", response);
  return response.data;
}

export async function getLocationById(id: number): Promise<Location> {
  const response = await axiosInstance.get(`pms/locations/${id}.json`);
  return response.data;
}

export async function updateLocationStatus(
  id: number,
  data: Partial<Location>
): Promise<Location> {
  const res = await axiosInstance.patch(`/pms/locations/${id}.json`, {
    pms_location: data,
  });
  return res.data;
}

export async function createLocation(data: Location) {
  return axiosInstance.post(`/pms/locations.json`, {
    pms_location: data,
  });
}

export async function deletLocation(id: number): Promise<Location> {
  return axiosInstance.delete(`/pms/locations/${id}.json`);
}

export async function updateLocation(id: number, data: Location) {
  return axiosInstance.put(`/pms/locations/${id}.json`, {
    pms_location: data,
  });
}
