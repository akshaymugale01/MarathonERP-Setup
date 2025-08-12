// Base entities
export interface Project {
  id: number;
  name: string;
  formatted_name: string;
  code?: string;
  description?: string;
  pms_sites?: Site[];
}

export interface Site {
  id: number;
  name: string;
  formatted_name: string;
  project_id: number;
  pms_wings?: Wing[];
}

export interface Wing {
  id: number;
  name: string;
  formatted_name: string;
  site_id: number;
  floors?: Floor[];
}

export interface Floor {
  id: number;
  name: string;
  wing_id: number;
  quantity?: number;
  wastage?: number;
}

export interface WorkCategory {
  id: number;
  name: string;
  code?: string;
  work_sub_categories?: WorkSubCategory[];
}

export interface WorkSubCategory {
  id: number;
  name: string;
  code?: string;
  work_category_id: number;
  work_sub_categories?: WorkSubCategory[];
}

export interface UnitOfMeasure {
  id: number;
  name: string;
  uom_short_name: string;
  symbol?: string;
}

export interface LabourActivity {
  id: number;
  name: string;
  code?: string;
  resource_id?: number;
}

export interface Description {
  id: number;
  name: string;
  resource_id: number;
  labour_activity_id?: number;
}

// Service BOQ related types
export interface ServiceBoqFloor {
  floor_id: number;
  quantity: number;
  wastage: number;
  floor?: Floor;
}

export interface ServiceBoqActivity {
  name: string;
  uom_id: number;
  quantity: number;
  wastage: number;
  total_qty: number;
  boq_activity_services_by_floors_attributes: ServiceBoqFloor[];
  uom?: UnitOfMeasure;
}

export interface BoqActivity {
  labour_activity_id: number;
  description_id: number;
  boq_activity_services_attributes: ServiceBoqActivity[];
  labour_activity?: LabourActivity;
  description?: Description;
}

// Main Service BOQ interface
export interface ServiceBoq {
  id: number;
  project_id: number;
  subproject_id: number;
  wing_id: number;
  level_one_id: number;
  level_two_id?: number;
  level_three_id?: number;
  level_four_id?: number;
  level_five_id?: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  project?: Project;
  subproject?: Site;
  wing?: Wing;
  level_one?: WorkCategory;
  level_two?: WorkSubCategory;
  level_three?: WorkSubCategory;
  level_four?: WorkSubCategory;
  level_five?: WorkSubCategory;
  boq_activities?: BoqActivity[];
}

// Form data interfaces
export interface ServiceBoqFormData {
  project: string;
  site: string;
  wing: string;
  levelOne: string;
  levelTwo?: string;
  levelThree?: string;
  levelFour?: string;
  levelFive?: string;
  levelSix?: string;
}

export interface ServiceRow {
  id: string;
  checked: boolean;
  name: string;
  uomId?: number;
  quantity: number;
  wastage: number;
  floors?: Floor[];
}

export interface ActivityBlock {
  labourActivityId?: number;
  descriptionId?: number;
  rows: ServiceRow[];
}

// API payload interfaces
export interface CreateServiceBoqPayload {
  service_boq: {
    project_id: number;
    subproject_id: number;
    wing_id: number;
    level_one_id: number;
    level_two_id?: number;
    level_three_id?: number;
    level_four_id?: number;
    level_five_id?: number;
    boq_activities_attributes: {
      labour_activity_id: number;
      description_id: number;
      boq_activity_services_attributes: {
        name: string;
        uom_id: number;
        quantity: number;
        wastage: number;
        total_qty: number;
        boq_activity_services_by_floors_attributes: {
          floor_id: number;
          quantity: number;
          wastage: number;
        }[];
      }[];
    }[];
  };
}

// API response interfaces
export interface ServiceBoqListResponse {
  service_boqs: ServiceBoq[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface ServiceBoqResponse {
  service_boq: ServiceBoq;
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface WorkCategoriesResponse {
  work_categories: WorkCategory[];
}

export interface UomsResponse {
  unit_of_measures: UnitOfMeasure[];
}

export interface ActivitiesResponse {
  labour_activities: LabourActivity[];
}

export interface DescriptionsResponse {
  descriptions: Description[];
}

export interface FloorsResponse {
  floors: Floor[];
}

// Option interfaces for select components
export interface SelectOption {
  value: string | number;
  label: string;
  data?: Record<string, unknown>;
}

// Form mode type
export type ServiceBoqFormMode = "create" | "edit" | "view";

// Search/Filter interfaces
export interface ServiceBoqFilters {
  project_id?: number;
  subproject_id?: number;
  wing_id?: number;
  level_one_id?: number;
  created_at_from?: string;
  created_at_to?: string;
  search?: string;
}

export interface ServiceBoqSearchParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filters?: ServiceBoqFilters;
}

// Error handling
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}
