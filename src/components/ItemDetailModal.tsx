import React, { useState } from 'react';
import {
  View, Text, Modal, SafeAreaView, Image, ScrollView,
  TouchableOpacity, Share, Alert, ActivityIndicator,
  Platform, Dimensions, Linking,
} from 'react-native';
import type { Item } from '../types';

// Conditionally import native-only modules
let MediaLibrary: any = null;
let FileSystem: any = null;
if (Platform.OS !== 'web') {
  MediaLibrary = require('expo-media-library');
  FileSystem = require('expo-file-system/legacy');
}

interface Props {
  item: Item | null;
  visible: boolean;
  onClose: () => void;
}

function calcDiscounted(selling: number, pct: number) {
  if (!pct) return null;
  return selling - (selling * pct) / 100;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function ItemDetailModal({ item, visible, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);

  if (!item) return null;

  const discounted = calcDiscounted(item.selling_price, item.discount_percent ?? 0);

  const handleDownload = async () => {
    if (!item.image_path) {
      Alert.alert('No Image', 'This item has no image.');
      return;
    }

    // Web: trigger browser download
    if (Platform.OS === 'web') {
      const a = document.createElement('a');
      a.href = item.image_path;
      a.download = `${item.name.replace(/\s+/g, '_')}.jpg`;
      a.target = '_blank';
      a.click();
      return;
    }

    // Native: open in browser → user long-press saves to Photos
    // (saveToLibraryAsync blocked in Expo Go sandbox)
    Alert.alert(
      'Save Image',
      'Image will open in your browser. Long-press the image and tap "Save to Photos".',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => Linking.openURL(item.image_path!) },
      ]
    );
  };

  const handleShare = async () => {
    // Share selling price (NOT discounted) as per requirement
    const message =
      `🛍️ *${item.name}*\n` +
      `📦 Category: ${item.category}\n` +
      `💰 Price: ₹${item.selling_price.toLocaleString()}\n` +
      (item.image_path ? `\n🖼️ ${item.image_path}` : '');

    if (Platform.OS === 'web') {
      // Open WhatsApp web with pre-filled text
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
      return;
    }

    try {
      await Share.share({ message, title: item.name });
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const imageSize = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH - 40, 600) : SCREEN_WIDTH - 40;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <View style={{
          backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 14,
          borderBottomWidth: 1, borderColor: '#E5E7EB',
        }}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 16, color: '#2563EB', fontWeight: '500' }}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#111827' }}>
            Item Details
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Image — explicit size to avoid web layout bug */}
          <View style={{
            backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
            marginBottom: 20, alignSelf: 'center', width: imageSize,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
          }}>
            {item.image_path ? (
              <Image
                source={{ uri: item.image_path }}
                style={{ width: imageSize, height: imageSize * 0.75 }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ width: imageSize, height: imageSize * 0.6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
                <Text style={{ fontSize: 64 }}>📦</Text>
                <Text style={{ color: '#9CA3AF', marginTop: 8 }}>No image</Text>
              </View>
            )}
          </View>

          {/* Details card */}
          <View style={{
            backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20,
            shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
          }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
              {item.name}
            </Text>
            <View style={{
              alignSelf: 'flex-start', backgroundColor: '#EFF6FF',
              borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 16,
            }}>
              <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '600' }}>{item.category}</Text>
            </View>

            <View style={{ borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 16, gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>Selling Price</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                  ₹{item.selling_price.toLocaleString()}
                </Text>
              </View>

              {discounted !== null && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: '#6B7280' }}>Discount</Text>
                    <View style={{ backgroundColor: '#FEE2E2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 13, color: '#DC2626', fontWeight: '700' }}>
                        -{item.discount_percent}%
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#F0FDF4', padding: 12, borderRadius: 10,
                  }}>
                    <Text style={{ fontSize: 15, color: '#166534', fontWeight: '600' }}>Discounted Price</Text>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#15803D' }}>
                      ₹{discounted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                backgroundColor: '#25D366', borderRadius: 14, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Text style={{ fontSize: 20 }}>💬</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Share via WhatsApp</Text>
            </TouchableOpacity>

            {item.image_path && (
              <TouchableOpacity
                onPress={handleDownload}
                disabled={downloading}
                style={{
                  backgroundColor: downloading ? '#E5E7EB' : '#2563EB',
                  borderRadius: 14, paddingVertical: 14,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {downloading
                  ? <ActivityIndicator color="#6B7280" size="small" />
                  : <Text style={{ fontSize: 20 }}>⬇️</Text>
                }
                <Text style={{ color: downloading ? '#6B7280' : '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                  {downloading ? 'Saving...' : 'Download Image'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
