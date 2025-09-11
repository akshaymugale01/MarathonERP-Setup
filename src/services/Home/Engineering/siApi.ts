import baseUrl from "../../../lib/baseUrl";
import { StatusUpdate } from "../../../types/si";
import { ServiceIndent } from "../../../types/Home/engineering/serviceIndent";

// Service Indent API for status management
export const siApi = {
  // Get service indent by ID
  getServiceIndent: async (id: number): Promise<ServiceIndent> => {
    const response = await baseUrl.get(`/service_indents/${id}.json`);
    return response.data;
  },

  // Update service indent status
  updateStatus: async (id: number, statusData: StatusUpdate): Promise<void> => {
    const payload = {
    //   service_indent: {
        status_log: {
            status: statusData.status || "",
          remarks: statusData.remarks || "",
          comments: statusData.comments || "",
          operator_id: statusData.operator_id,
        }
    //   }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },

  // Get approval logs
  getApprovalLogs: async (id: number) => {
    const response = await baseUrl.get(`/service_indents/${id}/approval_logs.json`);
    return response.data;
  },

  // Submit for approval (draft -> submitted)
  submitForApproval: async (id: number, remarks?: string): Promise<void> => {
    const payload = {
      service_indent: {
        status: "submitted",
        status_update: {
          remarks: remarks || "Submitted for approval",
          comments: "Service Indent submitted for approval workflow",
        }
      }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },

  // Site head approval
  siteHeadApproval: async (id: number, approved: boolean, remarks?: string): Promise<void> => {
    const status = approved ? "site_approved" : "rejected";
    const payload = {
      service_indent: {
        status,
        status_update: {
          remarks: remarks || (approved ? "Approved by Site Head" : "Rejected by Site Head"),
          comments: approved ? "Site Head approval completed" : "Site Head rejected the request",
        }
      }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },

  // Estimation executive approval
  estimationApproval: async (id: number, approved: boolean, remarks?: string): Promise<void> => {
    const status = approved ? "estimation_approved" : "rejected";
    const payload = {
      service_indent: {
        status,
        status_update: {
          remarks: remarks || (approved ? "Approved by Estimation Executive" : "Rejected by Estimation Executive"),
          comments: approved ? "Estimation Executive approval completed" : "Estimation Executive rejected the request",
        }
      }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },

  // Management decision (accept/reject)
  managementDecision: async (id: number, accepted: boolean, operatorId?: number, remarks?: string): Promise<void> => {
    const status = accepted ? "accepted" : "rejected";
    const payload = {
      service_indent: {
        status,
        status_update: {
          remarks: remarks || (accepted ? "Accepted by Management" : "Rejected by Management"),
          comments: accepted ? "Management accepted and assigned operator" : "Management rejected the request",
          operator_id: operatorId,
        }
      }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },

  // Cancel SI
  cancelSI: async (id: number, remarks?: string): Promise<void> => {
    const payload = {
      service_indent: {
        status: "cancelled",
        status_update: {
          remarks: remarks || "Service Indent cancelled",
          comments: "Service Indent has been cancelled",
        }
      }
    };
    
    await baseUrl.patch(`/service_indents/${id}/update_status.json`, payload);
  },
};
