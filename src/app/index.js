import { useEffect } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/login');
    }
  }, [
    loading,
    isAuthenticated,
  ]);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});