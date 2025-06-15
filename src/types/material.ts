export interface Material {
  id: number;
  name: string;
  wbs_tag: boolean;
  inventory_type_id: number;
  inventory_type: string;
  inventory_sub_type_id: number;
  material_description: string;
  specification: string;
  uom_id: number;
  uom_name: string;
  created_by_id: number;
  material_code: string;
  organization_id: number;
  created_at: string; // use Date if you parse it later
  updated_at: string;
  available_quantity: number;
  lead_time: number;
  hsn_code: string;
  mtc_required: boolean;
  perishable: boolean;
  perishable_time: string;
  warranty_period: string;
  warranty_remarks: string;
  stock_type: string;
  materil_tag: string;
  material_category: string;
  urgent_lead_time: number;
  benchmark_lead_time: number;
  manufacture_tolerance: number;
  breakage_tolerance: number;
  wastage_tolerance: number;
  remark: string;
  conveyance: number;
  minimum_order_quantity: number;
  perishable_time_type: string;
  typical_warranty_time_type: string;
  typical_warranty_time: string;
  material_tag: string;
  purchase_user_id: string;
  is_qc: boolean;
  active: boolean;
  deleted: boolean;
  attachments: Attachment[]
}

export interface Attachment {
    id: number;
    doc_path: string;
    Relation: string
}
