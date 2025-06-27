import axiosInstance from "../lib/axios";

export async function getPurchaseDropdown() {
  const [inventory_type, inventory_sub_type, hsn_codes ] = await Promise.all([
    axiosInstance.get("/pms/inventory_types.json"),
    axiosInstance.get("/pms/inventory_sub_types.json"),
    axiosInstance.get("/pms/hsns.json"),

  ]);

  return {
    inventory_types: inventory_type?.data?.dropdown,
    inventory_sub_type: inventory_sub_type.data.dropdown,
    hsn_codes: hsn_codes?.data?.dropdown,
  };
}
