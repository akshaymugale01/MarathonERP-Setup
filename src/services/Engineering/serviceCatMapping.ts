// src/services/Engineering/serviceActivity.ts

import { MappingResponse } from "../../types/Engineering/activityMapping";

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

export interface FetchMappingParam {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface FetchMappingParamResponse {
  activity_category_mappings: MappingResponse[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export async function getMapping(
  params: FetchMappingParam
): Promise<FetchMappingParamResponse> {
  const { search, page, per_page } = params;

  let queryString = "";
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());
  if (per_page) searchParams.append("per_page", per_page.toString());
  if (search) searchParams.append("q[name_cont]", search);

  queryString = searchParams.toString();
  const endpoint = `/activity_category_mappings.json${
    queryString ? `&${queryString}` : ""
  }`;

  try {
    console.log("Making request to endpoint:", endpoint);
    
    // API returns wrapped response with mapping array (not activity_category_mappings)
    const response = await getJSON<{
      mapping: MappingResponse[];
      total_count: number;
      current_page: number;
      total_pages: number;
    }>(endpoint);

    console.log("Activity Category Mappings API Response", response);
    console.log("Response keys:", Object.keys(response));
    console.log("mapping length:", response.mapping?.length);
    
    // Log each mapping to see the structure
    if (response.mapping && response.mapping.length > 0) {
      console.log("First mapping structure:", JSON.stringify(response.mapping[0], null, 2));
    }

    return {
      activity_category_mappings: response.mapping || [], // Map 'mapping' to 'activity_category_mappings'
      total_count: response.total_count || 0,
      current_page: response.current_page || 1,
      total_pages: response.total_pages || 1,
    };
  } catch (error) {
    console.error("Error fetching service activities:", error);
    console.error("Full error object:", error);
    throw error;
  }
}

export async function createserviceActivity(userData: MappingResponse) {
  try {
    const payload = {
      labour_activity: userData,
    };
    const response = await postJSON(
      "/activity_category_mappings.json",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating service activity:", error);
    throw error;
  }
}

// 2. For Detail/Edit Page
export async function getserviceActivityById(
  id: number
): Promise<MappingResponse> {
  try {
    const endpoint = `/activity_category_mappings/${id}.json`;
    const response = await getJSON<any>(endpoint);

    // Handle different possible response structures
    if (response.labour_activity) {
      return response.labour_activity;
    } else if (response.data) {
      return response.data;
    } else if (response.id) {
      // Direct object response
      return response as MappingResponse;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error(`Error fetching service activity ${id}:`, error);
    throw error;
  }
}

// Update User
export async function updateStatusserviceActivity(
  id: number,
  data: Partial<MappingResponse>
): Promise<MappingResponse> {
  try {
    const payload = {
      labour_activity: data,
    };
    const response = await postJSON(
      `/activity_category_mappings/${id}.json`,
      payload,
      "PATCH"
    );
    return response;
  } catch (error) {
    console.error(`Error updating service activity ${id}:`, error);
    throw error;
  }
}

export async function updateserviceActivity(
  id: number,
  data: Partial<MappingResponse>
): Promise<MappingResponse> {
  try {
    const payload = {
      labour_activity: data,
    };
    const response = await postJSON(
      `/activity_category_mappings/${id}.json`,
      payload,
      "PATCH"
    );
    return response;
  } catch (error) {
    console.error(`Error updating service activity ${id}:`, error);
    throw error;
  }
}

export async function deleteActivity(id: number): Promise<void> {
  try {
    await deleteJSON(`/activity_category_mappings/${id}.json`);
  } catch (error) {
    console.error(`Error deleting service activity ${id}:`, error);
    throw error;
  }
}
