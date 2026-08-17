
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.successIcon}>

          <Ionicons
            name="checkmark"
            size={40}
            color={colors.white}
          />

        </View>

        <Text style={styles.title}>
          Service completed
        </Text>

        <Text style={styles.subtitle}>
          Your vehicle has been successfully serviced.
        </Text>


        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={30}
              color={colors.accent}
            />

          </View>

          <View style={styles.mechanicInfo}>

            <Text style={styles.name}>
              Kumar
            </Text>

            <Text style={styles.type}>
              Roadside Mechanic
            </Text>

            <View style={styles.ratingRow}>

              <Ionicons
                name="star"
                size={13}
                color={colors.warning}
              />

              <Text style={styles.rating}>
                4.8
              </Text>

              <Text style={styles.jobs}>
                • 326 jobs
              </Text>

            </View>

          </View>

          <View style={styles.completedBadge}>

            <Text style={styles.completedText}>
              COMPLETED
            </Text>

          </View>

        </View>


        <Text style={styles.sectionLabel}>
          SERVICE SUMMARY
        </Text>

        <View style={styles.card}>

          <ServiceRow
            icon="battery-half-outline"
            title="Battery inspection"
            amount="₹100"
          />

          <View style={styles.divider} />

          <ServiceRow
            icon="flash-outline"
            title="Jump start assistance"
            amount="₹200"
          />

        </View>


        <Text style={styles.sectionLabel}>
          BILL DETAILS
        </Text>

        <View style={styles.billCard}>

          <BillRow
            label="Service charge"
            value="₹300"
          />

          <BillRow
            label="Travel charge"
            value="₹100"
          />

          <View style={styles.divider} />

          <View style={styles.totalRow}>

            <Text style={styles.totalLabel}>
              TOTAL
            </Text>

            <Text style={styles.total}>
              ₹400
            </Text>

          </View>

        </View>


        <View style={styles.infoCard}>

          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.info}
          />

          <Text style={styles.infoText}>
            Please review the bill before proceeding
            to payment.
          </Text>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push('/breakdown/payment')
          }
        >

          <Ionicons
            name="card-outline"
            size={19}
            color={colors.white}
          />

          <Text style={styles.buttonText}>
            PROCEED TO PAYMENT
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.white}
          />

        </TouchableOpacity>

      </View>

    </View>
  );
}

function ServiceRow({ icon, title, amount }) {
  return (
    <View style={styles.serviceRow}>

      <View style={styles.serviceIcon}>

        <Ionicons
          name={icon}
          size={21}
          color={colors.accent}
        />

      </View>

      <Text style={styles.serviceTitle}>
        {title}
      </Text>

      <Text style={styles.serviceAmount}>
        {amount}
      </Text>

    </View>
  );
}

function BillRow({ label, value }) {
  return (
    <View style={styles.billRow}>

      <Text style={styles.billLabel}>
        {label}
      </Text>

      <Text style={styles.billValue}>
        {value}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  successIcon: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 25,
    color: colors.text,
    textAlign: 'center',
    marginTop: 17,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 24,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  mechanicInfo: {
    flex: 1,
  },

  name: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
  },

  type: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  rating: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.text,
  },

  jobs: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  completedBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  completedText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.success,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 22,
    marginBottom: 9,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  serviceRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  serviceIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  serviceTitle: {
    flex: 1,
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
  },

  serviceAmount: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  billCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  billLabel: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },

  billValue: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.text,
  },

  total: {
    fontFamily: 'InterExtraBold',
    fontSize: 23,
    color: colors.accent,
  },

  infoCard: {
    marginTop: 17,
    backgroundColor: colors.infoLight,
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  infoText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: 20,
  },

  button: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  buttonText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});