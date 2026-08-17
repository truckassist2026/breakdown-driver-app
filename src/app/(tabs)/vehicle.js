import { StyleSheet, Text, View } from 'react-native';

export default function VehicleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Vehicle</Text>
      <Text style={styles.subtitle}>
        Vehicle management will be available here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    color: '#64748B',
  },
});