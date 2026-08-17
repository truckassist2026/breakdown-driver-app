import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function ConfirmRequestScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Confirm Request
          </Text>

          <Text style={styles.subtitle}>
            Review your breakdown request
          </Text>
        </View>
      </View>

      <View style={styles.content}>

        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark"
            size={32}
            color={colors.white}
          />
        </View>

        <Text style={styles.heading}>
          You're almost there
        </Text>

        <Text style={styles.description}>
          Review the details below and request a
          nearby mechanic.
        </Text>

        <View style={styles.card}>

          <View style={styles.row}>
            <Ionicons
              name="battery-half-outline"
              size={23}
              color={colors.accent}
            />

            <View>
              <Text style={styles.label}>
                BREAKDOWN
              </Text>

              <Text style={styles.value}>
                Battery
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Ionicons
              name="car-outline"
              size={23}
              color={colors.accent}
            />

            <View>
              <Text style={styles.label}>
                VEHICLE
              </Text>

              <Text style={styles.value}>
                TN 01 AB 1234
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={23}
              color={colors.accent}
            />

            <View>
              <Text style={styles.label}>
                LOCATION
              </Text>

              <Text style={styles.value}>
                Chennai, Tamil Nadu
              </Text>
            </View>
          </View>

        </View>

        <TouchableOpacity
          style={styles.requestButton}
          onPress={() =>
            router.push('/breakdown/searching')
          }
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.white}
          />

          <Text style={styles.requestText}>
            FIND A MECHANIC
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
  },

  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  content: {
    padding: 20,
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 18,
  },

  description: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 25,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  label: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.7,
  },

  value: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  requestButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.accent,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  requestText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});