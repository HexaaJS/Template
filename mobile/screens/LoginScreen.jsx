import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/api';

export default function LoginScreen({ navigation, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return Alert.alert('Remplis tous les champs');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) return Alert.alert(data.message);
      await AsyncStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (e) {
      Alert.alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ VoiceApp</Text>
      <TextInput style={styles.input} placeholder="Pseudo" placeholderTextColor="#666"
        value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor="#666"
        value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#6c47ff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#6c47ff', textAlign: 'center', fontSize: 14 },
});