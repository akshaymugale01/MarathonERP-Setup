import axiosInstance from "../../lib/axios";
import type { Company } from "../../types/General/companies";

export interface fetchCompanyParams{
    page?: number;
    per_page?:number;
    search?: string;
}

export interface FullResponseCompany{
    pms_company_setups: Company[];
    total_count: number;
    total_pages: number;
    current_page: number;
}


export async function getCompanySetup(params: fetchCompanyParams): Promise<FullResponseCompany> {
    const { search, ...rest } = params;
    const queryParams = {
        ...rest,
        ...(search ? { ['q[name_cont]']: search } : {})
    };
    const response = await axiosInstance.get('/pms/company_setups.json', {
        params: queryParams,
    });
    console.log("response", response);
    return response.data;
}

export async function createCompany(data: Company) {
   // Check if there's a file upload in logo_attributes
   const hasFileUpload = data.logo_attributes?.document instanceof File;
   
   if (hasFileUpload) {
     const formData = new FormData();
     
     // Append all form fields
     Object.entries(data).forEach(([key, value]) => {
       if (key === 'logo_attributes') {
         // Handle logo_attributes separately
         if (data.logo_attributes) {
           if (data.logo_attributes.document instanceof File) {
             formData.append('pms_company_setup[logo_attributes][document]', data.logo_attributes.document);
           }
           if (data.logo_attributes.id) {
             formData.append('pms_company_setup[logo_attributes][id]', data.logo_attributes.id.toString());
           }
           formData.append('pms_company_setup[logo_attributes][active]', String(data.logo_attributes.active || true));
           if (data.logo_attributes._destroy) {
             formData.append('pms_company_setup[logo_attributes][_destroy]', 'true');
           }
         }
       } else if (key === 'company_gstin_details_attributes' && Array.isArray(value)) {
         // Handle GSTIN attributes
         value.forEach((gstin, index) => {
           Object.entries(gstin).forEach(([gstinKey, gstinValue]) => {
             formData.append(`pms_company_setup[company_gstin_details_attributes][${index}][${gstinKey}]`, String(gstinValue));
           });
         });
       } else if (typeof value === 'object' && value !== null) {
         // Handle nested objects
         Object.entries(value).forEach(([nestedKey, nestedValue]) => {
           formData.append(`pms_company_setup[${key}][${nestedKey}]`, String(nestedValue));
         });
       } else if (value !== null && value !== undefined) {
         formData.append(`pms_company_setup[${key}]`, String(value));
       }
     });
     
     const response = await axiosInstance.post(`/pms/company_setups.json`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     return response.data;
   } else {
     // Regular JSON request
     const response = await axiosInstance.post(`/pms/company_setups.json`, {
       pms_company_setup: data,
     });
     return response.data;
   }
}

export async function updateCompany(id: number, data: Company) {
   // Check if there's a file upload in logo_attributes
   const hasFileUpload = data.logo_attributes?.document instanceof File;
   
   if (hasFileUpload) {
     const formData = new FormData();
     
     // Append all form fields
     Object.entries(data).forEach(([key, value]) => {
       if (key === 'logo_attributes') {
         // Handle logo_attributes separately
         if (data.logo_attributes) {
           if (data.logo_attributes.document instanceof File) {
             formData.append('pms_company_setup[logo_attributes][document]', data.logo_attributes.document);
           }
           if (data.logo_attributes.id) {
             formData.append('pms_company_setup[logo_attributes][id]', data.logo_attributes.id.toString());
           }
           formData.append('pms_company_setup[logo_attributes][active]', String(data.logo_attributes.active || true));
           if (data.logo_attributes._destroy) {
             formData.append('pms_company_setup[logo_attributes][_destroy]', 'true');
           }
         }
       } else if (key === 'company_gstin_details_attributes' && Array.isArray(value)) {
         // Handle GSTIN attributes
         value.forEach((gstin, index) => {
           Object.entries(gstin).forEach(([gstinKey, gstinValue]) => {
             formData.append(`pms_company_setup[company_gstin_details_attributes][${index}][${gstinKey}]`, String(gstinValue));
           });
         });
       } else if (typeof value === 'object' && value !== null) {
         // Handle nested objects
         Object.entries(value).forEach(([nestedKey, nestedValue]) => {
           formData.append(`pms_company_setup[${key}][${nestedKey}]`, String(nestedValue));
         });
       } else if (value !== null && value !== undefined) {
         formData.append(`pms_company_setup[${key}]`, String(value));
       }
     });
     
     const response = await axiosInstance.put(`/pms/company_setups/${id}.json`, formData, {
       headers: {
         'Content-Type': 'multipart/form-data',
       },
     });
     return response.data;
   } else {
     // Regular JSON request
     const response = await axiosInstance.put(`/pms/company_setups/${id}.json`, {
       pms_company_setup: data
     });
     return response.data;
   }
}
export async function updateStatusCompany(id: number, data: Partial<Company>): Promise<Company> {
    const response = await axiosInstance.patch(`/pms/company_setups/${id}.json`, {
        pms_company_setup: data
    });
    return response.data;
}

export async function getCompanyById(id: number): Promise<Company> {
    try {
        const response = await axiosInstance.get(`/pms/company_setups/${id}.json`);
        const companyData = response.data.pms_company_setup || response.data;
        if (!companyData) {
            throw new Error("No company data found in response");
        }
        return companyData;
    } catch (error) {
        console.error("getCompanyById - Error:", error);
        console.error("getCompanyById - Error response:", (error as { response?: { data?: unknown } })?.response?.data);
        throw error;
    }
}

export async function deleteCompany(id: number) {
    const response = await axiosInstance.delete(`/pms/company_setups/${id}.json`);
    return response.data;
}