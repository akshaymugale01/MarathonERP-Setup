// src/services/Engineering/serviceDescription.ts

import { ServiceDescription } from "../../types/Engineering/serviceDescription";

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

// Generic JSON fetch helper
async function getJSON<T>(path: string): Promise<T> {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

// Generic POST/PUT helper
async function postJSON<T>(
  path: string,
  data: any,
  method: "POST" | "PUT" | "PATCH" = "POST"
): Promise<T> {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}token=${TOKEN}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to ${method} ${path}`);
  }
  return res.json();
}

// Generic DELETE helper
async function deleteJSON(path: string): Promise<void> {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}token=${TOKEN}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to delete ${path}`);
  }
}


export interface FetchserviceDescriptionParam {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface FetchserviceDescriptionParamResponse {
    descriptions: ServiceDescription[];
    total_count: number;
    total_pages: number;
    current_page: number;
}

export async function getserviceDescriptions(params: FetchserviceDescriptionParam): Promise<FetchserviceDescriptionParamResponse> {
    const { search, page, per_page } = params;
    
    let queryString = '';
    const searchParams = new URLSearchParams();
    
    if (page) searchParams.append('page', page.toString());
    if (per_page) searchParams.append('per_page', per_page.toString());
    if (search) searchParams.append('q[name_cont]', search);
    
    queryString = searchParams.toString();
    const endpoint = `/descriptions.json${queryString ? `&${queryString}` : ''}`;
    
    try {
        // API returns wrapped response with descriptions array
        const response = await getJSON<{
            descriptions: ServiceDescription[];
            total_count: number;
            current_page: number;
            total_pages: number;
        }>(endpoint);
        
        console.log("Descriptions API Response", response);
        
        return {
            descriptions: response.descriptions || [],
            total_count: response.total_count || 0,
            current_page: response.current_page || 1,
            total_pages: response.total_pages || 1,
        };
    } catch (error) {
        console.error('Error fetching service descriptions:', error);
        throw error;
    }
}


export async function createserviceDescription(userData: ServiceDescription) {
    try {
        const payload = {
            description: userData
        };
        const response = await postJSON('/descriptions.json', payload);
        return response;
    } catch (error) {
        console.error('Error creating service description:', error);
        throw error;
    }
}

// 2. For Detail/Edit Page
export async function getserviceDescriptionById(id: number): Promise<ServiceDescription> {
  try {
    const endpoint = `/descriptions/${id}.json`;
    const response = await getJSON<any>(endpoint);
    
    // Handle different possible response structures
    if (response.description) {
      return response.description;
    } else if (response.data) {
      return response.data;
    } else if (response.id) {
      // Direct object response
      return response as ServiceDescription;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error(`Error fetching service description ${id}:`, error);
    throw error;
  }
}

// Update User
export async function updateStatusserviceDescription(id: number, data: Partial<ServiceDescription>): Promise<ServiceDescription> {
  try {
    const payload = {
      description: data
    };
    const endpoint = `/descriptions/${id}.json`;
    const response = await postJSON<any>(endpoint, payload, "PATCH");
    
    // Handle different possible response structures
    if (response.description) {
      return response.description;
    } else if (response.data) {
      return response.data;
    } else if (response.id) {
      // Direct object response
      return response as ServiceDescription;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error(`Error updating service description ${id}:`, error);
    throw error;
  }
}

export async function deleteServiceDesc(id: number): Promise<void> {
  try {
    const endpoint = `/descriptions/${id}.json`;
    await deleteJSON(endpoint);
  } catch (error) {
    console.error(`Error deleting service description ${id}:`, error);
    throw error;
  }
}


export const fetchActivityList = async () => {
  const data = await getJSON<LabourActivity[]>("/labour_activities/labour_activity_list.json");
  // Wrap in the expected format for consistency
  return { labour_activities: data };
};

export interface LabourActivity {
  id: number;
  name: string;
  code?: string;
  resource_id?: number;
}