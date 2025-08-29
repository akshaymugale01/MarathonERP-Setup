export interface ServiceIndent {
  id: number;
  type_of_work_order: string;
  type_of_contract: string;
  pms_project_id: number;
  project_name: string;
  site_name: string;
  pms_site_id: number;
  pms_wing_id: number;
  wbs: boolean;
  status: string;
  reason: string;
  work_urgency: boolean;
  reason_for_urgency: string;
  remark: string;
  si_date: string;
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
}

export interface SiFloor {
  id: number;
  service_indent_id: number;
  pms_floor_id: number;
  created_at: string;
  updated_at: string;
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
  from_location: string;
  to_location: string;
  status: string;
  reason_for_variation: string;
  reason_for_amendment: string;
  work_urgency: string;
  reason_for_urgency: string;
  remark: string;
  si_date: string;
  created_on: string;
  requisitioner_name: string;
  department_name: string;
  requested_to_department: string;
  work_description: string;
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
  boq_activity_id: number;
  boq_activity_name: string;
  services: {
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

export interface RecentOrder {
  sl_no: string;
  created_on: string;
  status: string;
  location: string;
  activity: string;
}
