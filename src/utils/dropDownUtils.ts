export interface DropdownItem {
  id: number | string;
  name: string;
}

export function mapToOptions(items?: DropdownItem[] | null) {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.map((item) => ({
    value: item.id,
    label: item.name,
  }));
}
