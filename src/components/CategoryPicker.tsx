import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import { CATEGORIES, Category } from '../constants/theme';

interface Props {
  value: string;
  onChange: (value: Category) => void;
  label?: string;
}

export function CategoryPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Text style={{ fontSize: 16, color: value ? '#111827' : '#9CA3AF' }}>
          {value || 'Select category'}
        </Text>
        <Text style={{ color: '#6B7280' }}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <SafeAreaView style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Select Category</Text>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { onChange(item); setOpen(false); }}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: '#F3F4F6',
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#111827' }}>{item}</Text>
                  {item === value && <Text style={{ color: '#2563EB' }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{ padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#DC2626', fontWeight: '600', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
