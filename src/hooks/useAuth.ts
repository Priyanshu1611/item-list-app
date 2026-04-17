import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';
import { getMyProfile } from '../api/businesses';
import { signOut } from '../api/auth';
import type { Profile } from '../types';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const p = await getMyProfile();
    setProfile(p);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile().finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) loadProfile();
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  return {
    session,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'staff',
    hasSelectedBusiness: !!profile?.business_id,
    refreshProfile: loadProfile,
    logout,
  };
}
