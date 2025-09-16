export interface StatusUpdate {
  status: string;
  remarks?: string;
  comments?: string;
  operator_id?: number;
  type?: string;
}

export interface ApprovalLog {
  sr_no: number;
  approval_level: string;
  approved_by: string;
  date: string;
  status: string;
  remark: string;
  users: string[];
}

export interface ApprovalStatus {
  all_approved: boolean;
  pending_approvers?: string[];
  approved_by?: string[];
  current_approval_level?: string;
}

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "cancelled", label: "Cancelled" },
  { value: "site_approved", label: "Site Head Approved" },
  { value: "estimation_approved", label: "Estimation Executive Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "accepted", label: "Accepted" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const SI_WORKFLOW_STATUSES = {
  DRAFT: "draft",
  SUBMITTED: "submitted", 
  CANCELLED: "cancelled",
  SITE_APPROVED: "site_approved",
  ESTIMATION_APPROVED: "estimation_approved",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type SIStatus = keyof typeof SI_WORKFLOW_STATUSES;
