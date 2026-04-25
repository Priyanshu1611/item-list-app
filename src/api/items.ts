import { supabase } from './supabase';
import type { Item, ItemFormData, SortOption, UserRole } from '../types';

export async function fetchCategories(businessId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('items')
    .select('category')
    .eq('business_id', businessId);
  if (error) return [];
  const cats = [...new Set((data ?? []).map((r: any) => r.category).filter(Boolean))] as string[];
  return cats.sort();
}

export async function fetchItems(
  businessId: string,
  role: UserRole,
  search: string,
  sort: SortOption,
  categoryFilter?: string
): Promise<Item[]> {
  // Staff uses view that excludes buying_price
  const table = role === 'admin' ? 'items' : 'items_staff_view';

  let query = supabase
    .from(table)
    .select('*')
    .eq('business_id', businessId);

  if (search.trim()) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  if (categoryFilter && categoryFilter !== 'All') {
    query = query.eq('category', categoryFilter);
  }

  switch (sort) {
    case 'name_asc':
      query = query.order('name', { ascending: true });
      break;
    case 'name_desc':
      query = query.order('name', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function createItem(businessId: string, form: ItemFormData): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .insert({ ...form, business_id: businessId })
    .select()
    .single();
  if (error) throw error;
  return data as Item;
}

export async function updateItem(id: string, form: Partial<ItemFormData>): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .update(form)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Item;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadItemImage(
  businessId: string,
  itemId: string,
  uri: string
): Promise<string> {
  const ext = uri.split('.').pop() ?? 'jpg';
  const path = `${businessId}/${itemId}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('item-images')
    .upload(path, blob, { upsert: true, contentType: `image/${ext}` });
  if (error) throw error;

  const { data } = supabase.storage.from('item-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteItemImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from('item-images').remove([path]);
  if (error) throw error;
}
