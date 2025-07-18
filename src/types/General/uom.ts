export interface UOM {
  id: number;
  name: string;
  uom_short_name: string;
  uom_id: number | null;
  uom_abbreviation: string | null;
  uom_category: string;
  created_at: string;   
  updated_at: string;
  active: boolean;
  deleted: boolean;
}
