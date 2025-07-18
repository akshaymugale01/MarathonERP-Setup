export interface Floor {
  id: number;
  name: string;
  building_id: number;
  building_setup_id: number;
  wing_id: number;
  user_id: number;
  company_id: number;
  area_id: number;
  active: boolean;
  cloned_by: number;
  cloned_at: string;
  code: string;
  company: string;
  project: string;
  site: string;
  wing: string;
  created_at: string;
  updated_at: string;
  property_id: number;
  no_of_units: number;
  total_area: string;
  floor_plan: string;
  unit_mix: number;
  project_id: number;
  site_id: number;
  deleted: boolean;
}
