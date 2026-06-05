import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

interface Credential {
  id: string;
  type: string;
  label?: string;
  issuanceSource: string;
}

export default function App() {
  const [tab, setTab] = useState<'credentials' | 'present'>('credentials');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    fetch(`${API_URL}/credentials`)
      .then((r) => r.json())
      .then(setCredentials)
      .catch(() =>
        setCredentials([
          { id: 'demo', type: 'corporate_access', label: 'HQ Badge', issuanceSource: 'PACS' },
        ]),
      );
  }, []);

  useEffect(() => {
    if (tab !== 'present' || !selectedId) return;
    const load = () => {
      fetch(`${API_URL}/presentation/token/current?credentialId=${selectedId}`)
        .then((r) => r.json())
        .then((d) => {
          setToken(d.token);
          setCountdown(30);
        })
        .catch(() => setToken('demo-token-' + Date.now()));
    };
    load();
    const interval = setInterval(load, 30000);
    const tick = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 30)), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [tab, selectedId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Noa Wallet</Text>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('credentials')}>
          <Text style={tab === 'credentials' ? styles.tabActive : styles.tab}>Credentials</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('present')}>
          <Text style={tab === 'present' ? styles.tabActive : styles.tab}>Present</Text>
        </TouchableOpacity>
      </View>

      {tab === 'credentials' ? (
        <ScrollView>
          {credentials.map((c) => (
            <View key={c.id} style={styles.card}>
              <Text style={styles.cardTitle}>{c.label ?? c.type}</Text>
              <Text>{c.issuanceSource}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => setSelectedId(c.id)}>
                <Text style={styles.btnText}>Add to Wallet (stub)</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.present}>
          <Text style={styles.nfcHint}>Hold near reader (NFC HCE v1 stub)</Text>
          <View style={styles.qrBox}>
            <Text style={styles.qrToken}>{token ?? 'Loading…'}</Text>
          </View>
          <Text>Rotates in {countdown}s</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  tab: { color: '#64748b' },
  tabActive: { color: '#2563eb', fontWeight: '600' },
  card: { padding: 16, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  btn: { marginTop: 8, backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  btnText: { color: '#fff', textAlign: 'center' },
  present: { alignItems: 'center', marginTop: 24 },
  nfcHint: { marginBottom: 16, color: '#64748b' },
  qrBox: { padding: 24, borderWidth: 2, borderColor: '#0f172a', marginBottom: 16, minWidth: 280 },
  qrToken: { fontSize: 12, textAlign: 'center' },
});
