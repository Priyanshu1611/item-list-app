import { useState, useCallback } from 'react';
import { createBusiness, joinBusiness, getMyBusiness } from '../api/businesses';
import type { Business } from '../types';

export function useBusinesses() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBusiness = useCallback(async () => {
    setLoading(true);
    try {
      const b = await getMyBusiness();
      setBusiness(b);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const b = await createBusiness(name);
      setBusiness(b);
      return b;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const join = useCallback(async (businessId: string) => {
    setLoading(true);
    setError(null);
    try {
      await joinBusiness(businessId);
      await loadBusiness();
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [loadBusiness]);

  return { business, loading, error, loadBusiness, create, join };
}
