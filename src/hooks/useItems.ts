import { useState, useEffect, useCallback } from 'react';
import { fetchItems, fetchCategories, createItem, updateItem, deleteItem, uploadItemImage } from '../api/items';
import type { Item, ItemFormData, SortOption, UserRole } from '../types';

export function useItems(businessId: string | null, role: UserRole) {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const loadCategories = useCallback(async () => {
    if (!businessId) return;
    const cats = await fetchCategories(businessId);
    setCategories(cats);
  }, [businessId]);

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems(businessId, role, search, sort, categoryFilter);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [businessId, role, search, sort, categoryFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadCategories(); }, [loadCategories]);

  const addItem = useCallback(
    async (form: ItemFormData, imageUri?: string) => {
      if (!businessId) return;
      const item = await createItem(businessId, form);
      if (imageUri) {
        const url = await uploadItemImage(businessId, item.id, imageUri);
        await updateItem(item.id, { image_path: url });
        item.image_path = url;
      }
      setItems((prev) => [item, ...prev]);
      // Refresh category list in case new category added
      loadCategories();
      return item;
    },
    [businessId, loadCategories]
  );

  const editItem = useCallback(async (id: string, form: Partial<ItemFormData>, imageUri?: string) => {
    if (imageUri && businessId) {
      const url = await uploadItemImage(businessId, id, imageUri);
      form.image_path = url;
    }
    const updated = await updateItem(id, form);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, [businessId]);

  const removeItem = useCallback(async (id: string) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return {
    items,
    categories,
    loading,
    error,
    search,
    setSearch,
    sort,
    setSort,
    categoryFilter,
    setCategoryFilter,
    refresh: load,
    addItem,
    editItem,
    removeItem,
  };
}
