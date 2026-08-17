
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

export default function ArrivedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.arrivedIcon}>

          <Ionicons
            name="location"
            size={35}
            color={colors.white}
          />

        </View>

        <Text style={styles.title}>
          Mechanic has arrived
        </Text>

        <Text style={styles.subtitle}>
          Your mechanic is now at your location.
        </Text>


        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={32}
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
                • 326 jobs
              </Text>

            </View>

          </View>

          <View style={styles.arrivedBadge}>

            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success}
            />

            <Text style={styles.arrivedText}>
              ARRIVED
            </Text>

          </View>

        </View>


        <View style={styles.vehicleCard}>

          <Text style={styles.sectionLabel}>
            VEHICLE
          </Text>

          <View style={styles.vehicleRow}>

            <View style={styles.vehicleIcon}>

              <Ionicons
                name="car-sport-outline"
                size={25}
                color={colors.accent}
              />

            </View>

            <View>

              <Text style={styles.vehicleNumber}>
                TN 01 AB 1234
              </Text>

              <Text style={styles.vehicleType}>
                Your registered vehicle
              </Text>

            </View>

          </View>

        </View>


        <View style={styles.statusCard}>

          <View style={styles.statusIcon}>

            <Ionicons
              name="construct-outline"
              size={22}
              color={colors.accent}
            />

          </View>

          <View style={styles.statusInfo}>

            <Text style={styles.statusTitle}>
              Ready to start service
            </Text>

            <Text style={styles.statusText}>
              The mechanic can now inspect your vehicle
              and begin the requested service.
            </Text>

          </View>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            router.push('/breakdown/service')
          }
        >

          <Ionicons
            name="construct"
            size={19}
            color={colors.white}
          />

          <Text style={styles.startText}>
            START SERVICE
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  arrivedIcon: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 25,
    color: colors.text,
    textAlign: 'center',
    marginTop: 18,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
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

  arrivedBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  arrivedText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.success,
  },

  vehicleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: 20,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
    marginBottom: 10,
  },

  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  vehicleNumber: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
  },

  vehicleType: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  statusCard: {
    marginTop: 20,
    backgroundColor: colors.accentLight,
    borderRadius: 17,
    padding: 14,
    flexDirection: 'row',
  },

  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
  },

  statusText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 3,
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

  startButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  startText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});