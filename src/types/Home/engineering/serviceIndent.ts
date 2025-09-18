export interface ServiceIndent {
  id: number;
  type_of_work_order: string;
  type_of_contract: string;
  pms_project_id: number;
  project_name: string;
  site_name: string;
  pms_site_id: number;
  pms_wing_id: number;
  wing_name: string;
  wbs: boolean;
  status: string;
  reason: string;
  work_urgency: boolean;
  reason_for_urgency: string;
  remark: string;
  si_date: string;
  si_code: string;
  requistioner_id: string;
  requistioner_name: string;
  pms_department_id: number;
  department_name?: string;
  requested_to_department_id: number;
  requested_to_department?: string;
  work_description: string;
  created_at: string;
  updated_at: string;
  si_floors: SiFloor[];
  si_work_categories: SiWorkCategory[];
  status_logs: StatusLog[];
  invoice_approval_histories?: InvoiceApprovalHistory[];
  vendor_attachments?: AttachmentData[];
  internal_attachments?: AttachmentData[];
}

export interface SiFloor {
  id: number;
  floor_name: string;
  service_indent_id: number;
  pms_floor_id: number;
  created_at: string;
  updated_at: string;
}

export interface StatusLog {
  id: number;
  resource_id: number;
  resource_type: string;
  status: string;
  created_by_id: number;
  operator_id: number;
  remarks: string;
  comments: string;
  admin_comment: string;
  admin_id: number;
  commented_at: string;
  remarks_from: string;
  display_status: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceApprovalHistory {
  id: number;
  invoice_approval_level_id: number;
  approve: boolean | null;
  rejection_reason: string | null;
  updated_by_id: number | null;
  resource_id: number;
  resource_type: string;
  rectify_comments: string | null;
  status_updated_at: string | null;
  status_rectified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  vendor_category_id: number | null;
  delegate_to_id: number | null;
  delegate_remark: string | null;
  invoice_approval_level_approvers: string[];
  invoice_approval_level_name: string;
  updated_by_name: string | null;
}

export interface SiWorkCategory {
  id: number;
  level_one_id: number;
  level_one_name: string;
  level_two_name: string;
  level_two_id: number;
  level_three_id: number;
  level_three_name?: string;
  level_four_id: number;
  level_four_name?: string;
  level_five_id: number | null;
  level_five_name?: string;
  planned_date_start_work?: string;
  planned_finish_date?: string;
  si_boq_activities: SiBoqActivity[];
}

export interface SiBoqActivity {
  id: number;
  boq_activity_id: number;
  boq_activity_name: string;
  si_boq_activity_services: SiBoqActivityService[];
}

export interface SiBoqActivityService {
  id: number;
  boq_activity_service_id: number;
  service_name: string;
  required_qty: string;
  executed_qty: string;
  wo_cumulative_qty: string;
  abstract_cumulative_qty: string;
}

// Form-specific interfaces
export interface ServiceIndentFormData {
  type_of_work_order: string;
  project: string;
  sub_project: string;
  wing: string;
  wbs: boolean;
  type_of_contract: string;
  work_urgency: string;
  status: string;
  si_date: string;
  created_on: string;
  reason_for_variation: string;
  reason_for_amendment: string;
  reason_for_urgency: string;
  remark: string;
  work_description: string;
  requisitioner_name: string;
  department_name: string;
  requested_to_department: string;
  selection_type: string; // Add selection_type field
  from_floor: string;
  to_floor: string;
  multi_floors: number[];
  suggested_floor: string;
  si_floors_attributes?: { id?: number; pms_floor_id: number }[];
}

export interface WorkCategory {
  id: string;
  level_one_id: number;
  level_one_name: string;
  level_two_id: number;
  level_two_name: string;
  level_three_id?: number;
  level_three_name?: string;
  level_four_id?: number;
  level_four_name?: string;
  level_five_id?: number;
  level_five_name?: string;
  planned_date_start_work: string;
  planned_finish_date: string;
  boq: string;
  _destroy?: boolean;
}

export interface SelectedCategory {
  id: string;
  level_one_id: number;
  level_one_name: string;
  level_two_id: number;
  level_two_name: string;
  level_three_id?: number;
  level_three_name?: string;
  level_four_id?: number;
  level_four_name?: string;
  level_five_id?: number;
  level_five_name?: string;
  planned_date_start_work: string;
  planned_finish_date: string;
}

export interface SelectedBOQData {
  id?: number; // Database ID for existing BOQ activity records
  boq_activity_id: number;
  boq_activity_name: string;
  services: {
    id?: number; // Database ID for existing BOQ service records
    boq_activity_service_id: number;
    service_name: string;
    required_qty: string;
    executed_qty: string;
    wo_cumulative_qty: string;
    abstract_cumulative_qty: string;
  }[];
}

export interface AttachmentItem {
  id: string;
  document_name: string;
  document_type?: string; // For backward compatibility
  file_name: string;
  upload_at: string;
  upload_file: File | null;
  action: string;
  url?: string; // URL to view/download the file
  content_type?: string; // MIME type of the file
}

export interface AttachmentData {
  id: number;
  document_name: string;
  filename: string;
  created_at: string;
  url?: string;
  doc_path?: string;
  content_type?: string;
}

export interface RecentOrder {
  sl_no: string;
  created_on: string;
  status: string;
  location: string;
  activity: string;
}

// Status and Approval Management
export interface StatusLog {
  id: number;
  status: string;
  operator_id: number;
  operator_name: string;
  remarks: string;
  comments: string;
  admin_comment: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalLog {
  id: number;
  approval_type: "site_head" | "estimation_executive";
  approval_status: "pending" | "approved" | "rejected";
  approver_id: number;
  approver_name: string;
  comments: string;
  approved_at: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceIndentDetails extends ServiceIndent {
  status_logs: StatusLog[];
  approval_logs: ApprovalLog[];
  current_approval_stage?: "site_head" | "estimation_executive" | "completed";
  can_edit: boolean;
  can_approve: boolean;
  can_manage: boolean;
  // Work management fields
  assigned_operator_name?: string;
  work_start_date?: string;
  planned_completion_date?: string;
  completion_date?: string;
  operator_remarks?: string;
  work_quality_rating?: number;
  contractor_performance_rating?: number;
  final_remarks?: string;
}

export interface StatusUpdateRequest {
  status: string;
  operator_id?: number;
  remarks?: string;
  comments?: string;
  admin_comment?: string;
  // Work management fields
  operator_name?: string;
  work_start_date?: string;
  planned_completion_date?: string;
  completion_date?: string;
  work_quality_rating?: number;
  contractor_performance_rating?: number;
}

export interface ApprovalRequest {
  approval_type: "site_head" | "estimation_executive";
  approval_status: "approved" | "rejected";
  comments: string;
}

export type ServiceIndentStatus =
  | "draft"
  | "submitted"
  | "site_head_approved"
  | "estimation_executive_approved"
  | "approved"
  | "rejected"
  | "in_progress"
  | "accepted"
  | "completed";
