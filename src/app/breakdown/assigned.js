import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function AssignedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.successIcon}>
        <Ionicons
          name="checkmark"
          size={38}
          color={colors.white}
        />
      </View>

      <Text style={styles.title}>
        Mechanic Found!
      </Text>

      <Text style={styles.subtitle}>
        A nearby mechanic has accepted your
        breakdown request.
      </Text>

      <View style={styles.mechanicCard}>

        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={30}
            color={colors.accent}
          />
        </View>

        <View style={styles.info}>
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

        <View style={styles.distance}>
          <Text style={styles.distanceValue}>
            2.4 km
          </Text>

          <Text style={styles.distanceLabel}>
            away
          </Text>
        </View>

      </View>

      <View style={styles.etaCard}>

        <Ionicons
          name="time-outline"
          size={24}
          color={colors.accent}
        />

        <View style={styles.etaInfo}>
          <Text style={styles.etaLabel}>
            ESTIMATED ARRIVAL
          </Text>

          <Text style={styles.etaValue}>
            10 - 15 minutes
          </Text>
        </View>

      </View>

      <View style={styles.buttons}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push('/breakdown/active')
          }
        >
          <Ionicons
            name="location"
            size={19}
            color={colors.white}
          />

          <Text style={styles.primaryText}>
            TRACK MECHANIC
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callButton}>
          <Ionicons
            name="call-outline"
            size={19}
            color={colors.accent}
          />

          <Text style={styles.callText}>
            CALL MECHANIC
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
    padding: 20,
    justifyContent: 'center',
  },

  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },

  mechanicCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  type: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },

  rating: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },

  jobs: {
    fontSize: 10,
    color: colors.textMuted,
  },

  distance: {
    alignItems: 'flex-end',
  },

  distanceValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent,
  },

  distanceLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  etaCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 15,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  etaInfo: {
    flex: 1,
  },

  etaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  etaValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 3,
  },

  buttons: {
    marginTop: 25,
    gap: 10,
  },

  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  primaryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  callButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  callText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
});