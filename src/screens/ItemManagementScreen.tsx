import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ImageUpload } from '../components/ImageUpload';
import { CategoryPicker } from '../components/CategoryPicker';
import { useItems } from '../hooks/useItems';
import type { Item, Profile } from '../types';
import type { Category } from '../constants/theme';

interface Props {
  profile: Profile;
  editingItem?: Item | null;
  onBack: () => void;
}

export function ItemManagementScreen({ profile, editingItem, onBack }: Props) {
  const { addItem, editItem } = useItems(profile.business_id, profile.role);

  const [name, setName] = useState(editingItem?.name ?? '');
  const [category, setCategory] = useState<string>(editingItem?.category ?? 'Uncategorized');
  const [buyingPrice, setBuyingPrice] = useState(
    editingItem?.buying_price != null ? String(editingItem.buying_price) : ''
  );
  const [sellingPrice, setSellingPrice] = useState(
    editingItem?.selling_price != null ? String(editingItem.selling_price) : ''
  );
  const [imageUri, setImageUri] = useState<string | null>(editingItem?.image_path ?? null);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingItem;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Item name is required.';
    if (!sellingPrice.trim() || isNaN(Number(sellingPrice))) e.sellingPrice = 'Enter a valid selling price.';
    if (buyingPrice.trim() && isNaN(Number(buyingPrice))) e.buyingPrice = 'Enter a valid buying price.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = {
        name: name.trim(),
        category,
        selling_price: Number(sellingPrice),
        buying_price: buyingPrice.trim() ? Number(buyingPrice) : null,
        image_path: imageUri,
      };

      if (isEditing) {
        await editItem(editingItem!.id, formData, newImageUri ?? undefined);
      } else {
        await addItem(formData, newImageUri ?? undefined);
      }
      onBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (uri: string) => {
    setNewImageUri(uri);
    setImageUri(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Nav Bar */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 16, color: '#2563EB', fontWeight: '500' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#111827' }}>
          {isEditing ? 'Edit Item' : 'New Item'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <ImageUpload uri={imageUri} onChange={handleImageChange} />

          <Input
            label="Item Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Basmati Rice 5kg"
            error={errors.name}
          />

          <CategoryPicker label="Category" value={category} onChange={(c: Category) => setCategory(c)} />

          <Input
            label="Selling Price (₹) *"
            value={sellingPrice}
            onChangeText={setSellingPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.sellingPrice}
          />

          <Input
            label="Buying Price (₹)"
            value={buyingPrice}
            onChangeText={setBuyingPrice}
            placeholder="0.00 (optional)"
            keyboardType="decimal-pad"
            error={errors.buyingPrice}
          />

          <View style={{ height: 8 }} />

          <Button
            title={isEditing ? 'Save Changes' : 'Add Item'}
            loading={loading}
            onPress={handleSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
