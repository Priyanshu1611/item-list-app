import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { Item, UserRole } from '../types';

interface Props {
  item: Item;
  role: UserRole;
  onPress?: () => void;
  onDelete?: () => void;
}

function discountedPrice(selling: number, pct: number) {
  if (!pct) return null;
  return selling - (selling * pct) / 100;
}

export function ItemCard({ item, role, onPress, onDelete }: Props) {
  const discounted = discountedPrice(item.selling_price, item.discount_percent ?? 0);

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
          <Image source={{ uri: item.image_path }} style={{ width: 80, height: 80 }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28 }}>📦</Text>
          </View>
        )}
        {/* Discount badge */}
        {(item.discount_percent ?? 0) > 0 && (
          <View style={{
            position: 'absolute', top: 4, left: 4,
            backgroundColor: '#DC2626', borderRadius: 4,
            paddingHorizontal: 4, paddingVertical: 1,
          }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
              -{item.discount_percent}%
            </Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{item.category}</Text>

        <View style={{ flexDirection: 'row', marginTop: 6, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {discounted !== null ? (
            <>
              <Text style={{ fontSize: 14, color: '#059669', fontWeight: '700' }}>
                ₹{discounted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', textDecorationLine: 'line-through' }}>
                ₹{item.selling_price.toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 14, color: '#059669', fontWeight: '600' }}>
              ₹{item.selling_price.toLocaleString()}
            </Text>
          )}
          {role === 'admin' && item.buying_price !== null && (
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              Cost: ₹{item.buying_price.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Staff hint */}
        {role === 'staff' && (
          <Text style={{ fontSize: 11, color: '#BFDBFE', marginTop: 3 }}>Tap to view details</Text>
        )}
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
