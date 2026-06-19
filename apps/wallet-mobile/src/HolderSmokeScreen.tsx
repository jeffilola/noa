import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { API_URL } from './config';

type ApiStatus = 'checking' | 'online' | 'offline';

export function HolderSmokeScreen() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [refreshing, setRefreshing] = useState(false);

  const checkApi = useCallback(async () => {
    setApiStatus('checking');
    try {
      const response = await fetch(`${API_URL}/health`, { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as { status?: string };
      setApiStatus(body.status === 'ok' ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  }, []);

  useEffect(() => {
    void checkApi();
  }, [checkApi]);

  async function onRefresh() {
    setRefreshing(true);
    await checkApi();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.eyebrow}>M12 smoke screen</Text>
        <Text style={styles.title}>Noa Holder</Text>
        <Text style={styles.subtitle}>
          Mobile shell for the Identity Holder experience. Wallet passes and NFC come later — this
          build only proves the app boots and can reach the API.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Signed-in holder (demo)</Text>
          <Text style={styles.cardValue}>Identity Holder</Text>
          <Text style={styles.cardHint}>
            Full Clerk sign-in on mobile is not wired yet. Use the web app at /user for authenticated
            flows.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>API status</Text>
          <View style={styles.statusRow}>
            {apiStatus === 'checking' ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : (
              <View
                style={[
                  styles.statusDot,
                  apiStatus === 'online' ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
            )}
            <Text style={styles.cardValue}>
              {apiStatus === 'checking'
                ? 'Checking…'
                : apiStatus === 'online'
                  ? 'API reachable'
                  : 'API offline'}
            </Text>
          </View>
          <Text style={styles.cardHint}>{API_URL}/health</Text>
          {apiStatus === 'offline' ? (
            <Text style={styles.cardHint}>
              Start the API with pnpm qa:dev. On Android emulator use EXPO_PUBLIC_API_URL=
              http://10.0.2.2:3001/api/v1
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Next up</Text>
          <Text style={styles.bullet}>• Clerk auth + secure token storage</Text>
          <Text style={styles.bullet}>• Credential list from /users/me</Text>
          <Text style={styles.bullet}>• Wallet pass preview parity with /user/wallet</Text>
        </View>

        <Text style={styles.footer}>Pull down to refresh API status.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 20, paddingBottom: 40 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#475569', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 6,
  },
  cardValue: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  cardHint: { fontSize: 14, lineHeight: 20, color: '#64748b', marginTop: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusDotOnline: { backgroundColor: '#16a34a' },
  statusDotOffline: { backgroundColor: '#dc2626' },
  bullet: { fontSize: 15, lineHeight: 22, color: '#334155' },
  footer: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 8 },
});
