import { useEffect, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../../constants/colors';

export default function ActiveScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [eta, setEta] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 1;
        }

        return current - 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>

          <Text style={styles.title}>
            Mechanic on the way
          </Text>

          <Text style={styles.subtitle}>
            Track your mechanic
          </Text>

        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            LIVE
          </Text>
        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* MAP */}

        <View style={styles.mapCard}>

          <View style={styles.map}>

            <View style={styles.road1} />
            <View style={styles.road2} />
            <View style={styles.road3} />

            {/* Driver */}

            <View style={styles.driverMarker}>

              <Ionicons
                name="location"
                size={25}
                color={colors.white}
              />

            </View>

            {/* Mechanic */}

            <View style={styles.mechanicMarker}>

              <Ionicons
                name="construct"
                size={19}
                color={colors.white}
              />

            </View>

            <View style={styles.mapBottom}>

              <View style={styles.mapLegend}>

                <View style={styles.legendDotDriver} />

                <Text style={styles.legendText}>
                  You
                </Text>

                <View style={styles.legendDotMechanic} />

                <Text style={styles.legendText}>
                  Mechanic
                </Text>

              </View>

            </View>

          </View>

        </View>


        {/* ETA */}

        <View style={styles.etaCard}>

          <View style={styles.etaMain}>

            <Text style={styles.etaLabel}>
              ARRIVING IN
            </Text>

            <Text style={styles.eta}>
              {eta} min
            </Text>

          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.etaSide}>

            <Ionicons
              name="navigate-outline"
              size={20}
              color={colors.accent}
            />

            <Text style={styles.distance}>
              3.2 km
            </Text>

            <Text style={styles.distanceLabel}>
              away
            </Text>

          </View>

        </View>


        {/* MECHANIC */}

        <Text style={styles.sectionLabel}>
          YOUR MECHANIC
        </Text>

        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={29}
              color={colors.accent}
            />

          </View>

          <View style={styles.mechanicInfo}>

            <Text style={styles.mechanicName}>
              Kumar
            </Text>

            <Text style={styles.mechanicType}>
              Roadside Mechanic • KA 05 XY 7788
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

          <TouchableOpacity style={styles.callButton}>

            <Ionicons
              name="call"
              size={18}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* STATUS */}

        <Text style={styles.sectionLabel}>
          SERVICE STATUS
        </Text>

        <View style={styles.statusCard}>

          <Status
            icon="checkmark"
            title="Request accepted"
            subtitle="Mechanic has accepted your request"
            completed
          />

          <View style={styles.statusLine} />

          <Status
            icon="navigate"
            title="Mechanic on the way"
            subtitle="Heading towards your location"
            active
          />

          <View style={styles.statusLine} />

          <Status
            icon="location"
            title="Mechanic arrived"
            subtitle="Waiting for mechanic to arrive"
          />

        </View>


        <View style={styles.safetyCard}>

          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color={colors.success}
          />

          <Text style={styles.safetyText}>
            Stay in a safe location while you wait.
            Keep your hazard lights on if necessary.
          </Text>

        </View>


        {/* DEMO BUTTON */}

        <TouchableOpacity
          style={styles.demoButton}
          onPress={() =>
            router.push('/breakdown/arrived')
          }
        >

          <Ionicons
            name="location"
            size={18}
            color={colors.white}
          />

          <Text style={styles.demoText}>
            SIMULATE MECHANIC ARRIVAL
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

function Status({
  icon,
  title,
  subtitle,
  completed,
  active,
}) {
  return (
    <View style={styles.statusRow}>

      <View
        style={[
          styles.statusIcon,
          completed && styles.completedIcon,
          active && styles.activeIcon,
        ]}
      >

        <Ionicons
          name={icon}
          size={15}
          color={
            completed || active
              ? colors.white
              : colors.textLight
          }
        />

      </View>

      <View style={styles.statusInfo}>

        <Text
          style={[
            styles.statusTitle,
            active && styles.activeStatusTitle,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.statusSubtitle}>
          {subtitle}
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

  header: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },

  liveText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.success,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  mapCard: {
    height: 280,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  map: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    position: 'relative',
  },

  road1: {
    position: 'absolute',
    width: 500,
    height: 36,
    backgroundColor: colors.white,
    transform: [{ rotate: '-27deg' }],
    top: 110,
    left: -80,
  },

  road2: {
    position: 'absolute',
    width: 400,
    height: 26,
    backgroundColor: colors.white,
    transform: [{ rotate: '35deg' }],
    top: 150,
    left: 80,
  },

  road3: {
    position: 'absolute',
    width: 380,
    height: 18,
    backgroundColor: colors.white,
    transform: [{ rotate: '-52deg' }],
    top: 50,
    left: 40,
  },

  driverMarker: {
    position: 'absolute',
    top: 175,
    left: 105,
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mechanicMarker: {
    position: 'absolute',
    top: 65,
    right: 90,
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },

  mapLegend: {
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  legendDotDriver: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  legendDotMechanic: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },

  legendText: {
    fontFamily: 'InterMedium',
    fontSize: 9,
    color: colors.textSecondary,
  },

  etaCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  etaMain: {
    flex: 1,
  },

  etaLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  eta: {
    fontFamily: 'InterExtraBold',
    fontSize: 24,
    color: colors.text,
    marginTop: 2,
  },

  dividerVertical: {
    width: 1,
    height: 43,
    backgroundColor: colors.border,
    marginHorizontal: 18,
  },

  etaSide: {
    width: 75,
    alignItems: 'center',
  },

  distance: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },

  distanceLabel: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 22,
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

  mechanicName: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
  },

  mechanicType: {
    fontFamily: 'InterRegular',
    fontSize: 9,
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
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },

  statusIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  completedIcon: {
    backgroundColor: colors.success,
  },

  activeIcon: {
    backgroundColor: colors.accent,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.textLight,
  },

  activeStatusTitle: {
    color: colors.accent,
  },

  statusSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },

  statusLine: {
    width: 1,
    height: 11,
    backgroundColor: colors.border,
    marginLeft: 17,
  },

  safetyCard: {
    marginTop: 18,
    backgroundColor: colors.successLight,
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  safetyText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  demoButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  demoText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.white,
  },
});
