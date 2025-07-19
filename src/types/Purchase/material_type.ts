export interface MaterialType {
  id: number;
  name: string;
  company_id: number;
  type: string;
  created_at: string; 
  updated_at: string;
  material_type_code: string;
  material_type_description: string;
  uom_id: number;
  supplier_id: number;
  category: string;
  department_id: number;
  budget_type_id: number;
  active: boolean;
  deleted: boolean;
  company?: string;
  project?: string;
  site?: string;
  wing?: string;
  no_of_units?: number;
  total_area?: number;
  unit_mix?: string;
}
