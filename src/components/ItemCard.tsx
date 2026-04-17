import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { Item, UserRole } from '../types';

interface Props {
  item: Item;
  role: UserRole;
  onPress?: () => void;
  onDelete?: () => void;
}

export function ItemCard({ item, role, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Image */}
      <View style={{ width: 80, height: 80, backgroundColor: '#F3F4F6' }}>
        {item.image_path ? (
          <Image
            source={{ uri: item.image_path }}
            style={{ width: 80, height: 80 }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28 }}>📦</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.category}</Text>

        <View style={{ flexDirection: 'row', marginTop: 6, gap: 12 }}>
          <Text style={{ fontSize: 14, color: '#059669', fontWeight: '600' }}>
            ₹{item.selling_price.toLocaleString()}
          </Text>
          {role === 'admin' && item.buying_price !== null && (
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              Cost: ₹{item.buying_price.toLocaleString()}
            </Text>
          )}
        </View>
      </View>

      {/* Delete (admin only) */}
      {role === 'admin' && onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{ padding: 12, justifyContent: 'center', alignItems: 'center' }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18, color: '#DC2626' }}>🗑</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
