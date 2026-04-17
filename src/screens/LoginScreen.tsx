import React, { useState } from 'react';
import {
  View, Text, KeyboardAvoidingView, ScrollView, Platform, Alert, TouchableOpacity,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { sendMagicLink, verifyOtp } from '../api/auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email.trim()) { setError('Enter your email address.'); return; }
    setError('');
    setLoading(true);
    try {
      await sendMagicLink(email.trim().toLowerCase());
      setStep('otp');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) { setError('Enter the 6-digit code.'); return; }
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email.trim().toLowerCase(), otp.trim());
      // Auth state change in useAuth will trigger navigation
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
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
        {/* Logo / Brand */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ fontSize: 48 }}>🏪</Text>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginTop: 12 }}>
            PriceList
          </Text>
          <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 6 }}>
            Manage your shop inventory
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {step === 'email' ? (
            <>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
                Sign In / Sign Up
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                We'll send a one-time code to your email.
              </Text>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={error}
              />
              <Button title="Send Code" loading={loading} onPress={handleSendOtp} />
            </>
          ) : (
            <>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 }}>
                Enter Your Code
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                Sent to {email}
              </Text>
              <Input
                label="6-Digit Code"
                value={otp}
                onChangeText={setOtp}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                error={error}
              />
              <Button title="Verify & Continue" loading={loading} onPress={handleVerify} />
              <TouchableOpacity
                onPress={() => { setStep('email'); setOtp(''); setError(''); }}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ color: '#2563EB', fontWeight: '500' }}>← Change email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
