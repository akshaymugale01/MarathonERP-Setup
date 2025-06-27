// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { Material } from "../types/material";

// Params for paginated API
export interface FetchMaterialParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedMaterialResponse {
  materials: Material[];
  total_count: number;
  total_pages: number;
  current_page: number;
}


export async function getMaterial(params: FetchMaterialParams) : Promise<PaginatedMaterialResponse> {
    const {search, ...rest} = params;
    const rasackQuery = search ? {'q[material_category_or_inventory_type_name_or_hsn_hsn_code_or_warranty_remarks_or_remark_or_name_or_perishable_time_or_warranty_period_or_stock_type_or_urgent_lead_time_or_benchmark_lead_time_or_manufacture_tolerance_or_breakage_tolerance_or_wastage_tolerance_or_perishable_time_type_or_typical_warranty_time_type_or_typical_warranty_time_or_material_tag_cont]': search} : {}; 
    const response = await axiosInstance.get("pms/inventories.json", {
        params: {...rest, ...rasackQuery},
    });
    console.log("User API Response", response);
    return response.data
}

export async function createMaterial(materialData: Material) {
    return axiosInstance.post('/pms/inventories',  {pms_inventory: materialData});
}

// 2. For Detail/Edit Page
export async function getMaterialById(id: number): Promise<Material> {
  const response = await axiosInstance.get(`/pms/inventories/${id}.json`,);
  return response.data;
}

// Update User
export async function updateStatusMaterial(id: number, data: Partial<Material>): Promise<Material> {
  const response = await axiosInstance.patch(`/pms/inventories/${id}.json`, {pms_inventory: data});
  return response.data;
}
