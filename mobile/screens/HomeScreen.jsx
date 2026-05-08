import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

export default function HomeScreen({ setToken }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  if (!user) return (
    <View style={styles.container}>
      <ActivityIndicator color="#6c47ff" size="large" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ VoiceApp</Text>
      <Text style={styles.welcome}>Salut, <Text style={styles.username}>{user.username}</Text> 👋</Text>
      <Text style={styles.sub}>L'app voice est prête à décoller.</Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  welcome: { fontSize: 22, color: '#fff', textAlign: 'center', marginBottom: 12 },
  username: { color: '#6c47ff', fontWeight: 'bold' },
  sub: { color: '#666', textAlign: 'center', marginBottom: 40 },
  btn: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, alignItems: 'center' },
  btnText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
});