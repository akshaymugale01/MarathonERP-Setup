export interface WorkCategory {
  id: number;
  name: string;
  category_code: string | null;
  created_at: string;
  updated_at: string;
  active: boolean;
  deleted: boolean;
}

export interface Level {
  id: number;
  name: string;
  work_category: WorkCategory;
  description: string | null;
  benchmark_lead_time: number | null;
  sac_code: string | null;
  created_at: string;
  updated_at: string;
  work_category_id: number;
  active: boolean;
  deleted: boolean;
  parent_id: number | null;
}

export interface LabourActivityCategoryMapping {
  id: number;
  labour_activity_id: number;
  activity_category_mapping_id: number;
}

export interface Mapping {
  id: number;
  level_one_id: number;
  level_two_id: number;
  level_three_id: number;
  level_four_id: number;
  level_five_id: number;

  level_one: WorkCategory;
  level_two: Level;
  level_three: Level;
  level_four: Level;
  level_five: Level;

  labour_activity_category_mappings: LabourActivityCategoryMapping[];
}

export interface MappingResponse {
  id: number;
  level_one_id: number;
  level_two_id: number;
  level_three_id: number;
  level_four_id: number;
  level_five_id: number;

  level_one: WorkCategory;
  level_two: Level;
  level_three: Level;
  level_four: Level;
  level_five: Level;

  labour_activity_category_mappings: LabourActivityCategoryMapping[];
  created_at: string;
  updated_at: string;
}
