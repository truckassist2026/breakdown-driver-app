
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../../constants/colors';

export default function PaymentSuccessScreen() {
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
        Payment successful
      </Text>

      <Text style={styles.subtitle}>
        Your payment has been completed successfully.
      </Text>


      <View style={styles.card}>

        <Row
          label="Amount paid"
          value="₹400"
          green
        />

        <Row
          label="Payment method"
          value="UPI"
        />

        <Row
          label="Transaction ID"
          value="DEMO-8A42K91"
        />

        <Row
          label="Service"
          value="Battery Assistance"
        />

      </View>


      <TouchableOpacity style={styles.invoiceButton}>

        <Ionicons
          name="document-text-outline"
          size={18}
          color={colors.accent}
        />

        <Text style={styles.invoiceText}>
          VIEW INVOICE
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={styles.ratingButton}
        onPress={() =>
          router.replace('/breakdown/rating')
        }
      >

        <Text style={styles.ratingButtonText}>
          RATE YOUR EXPERIENCE
        </Text>

        <Ionicons
          name="arrow-forward"
          size={18}
          color={colors.white}
        />

      </TouchableOpacity>

    </View>
  );
}

function Row({ label, value, green }) {
  return (
    <View style={styles.row}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          green && styles.green,
        ]}
      >
        {value}
      </Text>

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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  successInner: {
    width: 79,
    height: 79,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 27,
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  label: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
  },

  value: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
    maxWidth: 180,
    textAlign: 'right',
  },

  green: {
    fontFamily: 'InterExtraBold',
    fontSize: 17,
    color: colors.success,
  },

  invoiceButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  invoiceText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.accent,
  },

  ratingButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.accent,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  ratingButtonText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.white,
  },
});
