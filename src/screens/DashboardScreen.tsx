import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { ItemCard } from '../components/ItemCard';
import { useItems } from '../hooks/useItems';
import type { Profile, Item, SortOption } from '../types';
import { SORT_OPTIONS } from '../constants/theme';

interface Props {
  profile: Profile;
  businessName: string;
  onAddItem: () => void;
  onEditItem: (item: Item) => void;
  onLogout: () => void;
}

export function DashboardScreen({ profile, businessName, onAddItem, onEditItem, onLogout }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const { items, loading, search, setSearch, sort, setSort, refresh, removeItem } = useItems(
    profile.business_id,
    profile.role
  );

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete Item', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeItem(id) },
    ]);
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Header */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{businessName}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', textTransform: 'capitalize' }}>
            {profile.role} · {profile.email}
          </Text>
        </View>
        <TouchableOpacity onPress={onLogout}>
          <Text style={{ fontSize: 22 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Search + Sort Bar */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 10,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 15,
            color: '#111827',
            backgroundColor: '#F9FAFB',
          }}
          placeholder="🔍  Search items..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={() => setSortOpen(!sortOpen)}
          style={{
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 10,
            paddingHorizontal: 12,
            justifyContent: 'center',
            backgroundColor: '#F9FAFB',
          }}
        >
          <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>
            {currentSortLabel} ▾
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {sortOpen && (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderColor: '#E5E7EB',
            paddingVertical: 4,
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => { setSort(opt.value as SortOption); setSortOpen(false); }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, color: '#374151' }}>{opt.label}</Text>
              {sort === opt.value && <Text style={{ color: '#2563EB' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Item Count */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <Text style={{ fontSize: 13, color: '#6B7280' }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* List */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              role={profile.role}
              onPress={() => profile.role === 'admin' && onEditItem(item)}
              onDelete={profile.role === 'admin' ? () => confirmDelete(item.id, item.name) : undefined}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
                {search ? 'No items match your search.' : 'No items yet.'}
              </Text>
            </View>
          }
          onRefresh={refresh}
          refreshing={loading}
        />
      )}

      {/* FAB — admin only */}
      {profile.role === 'admin' && (
        <TouchableOpacity
          onPress={onAddItem}
          style={{
            position: 'absolute',
            bottom: 28,
            right: 24,
            backgroundColor: '#2563EB',
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 28, lineHeight: 32 }}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
