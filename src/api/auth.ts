import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Platform, Alert } from 'react-native';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = Platform.OS === 'web'
    ? 'http://localhost:8081'
    : AuthSession.makeRedirectUri({ native: 'pricelist://' });

  console.log('[OAuth] redirectTo =', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success' && result.url) {
    const fragment = result.url.split('#')[1] ?? '';
    const params = Object.fromEntries(new URLSearchParams(fragment));

    if (params.access_token && params.refresh_token) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      if (sessionError) throw sessionError;
    }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
