
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function CompletedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.successOuter}>

        <View style={styles.successInner}>

          <Ionicons
            name="checkmark"
            size={48}
            color={colors.white}
          />

        </View>

      </View>

      <Text style={styles.title}>
        Request completed
      </Text>

      <Text style={styles.subtitle}>
        Thank you for using RoadAssist.
      </Text>


      <View style={styles.card}>

        <Summary
          icon="construct-outline"
          label="SERVICE"
          value="Battery Assistance"
        />

        <View style={styles.divider} />

        <Summary
          icon="person-outline"
          label="MECHANIC"
          value="Kumar"
        />

        <View style={styles.divider} />

        <Summary
          icon="card-outline"
          label="AMOUNT PAID"
          value="₹400"
          green
        />

      </View>


      <View style={styles.thankYou}>

        <Ionicons
          name="heart-outline"
          size={21}
          color={colors.accent}
        />

        <Text style={styles.thankText}>
          We hope to assist you again whenever
          you need us.
        </Text>

      </View>


      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/')}
      >

        <Text style={styles.homeText}>
          BACK TO HOME
        </Text>

        <Ionicons
          name="home-outline"
          size={18}
          color={colors.white}
        />

      </TouchableOpacity>


      <Text style={styles.reference}>
        Service Reference: DEMO-8A42K91
      </Text>

    </View>
  );
}

function Summary({
  icon,
  label,
  value,
  green,
}) {
  return (
    <View style={styles.summaryRow}>

      <View style={styles.summaryIcon}>

        <Ionicons
          name={icon}
          size={19}
          color={colors.accent}
        />

      </View>

      <View style={styles.summaryInfo}>

        <Text style={styles.label}>
          {label}
        </Text>

        <Text
          style={[
            styles.value,
            green && styles.greenValue,
          ]}
        >
          {value}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },

  successOuter: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  successInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 25,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  summaryInfo: {
    flex: 1,
  },

  label: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  value: {
    fontFamily: 'InterSemiBold',
    fontSize: 13,
    color: colors.text,
    marginTop: 3,
  },

  greenValue: {
    fontFamily: 'InterExtraBold',
    color: colors.success,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 13,
  },

  thankYou: {
    marginTop: 17,
    backgroundColor: colors.accentLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  thankText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  homeButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.accent,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  homeText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },

  reference: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});