import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token').then((t) => {
      setToken(t);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} setToken={setToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setToken={setToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}