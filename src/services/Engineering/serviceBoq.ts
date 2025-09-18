import {
  ServiceBoq,
  ServiceBoqListResponse,
  ServiceBoqResponse,
  ProjectsResponse,
  WorkCategoriesResponse,
  UomsResponse,
  UnitOfMeasure,
  ActivitiesResponse,
  LabourActivity,
  DescriptionsResponse,
  Description,
  FloorsResponse,
  CreateServiceBoqPayload,
  ServiceBoqSearchParams,
} from "../../types/Engineering/boqService";
import baseUrl from "../../lib/baseUrl";

export const fetchProjects = async () => {
  const response = await baseUrl.get<ProjectsResponse>("/pms/projects.json");
  return response.data;
};

export const fetchWorkCategories = async () => {
  const response = await baseUrl.get<WorkCategoriesResponse>(
    "/work_categories/work_categories_and_subcategories.json"
  );
  return response.data;
};

export const fetchUoms = async () => {
  const response = await baseUrl.get<UnitOfMeasure[]>("/unit_of_measures.json");
  // Wrap in the expected format for consistency
  return { unit_of_measures: response.data };
};

export const fetchActivities = async () => {
  const response = await baseUrl.get<LabourActivity[]>(
    "/labour_activity_list.json"
  );
  // Wrap in the expected format for consistency
  return { labour_activities: response.data };
};

export const fetchActivityList = async () => {
  const response = await baseUrl.get<LabourActivity[]>(
    "/labour_activities/labour_activity_list.json"
  );
  // Wrap in the expected format for consistency
  return { labour_activities: response.data };
};

export const fetchDescriptions = async () => {
  const response = await baseUrl.get<Description[]>("/descriptions.json");
  // Wrap in the expected format for consistency
  return { descriptions: response.data };
};

export const fetchDescriptionsList = async () => {
  const response = await baseUrl.get<Description[]>(
    "/descriptions/descriptions_list.json"
  );
  // Wrap in the expected format for consistency
  return { descriptions: response.data };
};

export const fetchFloors = async (wingId: number) => {
  const response = await baseUrl.get<FloorsResponse>(
    `/pms/floors.json?q[wing_id_eq]=${wingId}`
  );
  return response.data;
};

// Create Service BOQ
export async function postServiceBoq(
  payload: CreateServiceBoqPayload
): Promise<ServiceBoqResponse> {
  const response = await baseUrl.post<ServiceBoqResponse>(
    "/service_boqs.json",
    payload
  );
  return response.data;
}

// Update Service BOQ
export async function updateServiceBoq(
  id: string | number,
  payload: CreateServiceBoqPayload
): Promise<ServiceBoqResponse> {
  const response = await baseUrl.put<ServiceBoqResponse>(
    `/service_boqs/${id}.json`,
    payload
  );
  return response.data;
}

// Fetch Single Service BOQ for Edit/View
export async function fetchServiceBoq(
  id: string | number
): Promise<ServiceBoq> {
  const response = await baseUrl.get<ServiceBoq>(`/service_boqs/${id}.json`);
  return response.data;
}

// Fetch All Service BOQs (for listing)
export async function fetchServiceBoqs(
  params?: ServiceBoqSearchParams
): Promise<ServiceBoqListResponse> {
  const queryParams: Record<string, string> = {};

  if (params) {
    if (params.page) queryParams["page"] = params.page.toString();
    if (params.per_page) queryParams["per_page"] = params.per_page.toString();
    if (params.sort_by) queryParams["sort_by"] = params.sort_by;
    if (params.sort_order) queryParams["sort_order"] = params.sort_order;

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "search") {
            // For search, use a more general search parameter or multiple fields
            queryParams[`q[pms_project_name_or_pms_site_name_or_pms_wing_name_or_level_one_name_cont]`] = value.toString();
          } else {
            queryParams[`q[${key}]`] = value.toString();
          }
        }
      });
    }
  }

  const response = await baseUrl.get<ServiceBoqListResponse>("/service_boqs.json", {
    params: queryParams
  });
  return response.data;
}

// Delete Service BOQ
export async function deleteServiceBoq(id: string | number): Promise<void> {
  await baseUrl.delete(`/service_boqs/${id}.json`);
}
