import axiosInstance from "../lib/axios";

export async function getDropdownData() {
    const [titles,companies, branches, bands ,departments, designations, divisions ,roles, manegers] = 
    await Promise.all([
        axiosInstance.get('/name_titles.json'),
        axiosInstance.get('/pms/company_setups.json'),
        axiosInstance.get('/pms/branches.json'),
        axiosInstance.get('/pms/departments.json'),
        axiosInstance.get('/pms/designations.json'),
        axiosInstance.get('/pms/lock_roles.json'),
        axiosInstance.get('/pms/lock_roles.json'),
        axiosInstance.get('/pms/divisions.json'),
        axiosInstance.get('/pms/bands.json'),
        axiosInstance.get('/users.json')
    ])

    return{
        titles: titles?.data,
        companies: companies?.data,
        branches: branches?.data,
        departments: departments?.data,
        designations: designations?.data,
        roles: roles?.data,
        manegers: manegers?.data,
        divisions: divisions?.data,
        bands: bands.data
    }
}


// seperate fetch api
// export const fetchCompanies = () => axiosInstance.get('/pms/companies');