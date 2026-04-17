import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? '#DC2626' : '#D1D5DB',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 16,
            color: '#111827',
            backgroundColor: '#FFFFFF',
          },
          style,
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
}
