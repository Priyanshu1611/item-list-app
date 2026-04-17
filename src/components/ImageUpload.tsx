import React from 'react';
import { View, Image, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  uri: string | null;
  onChange: (uri: string) => void;
}

export function ImageUpload({ uri, onChange }: Props) {
  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      onPress={pick}
      style={{
        width: 120,
        height: 120,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: '#F9FAFB',
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32 }}>📷</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
