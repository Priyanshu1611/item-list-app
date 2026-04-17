import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const VARIANTS = {
  primary: { bg: '#2563EB', text: '#FFFFFF' },
  secondary: { bg: '#E5E7EB', text: '#111827' },
  danger: { bg: '#DC2626', text: '#FFFFFF' },
};

export function Button({ title, loading, variant = 'primary', disabled, style, ...props }: Props) {
  const colors = VARIANTS[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: disabled || loading ? '#9CA3AF' : colors.bg,
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        },
        style,
      ]}
      {...props}
    >
      {loading && <ActivityIndicator color={colors.text} size="small" />}
      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}
