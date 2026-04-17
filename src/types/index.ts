export type UserRole = 'admin' | 'staff';

export interface Business {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  business_id: string | null;
  role: UserRole;
  created_at: string;
}

export interface Item {
  id: string;
  business_id: string;
  name: string;
  category: string;
  buying_price: number | null; // null for staff (not returned from API)
  selling_price: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

export type ItemFormData = Omit<Item, 'id' | 'business_id' | 'created_at' | 'updated_at'>;

export type SortOption = 'name_asc' | 'name_desc' | 'newest' | 'oldest';
