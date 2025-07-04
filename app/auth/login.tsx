import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { router, Stack } from 'expo-router';
import { LockKeyhole } from 'lucide-react-native'; // Example Icon

export default function LoginScreen() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }
    setLocalLoading(true);
    setLocalError(null);
    try {
      await login(email, password);
      // Successful login is handled by onAuthStateChanged in AuthContext,
      // which will trigger navigation changes in _layout.tsx.
      // We could also explicitly navigate here if needed, but it's cleaner to let the layout handle it.
      // router.replace('/(tabs)/recipes');
    } catch (error: any) {
      console.error("Login screen error:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setLocalError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setLocalError('Please enter a valid email address.');
      } else {
        setLocalError(error.message || 'An unexpected error occurred during login.');
      }
    } finally {
      setLocalLoading(false);
    }
  };

  // Clear local error when authError from context changes (e.g. network error during onAuthStateChanged)
  React.useEffect(() => {
    if (authError) {
        setLocalError(authError.message);
    }
  }, [authError]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <View style={styles.content}>
        <View style={styles.header}>
          <LockKeyhole size={48} color="#F59E0B" style={styles.icon} />
          <Text style={styles.title}>Bartender Login</Text>
          <Text style={styles.subtitle}>Access your recipe dashboard</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          {localError && <Text style={styles.errorText}>{localError}</Text>}

          <TouchableOpacity
            style={[styles.button, (localLoading || authLoading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={localLoading || authLoading}
          >
            {(localLoading || authLoading) ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Placeholder for Sign Up or Forgot Password if needed later */}
        {/* <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <Text style={styles.footerText}>Don't have an account? <Text style={styles.linkText}>Sign Up</Text></Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // Darker gray
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Medium gray
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Lighter border
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#F59E0B', // Amber
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#FBBF24', // Lighter Amber
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444', // Red
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
});
