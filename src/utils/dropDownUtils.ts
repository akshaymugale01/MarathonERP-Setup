export interface DropdownItem {
  id: number | string;
  name: string;
}

export function mapToOptions(items: DropdownItem[] = []) {
  return items.map((item) => ({
    value: item.id,
    label: item.name,
  }));
}