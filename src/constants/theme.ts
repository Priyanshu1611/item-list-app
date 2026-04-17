export const CATEGORIES = [
  'Uncategorized',
  'Food & Beverage',
  'Electronics',
  'Clothing',
  'Hardware',
  'Furniture',
  'Cosmetics',
  'Stationery',
  'Medicine',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SORT_OPTIONS = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
] as const;
