import baseUrl from "../../../lib/baseUrl";
import { ServiceIndent } from "../../../types/Home/engineering/serviceIndent";

export interface FetchServiceIParams {
  page?: number;
  per_page?: number;
  search?: number;
}

export interface PaginatedServiceIndentParams {
  service_boqs: ServiceIndent[];
  total_pages?: number;
  current_page?: number;
  total_count?: number;
}

export interface CreateServiceIndentPayload {
  service_indent: {
    type_of_work_order: string;
    type_of_contract: string;
    pms_project_id: number;
    pms_site_id: number;
    pms_wing_id: number;
    wbs: boolean;
    status: string;
    reason: string;
    work_urgency: boolean;
    reason_for_urgency: string;
    remark: string;
    si_date: string;
    requistioner_id: string;
    pms_department_id: number;
    requested_to_department_id: number;
    work_description: string;
    vendor_attachments?: Array<{
      id?: number;
      document_file_name: string;
      filename: string;
      content?: string;
      content_type?: string;
    }>;
    internal_attachments?: Array<{
      id?: number;
      document_file_name: string;
      filename: string;
      content?: string;
      content_type?: string;
    }>;
    si_work_categories_attributes: Array<{
      id?: number;
      level_one_id?: number;
      level_two_id?: number;
      level_three_id?: number;
      level_four_id?: number;
      level_five_id?: number;
      _destroy?: boolean;
      si_boq_activities_attributes?: any[];
    }>;
  };
}

export interface UpdateServiceIndentPayload {
  service_indent: Partial<CreateServiceIndentPayload['service_indent']>;
}

// API Base URLs
// const API_BASE_URL = "https://marathon.lockated.com";
// const TOKEN = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";

// Service Indent APIs
export async function getServiceIndent(
  params: FetchServiceIParams
): Promise<PaginatedServiceIndentParams> {
  const { search, ...rest } = params;
  const rasackQuery = search ? { "q[type_of_work_order_cont]": search } : {};

  const resp = await baseUrl.get("service_indents.json", {
    params: { ...rest, ...rasackQuery },
  });
  console.log("Response", resp);
  return resp.data;
}

export async function createServiceIndent(
  payload: CreateServiceIndentPayload
): Promise<ServiceIndent> {
  const resp = await baseUrl.post("service_indents.json", payload);
  return resp.data;
}

export async function updateServiceIndent(
  id: string,
  payload: UpdateServiceIndentPayload | CreateServiceIndentPayload
): Promise<ServiceIndent> {
  const resp = await baseUrl.patch(`service_indents/${id}.json`, payload);
  return resp.data;
}

export async function getServiceIndentById(id: string): Promise<ServiceIndent> {
  const resp = await baseUrl.get(`service_indents/${id}.json`);
  return resp.data;
}

export async function fetchFloors(): Promise<any> {
  const resp = await baseUrl.get("service_indents/floor_list.json");
  return resp.data;
}

export async function fetchProjects(): Promise<any> {
  const resp = await baseUrl.get("/pms/projects.json");
  return resp.data;
}

export async function fetchDepartments(): Promise<any> {
  const resp = await baseUrl.get("/pms/departments.json");
  return resp.data;
}

export async function fetchWorkCategories(): Promise<any> {
  const resp = await baseUrl.get("/service_indents/work_category_list.json");
  return resp.data;
}

export async function fetchWorkSubCategories(): Promise<any> {
  const resp = await baseUrl.get(
    "/service_indents/work_sub_category_list.json"
  );
  return resp.data;
}

export async function fetchWorkCategoryMappings(params?: {
  work_category_id?: string;
  work_sub_category_id?: string;
}): Promise<any> {
  const queryParams: Record<string, string> = {};
  
  if (params) {
    if (params.work_category_id) {
      queryParams["q[id_eq]"] = params.work_category_id;
    }
    if (params.work_sub_category_id) {
      queryParams["q[work_sub_categories_id_eq]"] = params.work_sub_category_id;
    }
  }

  const resp = await baseUrl.get("/service_indents/work_category_mapp_list.json", {
    params: queryParams
  });
  return resp.data;
}

export async function fetchServiceBoq(params?: {
    level_one_id?: number;
    level_two_id?: number;
    level_three_id?: number;
    level_four_id?: number;
    level_five_id?: number;
}): Promise<any> {
    const queryParams: Record<string, string> = {};
    
    if (params) {
        if (params.level_one_id) queryParams.level_one_id = params.level_one_id.toString();
        if (params.level_two_id) queryParams.level_two_id = params.level_two_id.toString();
        if (params.level_three_id) queryParams.level_three_id = params.level_three_id.toString();
        if (params.level_four_id) queryParams.level_four_id = params.level_four_id.toString();
        if (params.level_five_id) queryParams.level_five_id = params.level_five_id.toString();
    }

    const resp = await baseUrl.get("/service_boqs.json", {
        params: queryParams
    });
    return resp.data;
}
