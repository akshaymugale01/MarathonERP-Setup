import api from "../../../lib/axios";
import baseUrl from "../../../lib/baseUrl";
import { 
  ServiceIndentDetails, 
  StatusUpdateRequest, 
  ApprovalRequest, 
  StatusLog, 
  ApprovalLog 
} from "../../../types/Home/engineering/serviceIndent";

// Get service indent details with status and approval logs
export const getServiceIndentDetails = async (id: number): Promise<ServiceIndentDetails> => {
  const response = await baseUrl.get(`/service_indents/${id}`);
  return response.data;
};

// Update service indent status
export const updateServiceIndentStatus = async (
  id: number,
  statusData: StatusUpdateRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await baseUrl.patch(`/service_indents/${id}/update_status`, {
    status_log: statusData
  });
  return response.data;
};

// Submit approval decision
export const submitApproval = async (
  id: number,
  approvalData: ApprovalRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await baseUrl.patch(`/service_indents/${id}/approve`, {
    approval: approvalData
  });
  return response.data;
};

// Get status logs
export const getStatusLogs = async (id: number): Promise<StatusLog[]> => {
  const response = await baseUrl.get(`/service_indents/${id}/status_logs`);
  return response.data.status_logs || [];
};

// Get approval logs
export const getApprovalLogs = async (id: number): Promise<ApprovalLog[]> => {
  const response = await baseUrl.get(`/service_indents/${id}/approval_logs`);
  return response.data.approval_logs || [];
};

// Check if user can edit/approve/manage
export const getServiceIndentPermissions = async (id: number): Promise<{
  can_edit: boolean;
  can_approve: boolean;
  can_manage: boolean;
  current_approval_stage?: string;
}> => {
  const response = await baseUrl.get(`/service_indents/${id}/permissions`);
  return response.data;
};
