import axiosInstance from "../lib/axios";

export async function getDropdownData() {
    // Proper Serial Mandatory 
    const [titles, companies, projects, sites ,branches,  departments, designations, roles, divisions, bands, users, wings, associated_sites ] = 
    await Promise.all([
        // Serial all Properly Above as it is
        axiosInstance.get('/name_titles.json'),
        axiosInstance.get('/pms/company_setups.json'),
        axiosInstance.get('/pms/projects.json'),
        axiosInstance.get('/pms/sites.json'),
        axiosInstance.get('/pms/branches.json'),
        axiosInstance.get('/pms/departments.json'),
        axiosInstance.get('/pms/designations.json'),
        // axiosInstance.get('/pms/lock_roles.json'),
        axiosInstance.get('/pms/lock_roles.json'),
        axiosInstance.get('/pms/divisions.json'),
        axiosInstance.get('/pms/bands.json'),
        axiosInstance.get('/users.json'),
        axiosInstance.get('/pms/wings.json'),
        axiosInstance.get('/pms/sites/accociated_sites_fetch.json')
    ])
    
    return{
        // Serial all Properly
        titles: titles?.data?.name_titles,
        companies: companies?.data.companies,
        projects: projects?.data?.projects,
        sites: sites?.data?.sites,
        branches: branches?.data,
        departments: departments?.data?.pms_departments,
        designations: designations?.data?.designations,
        roles: roles?.data,
        divisions: divisions?.data,
        bands: bands?.data?.pms_bands,
        users: users?.data,
        wings: wings?.data,
        associated_sites: associated_sites?.data?.data
    }
}
