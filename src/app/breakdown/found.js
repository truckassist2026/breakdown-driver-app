
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function FoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.successIcon}>

          <Ionicons
            name="checkmark"
            size={34}
            color={colors.white}
          />

        </View>

        <Text style={styles.title}>
          Mechanic found
        </Text>

        <Text style={styles.subtitle}>
          A verified mechanic is on the way to
          help you.
        </Text>


        <View style={styles.etaCard}>

          <View style={styles.etaIcon}>
            <Ionicons
              name="time-outline"
              size={24}
              color={colors.accent}
            />
          </View>

          <View style={styles.etaInfo}>

            <Text style={styles.etaLabel}>
              ESTIMATED ARRIVAL
            </Text>

            <Text style={styles.etaValue}>
              12 minutes
            </Text>

          </View>

          <View style={styles.etaBadge}>
            <Text style={styles.etaBadgeText}>
              ON THE WAY
            </Text>
          </View>

        </View>


        <Text style={styles.sectionLabel}>
          YOUR MECHANIC
        </Text>

        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={31}
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
                size={14}
                color={colors.warning}
              />

              <Text style={styles.rating}>
                4.8
              </Text>

              <Text style={styles.jobs}>
                • 326 jobs completed
              </Text>

            </View>

          </View>

          <TouchableOpacity style={styles.callButton}>

            <Ionicons
              name="call"
              size={19}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        <View style={styles.infoCard}>

          <InfoRow
            icon="construct-outline"
            label="SERVICE"
            value="Battery Assistance"
          />

          <View style={styles.divider} />

          <InfoRow
            icon="car-outline"
            label="VEHICLE"
            value={params.vehicleNumber || 'TN 01 AB 1234'}
          />

          <View style={styles.divider} />

          <InfoRow
            icon="location-outline"
            label="LOCATION"
            value="Chennai, Tamil Nadu"
          />

        </View>


        <View style={styles.trustCard}>

          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color={colors.success}
          />

          <View style={styles.trustInfo}>

            <Text style={styles.trustTitle}>
              Verified mechanic
            </Text>

            <Text style={styles.trustText}>
              Identity and service credentials verified.
            </Text>

          </View>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: '/breakdown/active',
              params: {
                type: params.type || 'battery',
                vehicleNumber:
                  params.vehicleNumber || '',
              },
            })
          }
        >

          <Ionicons
            name="navigate-outline"
            size={19}
            color={colors.white}
          />

          <Text style={styles.primaryText}>
            TRACK MECHANIC
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

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>

      <View style={styles.infoIcon}>

        <Ionicons
          name={icon}
          size={19}
          color={colors.accent}
        />

      </View>

      <View style={styles.infoText}>

        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
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
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 26,
    color: colors.text,
    textAlign: 'center',
    marginTop: 18,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },

  etaCard: {
    backgroundColor: colors.accentLight,
    borderRadius: 18,
    padding: 14,
    marginTop: 23,
    flexDirection: 'row',
    alignItems: 'center',
  },

  etaIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  etaInfo: {
    flex: 1,
  },

  etaLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },

  etaValue: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.text,
    marginTop: 3,
  },

  etaBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  etaBadgeText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.success,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 25,
    marginBottom: 9,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
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

  callButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  infoText: {
    flex: 1,
  },

  infoLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },

  infoValue: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  trustCard: {
    marginTop: 18,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  trustInfo: {
    flex: 1,
    marginLeft: 9,
  },

  trustTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  trustText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
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

  primaryButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  primaryText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});