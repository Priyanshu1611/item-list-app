import { supabase } from './supabase';
import type { Business, Profile } from '../types';

export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();
  if (error) return null;
  return data as Profile;
}

export async function updateProfileBusiness(businessId: string, role: 'admin' | 'staff') {
  const { error } = await supabase
    .from('profiles')
    .update({ business_id: businessId, role })
    .eq('id', (await supabase.auth.getUser()).data.user!.id);
  if (error) throw error;
}

export async function createBusiness(name: string): Promise<Business> {
  const { data, error } = await supabase.rpc('create_business_for_user', {
    business_name: name,
  });
  if (error) throw error;
  return data as Business;
}

export async function getMyBusiness(): Promise<Business | null> {
  const profile = await getMyProfile();
  if (!profile?.business_id) return null;

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', profile.business_id)
    .single();
  if (error) return null;
  return data as Business;
}

export async function joinBusiness(businessId: string): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user!;
  const { error } = await supabase
    .from('profiles')
    .update({ business_id: businessId, role: 'staff' })
    .eq('id', user.id);
  if (error) throw error;
}
