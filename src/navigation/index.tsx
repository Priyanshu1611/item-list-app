import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { getMyBusiness } from '../api/businesses';

import { LoginScreen } from '../screens/LoginScreen';
import { BusinessSelectionScreen } from '../screens/BusinessSelectionScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ItemManagementScreen } from '../screens/ItemManagementScreen';

import type { Item } from '../types';

type AppScreen = 'dashboard' | 'itemForm';

export function AppNavigator() {
  const { session, profile, loading, refreshProfile, logout } = useAuth();
  const [screen, setScreen] = useState<AppScreen>('dashboard');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (profile?.business_id) {
      getMyBusiness().then((b) => { if (b) setBusinessName(b.name); });
    }
  }, [profile?.business_id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!session) return <LoginScreen />;

  if (!profile?.business_id) {
    return (
      <BusinessSelectionScreen
        onComplete={async () => { await refreshProfile(); }}
      />
    );
  }

  if (screen === 'itemForm') {
    return (
      <ItemManagementScreen
        profile={profile}
        editingItem={editingItem}
        onBack={() => { setEditingItem(null); setScreen('dashboard'); }}
      />
    );
  }

  return (
    <DashboardScreen
      profile={profile}
      businessName={businessName}
      onAddItem={() => { setEditingItem(null); setScreen('itemForm'); }}
      onEditItem={(item: Item) => { setEditingItem(item); setScreen('itemForm'); }}
      onLogout={logout}
    />
  );
}
