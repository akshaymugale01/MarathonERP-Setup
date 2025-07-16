import axiosInstance from "../lib/axios";

export async function getDropdownData() {
  const [associatedSites, dropdownData] = await Promise.all([
    // axiosInstance.get("/name_titles.json"),
    axiosInstance.get("/pms/sites/accociated_sites_fetch.json"),
    axiosInstance.get("/dropdown/reference_data.json"), // 👈 Combined API
  ]);

  const dropdowns = dropdownData?.data || {};

  return {
    // Still use old APIs where needed
    associated_sites: associatedSites?.data?.data,
    // Combined API values
    users: dropdowns?.users,
    titles: dropdowns?.name_titles,
    companies: dropdowns?.companies,
    projects: dropdowns?.projects,
    sites: dropdowns?.sites,
    branches: dropdowns?.branches,
    user_groups: dropdowns?.user_groups,
    ip_configurations: dropdowns?.ip_configurations,
    wings: dropdowns?.wings,
    departments: dropdowns?.departments,
    designations: dropdowns?.designations,
    roles: dropdowns?.lock_roles,
    divisions: dropdowns?.divisions,
    bands: dropdowns?.bands,
    suppliers: dropdowns?.suppliers,
    organizations: dropdowns?.organizations,
    countries: dropdowns?.countries,
    states: dropdowns?.states,
    cities: dropdowns?.cities,
    locations: dropdowns?.locations,
    development_type: dropdowns?.development_type,
  };
}
