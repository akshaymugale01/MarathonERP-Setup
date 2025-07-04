import axiosInstance from "../lib/axios";

export async function getGeneralDropdown() {
  const [locations] = await Promise.all([
    axiosInstance.get("/pms/locations/location_dropdowns")
  ]);

  return {
    locations: locations?.data
  };
}
