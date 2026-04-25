import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  SafeAreaView, TextInput,
} from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Existing categories from the business items */
  existingCategories?: string[];
}

export function CategoryPicker({ value, onChange, label, existingCategories = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const handleSelect = (cat: string) => {
    onChange(cat);
    setOpen(false);
    setCustomText('');
  };

  const handleCustomSubmit = () => {
    const trimmed = customText.trim();
    if (trimmed) {
      onChange(trimmed);
      setOpen(false);
      setCustomText('');
    }
  };

  // Deduplicate: existing categories + currently selected (if custom)
  const suggestions = [...new Set([...existingCategories])].sort();

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
          {value || 'Select or type category'}
        </Text>
        <Text style={{ color: '#6B7280' }}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <SafeAreaView style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' }}>
            {/* Header */}
            <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Category</Text>
            </View>

            {/* Type custom category */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>TYPE NEW CATEGORY</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    fontSize: 15,
                    color: '#111827',
                    backgroundColor: '#F9FAFB',
                  }}
                  placeholder="e.g. Spices, Dairy, Tools..."
                  placeholderTextColor="#9CA3AF"
                  value={customText}
                  onChangeText={setCustomText}
                  onSubmitEditing={handleCustomSubmit}
                  returnKeyType="done"
                  autoCapitalize="words"
                />
                <TouchableOpacity
                  onPress={handleCustomSubmit}
                  disabled={!customText.trim()}
                  style={{
                    backgroundColor: customText.trim() ? '#2563EB' : '#E5E7EB',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: customText.trim() ? '#FFFFFF' : '#9CA3AF', fontWeight: '600' }}>
                    Use
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Existing categories */}
            {suggestions.length > 0 && (
              <>
                <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>EXISTING CATEGORIES</Text>
                </View>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item)}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderColor: '#F3F4F6',
                      }}
                    >
                      <Text style={{ fontSize: 15, color: '#111827' }}>{item}</Text>
                      {item === value && <Text style={{ color: '#2563EB' }}>✓</Text>}
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {suggestions.length === 0 && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No categories yet. Type one above.</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => { setOpen(false); setCustomText(''); }}
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
