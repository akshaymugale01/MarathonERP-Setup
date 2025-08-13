// src/services/Engineering/serviceActivity.ts

import { serviceActivity } from "../../types/Engineering/serviceActivity";

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

export interface FetchserviceActivityParam {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface FetchserviceActivityParamResponse {
    labour_activities: serviceActivity[];
    total_count: number;
    total_pages: number;
    current_page: number;
}

export async function getserviceActivitys(params: FetchserviceActivityParam): Promise<FetchserviceActivityParamResponse> {
    const { search, page, per_page } = params;
    
    let queryString = '';
    const searchParams = new URLSearchParams();
    
    if (page) searchParams.append('page', page.toString());
    if (per_page) searchParams.append('per_page', per_page.toString());
    if (search) searchParams.append('q[name_cont]', search);
    
    queryString = searchParams.toString();
    const endpoint = `/labour_activities.json${queryString ? `&${queryString}` : ''}`;
    
    try {
        // API returns wrapped response with labour_activities array
        const response = await getJSON<{
            labour_activities: serviceActivity[];
            total_count: number;
            current_page: number;
            total_pages: number;
        }>(endpoint);
        
        console.log("Labour Activities API Response", response);
        
        return {
            labour_activities: response.labour_activities || [],
            total_count: response.total_count || 0,
            current_page: response.current_page || 1,
            total_pages: response.total_pages || 1,
        };
    } catch (error) {
        console.error('Error fetching service activities:', error);
        throw error;
    }
}

export async function createserviceActivity(userData: serviceActivity) {
    try {
        const payload = {
            labour_activity: userData
        };
        const response = await postJSON('/labour_activities.json', payload);
        return response;
    } catch (error) {
        console.error('Error creating service activity:', error);
        throw error;
    }
}

// 2. For Detail/Edit Page
export async function getserviceActivityById(id: number): Promise<serviceActivity> {
  try {
    const endpoint = `/labour_activities/${id}.json`;
    const response = await getJSON<any>(endpoint);
    
    // Handle different possible response structures
    if (response.labour_activity) {
      return response.labour_activity;
    } else if (response.data) {
      return response.data;
    } else if (response.id) {
      // Direct object response
      return response as serviceActivity;
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error(`Error fetching service activity ${id}:`, error);
    throw error;
  }
}

// Update User
export async function updateStatusserviceActivity(id: number, data: Partial<serviceActivity>): Promise<serviceActivity> {
  try {
    const payload = {
      labour_activity: data
    };
    const response = await postJSON(`/labour_activities/${id}.json`, payload, 'PATCH');
    return response;
  } catch (error) {
    console.error(`Error updating service activity ${id}:`, error);
    throw error;
  }
}

export async function updateserviceActivity(id: number, data: Partial<serviceActivity>): Promise<serviceActivity> {
  try {
    const payload = {
      labour_activity: data
    };
    const response = await postJSON(`/labour_activities/${id}.json`, payload, 'PATCH');
    return response;
  } catch (error) {
    console.error(`Error updating service activity ${id}:`, error);
    throw error;
  }
}

export async function deleteActivity(id: number): Promise<void> {
  try {
    await deleteJSON(`/labour_activities/${id}.json`);
  } catch (error) {
    console.error(`Error deleting service activity ${id}:`, error);
    throw error;
  }
}