import React, { useState } from 'react';
import {
  View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useBusinesses } from '../hooks/useBusinesses';

interface Props {
  onComplete: () => void;
}

export function BusinessSelectionScreen({ onComplete }: Props) {
  const { create, join, loading, error } = useBusinesses();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [localError, setLocalError] = useState('');

  const handleCreate = async () => {
    if (!businessName.trim()) { setLocalError('Enter a business name.'); return; }
    setLocalError('');
    try {
      await create(businessName.trim());
      onComplete();
    } catch (e: any) {
      setLocalError(e.message);
    }
  };

  const handleJoin = async () => {
    if (!businessId.trim()) { setLocalError('Enter a Business ID.'); return; }
    setLocalError('');
    try {
      await join(businessId.trim());
      onComplete();
    } catch (e: any) {
      setLocalError(e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 36 }}>🏢</Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827', marginTop: 12 }}>
            Set Up Your Business
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 6, textAlign: 'center' }}>
            Create a new business or join an existing one.
          </Text>
        </View>

        {mode === 'choose' && (
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => setMode('create')}
              style={{
                backgroundColor: '#2563EB',
                borderRadius: 12,
                padding: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>➕</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
                Create New Business
              </Text>
              <Text style={{ color: '#BFDBFE', fontSize: 13, marginTop: 4 }}>
                You'll be the Admin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('join')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 20,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#E5E7EB',
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>🔗</Text>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700' }}>
                Join Existing Business
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>
                You'll join as Staff
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'create' && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Input
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g. Ahmed General Store"
              error={localError || error || undefined}
            />
            <Button title="Create Business" loading={loading} onPress={handleCreate} />
            <TouchableOpacity onPress={() => setMode('choose')} style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: '#6B7280' }}>← Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'join' && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Input
              label="Business ID"
              value={businessId}
              onChangeText={setBusinessId}
              placeholder="Paste the Business ID here"
              autoCapitalize="none"
              autoCorrect={false}
              error={localError || error || undefined}
            />
            <Text style={{ fontSize: 12, color: '#6B7280', marginTop: -8, marginBottom: 16 }}>
              Ask your Admin to share the Business ID from Settings.
            </Text>
            <Button title="Join Business" loading={loading} onPress={handleJoin} />
            <TouchableOpacity onPress={() => setMode('choose')} style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{ color: '#6B7280' }}>← Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
