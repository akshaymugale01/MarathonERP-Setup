import baseUrl from "../lib/baseUrl";

export interface ProjectData {
  id: number;
  project_name: string;
  sites: SiteData[];
}

export interface SiteData {
  id: number;
  site_name: string;
  wings: WingData[];
}

export interface WingData {
  id: number;
  wing_name: string;
}

export const getProjectsData = async (): Promise<ProjectData[]> => {
  try {
    const response = await baseUrl.get(`/pms/projects.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    const data = response.data;
    return data.projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getFilteredServiceIndents = async (filters: {
  projectId?: string;
  siteId?: string;
  wingId?: string;
  page?: number;
  perPage?: number;
  search?: string;
}) => {
  const token = localStorage.getItem("token") || "";

  const params = new URLSearchParams({
    token,
    ...(filters.projectId && { "q[pms_project_id_eq]": filters.projectId }),
    ...(filters.siteId && { "q[pms_site_id_eq]": filters.siteId }),
    ...(filters.wingId && { "q[pms_wing_id_eq]": filters.wingId }),
    ...(filters.page && { page: filters.page.toString() }),
    ...(filters.perPage && { per_page: filters.perPage.toString() }),
    ...(filters.search && { search: filters.search }),
  });

  try {
    const response = await baseUrl.get(
      `/service_indents.json?${params.toString()}`
    );
    const data = response.data;
    return {
      service_boqs: data.service_boqs || [],
      total_count: data.total_count || 0,
    };
  } catch (error) {
    console.error("Error fetching filtered service indents:", error);
    throw error;
  }
};
