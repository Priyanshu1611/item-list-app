import React, { useState } from 'react';
import {
  View, Text, KeyboardAvoidingView, ScrollView,
  Platform, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { signInWithGoogle } from '../api/auth';

export function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e.message ?? 'Sign in failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F3F4F6' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{ fontSize: 72 }}>🏪</Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#111827', marginTop: 16, letterSpacing: -0.5 }}>
            PriceList
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>
            Manage your shop inventory
          </Text>
        </View>

        {/* Card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 28,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 4 }}>
            Welcome
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28 }}>
            Sign in to manage your business inventory
          </Text>

          {/* Google Button */}
          <TouchableOpacity
            onPress={handleGoogle}
            disabled={loading}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: loading ? '#F3F4F6' : '#FFFFFF',
              borderWidth: 1.5,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              paddingVertical: 14,
              paddingHorizontal: 20,
              gap: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#4285F4" size="small" />
            ) : (
              /* Google SVG-style G icon via text */
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#4285F4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14, lineHeight: 18 }}>G</Text>
              </View>
            )}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          {error ? (
            <Text style={{ color: '#DC2626', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
              {error}
            </Text>
          ) : null}
        </View>

        <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          By signing in, you agree to our Terms of Service
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
