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
  ServiceBoqSearchParams
} from '../../types/Engineering/boqService';

const BASE = "https://marathon.lockated.com";

// Get token from URL params or localStorage
function getToken(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get("token");

  if (tokenFromUrl) {
    localStorage.setItem("auth_token", tokenFromUrl);
    return tokenFromUrl;
  }

  return (
    localStorage.getItem("token") ||
    "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
  );
}

const TOKEN = getToken();

async function getJSON<T>(path: string): Promise<T> {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

export const fetchProjects = () => getJSON<ProjectsResponse>("/pms/projects.json");
export const fetchWorkCategories = () =>
  getJSON<WorkCategoriesResponse>("/work_categories/work_categories_and_subcategories.json");
export const fetchUoms = async () => {
  const data = await getJSON<UnitOfMeasure[]>("/unit_of_measures.json");
  // Wrap in the expected format for consistency
  return { unit_of_measures: data };
};
export const fetchActivities = async () => {
  const data = await getJSON<LabourActivity[]>("/labour_activities.json");
  // Wrap in the expected format for consistency
  return { labour_activities: data };
};
export const fetchDescriptions = async () => {
  const data = await getJSON<Description[]>("/descriptions.json");
  // Wrap in the expected format for consistency
  return { descriptions: data };
};
export const fetchFloors = (wingId: number) => 
  getJSON<FloorsResponse>(`/pms/floors.json?q[wing_id_eq]=${wingId}`);

// Create Service BOQ
export async function postServiceBoq(payload: CreateServiceBoqPayload): Promise<ServiceBoqResponse> {
  const url = `${BASE}/service_boqs.json?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create Service BOQ");
  }
  return res.json();
}

// Update Service BOQ
export async function updateServiceBoq(
  id: string | number, 
  payload: CreateServiceBoqPayload
): Promise<ServiceBoqResponse> {
  const url = `${BASE}/service_boqs/${id}.json?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update Service BOQ");
  }
  return res.json();
}

// Fetch Single Service BOQ for Edit/View
export async function fetchServiceBoq(id: string | number): Promise<ServiceBoq> {
  return getJSON<ServiceBoq>(`/service_boqs/${id}.json`);
}

// Fetch All Service BOQs (for listing)
export async function fetchServiceBoqs(params?: ServiceBoqSearchParams): Promise<ServiceBoqListResponse> {
  let queryString = '';
  
  if (params) {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(`q[${key}]`, value.toString());
        }
      });
    }
    
    queryString = searchParams.toString();
  }
  
  const endpoint = `/service_boqs.json${queryString ? `&${queryString}` : ''}`;
  return getJSON<ServiceBoqListResponse>(endpoint);
}

// Delete Service BOQ
export async function deleteServiceBoq(id: string | number): Promise<void> {
  const url = `${BASE}/service_boqs/${id}.json?token=${TOKEN}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete Service BOQ");
  }
}
