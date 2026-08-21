import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import colors from '../../../constants/colors';
import { getActiveServiceRequest } from '../../../services/requestService';

export default function FoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ACTIVE REQUEST
  // =====================================================

  useEffect(() => {
    loadActiveRequest();
  }, []);

  async function loadActiveRequest() {
    try {
      setLoading(true);

      console.log(
        '[DRIVER FOUND] Loading active service request...'
      );

      const response =
        await getActiveServiceRequest();

      console.log(
        '[DRIVER FOUND] Active request:',
        JSON.stringify(response, null, 2)
      );

      setActiveRequest(response);

    } catch (error) {

      console.error(
        '[DRIVER FOUND] Failed to load active request:',
        error
      );

    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // DATA
  // =====================================================

  const mechanic =
    activeRequest?.mechanic;

  const vehicle =
    activeRequest?.vehicle;

  const category =
    activeRequest?.category ||
    params.type ||
    '';

  const vehicleNumber =
    vehicle?.registrationNumber ||
    params.vehicleNumber ||
    'Vehicle not available';

  const location =
    activeRequest?.address ||
    'Location not available';

  const status =
    activeRequest?.status ||
    'ASSIGNED';

  const mechanicName =
    mechanic?.name ||
    'Mechanic';

  const mechanicRating =
    Number(mechanic?.rating ?? 0);

  const totalJobs =
    Number(mechanic?.totalJobs ?? 0);

  const experienceYears =
    mechanic?.experienceYears;

  const workshopName =
    mechanic?.workshopName;

  // =====================================================
  // DISPLAY HELPERS
  // =====================================================

  function getServiceName(value) {

    const serviceMap = {
      BATTERY: 'Battery Assistance',
      BREAKDOWN: 'Breakdown Assistance',
      TYRE: 'Tyre Assistance',
      FUEL: 'Fuel Assistance',
    };

    const normalized =
      String(value || '')
        .toUpperCase();

    return (
      serviceMap[normalized] ||
      value ||
      'Roadside Assistance'
    );
  }


  function getStatusLabel(value) {

    const statusMap = {
      SEARCHING: 'SEARCHING',
      ASSIGNED: 'ASSIGNED',
      ACCEPTED: 'ACCEPTED',
      EN_ROUTE: 'ON THE WAY',
      MECHANIC_EN_ROUTE: 'ON THE WAY',
      ARRIVED: 'ARRIVED',
      IN_PROGRESS: 'IN PROGRESS',
      COMPLETED: 'COMPLETED',
      CANCELLED: 'CANCELLED',
    };

    const normalized =
      String(value || '')
        .toUpperCase();

    return (
      statusMap[normalized] ||
      normalized ||
      'ASSIGNED'
    );
  }


  function getMechanicType() {

    if (workshopName) {
      return workshopName;
    }

    if (
      experienceYears !== null &&
      experienceYears !== undefined
    ) {
      return `Roadside Mechanic • ${experienceYears} yrs experience`;
    }

    return 'Roadside Mechanic';
  }


  function getLocationText() {

    if (
      location &&
      location !== 'Current GPS location'
    ) {
      return location;
    }

    if (
      activeRequest?.latitude &&
      activeRequest?.longitude
    ) {
      return `${Number(
        activeRequest.latitude
      ).toFixed(5)}, ${Number(
        activeRequest.longitude
      ).toFixed(5)}`;
    }

    return 'Current location';
  }


  function getEtaText() {

    // We intentionally don't show a fake ETA.
    // Live ETA will be implemented when mechanic
    // tracking is connected.

    if (
      mechanic?.latitude !== null &&
      mechanic?.latitude !== undefined &&
      mechanic?.longitude !== null &&
      mechanic?.longitude !== undefined
    ) {

      const driverLat =
        Number(activeRequest?.latitude);

      const driverLng =
        Number(activeRequest?.longitude);

      const mechanicLat =
        Number(mechanic.latitude);

      const mechanicLng =
        Number(mechanic.longitude);

      const sameLocation =
        Math.abs(driverLat - mechanicLat) < 0.00001 &&
        Math.abs(driverLng - mechanicLng) < 0.00001;

      if (sameLocation) {
        return 'Nearby';
      }
    }

    return 'Calculating';
  }


  // =====================================================
  // CALL MECHANIC
  // =====================================================

  async function callMechanic() {

    const phone =
      mechanic?.phone;

    if (!phone) {
      Alert.alert(
        'Phone number unavailable',
        'The mechanic phone number is not available.'
      );

      return;
    }

    try {

      await Linking.openURL(
        `tel:${phone}`
      );

    } catch (error) {

      console.error(
        '[DRIVER FOUND] Unable to open phone:',
        error
      );

      Alert.alert(
        'Unable to call',
        'Unable to open the phone dialer.'
      );
    }
  }


  // =====================================================
  // TRACK MECHANIC
  // =====================================================

  function trackMechanic() {

    router.push({
      pathname: '/breakdown/active',

      params: {
        requestId:
          activeRequest?.id || '',

        type:
          category,

        vehicleNumber:
          vehicleNumber,
      },
    });
  }


  // =====================================================
  // UI
  // =====================================================

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


        {/* =================================================
            ETA / STATUS
        ================================================= */}

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
              {getEtaText()}
            </Text>

          </View>


          <View style={styles.etaBadge}>

            <Text style={styles.etaBadgeText}>
              {getStatusLabel(status)}
            </Text>

          </View>

        </View>


        {/* =================================================
            MECHANIC
        ================================================= */}

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
              {loading
                ? 'Loading...'
                : mechanicName}
            </Text>


            <Text style={styles.type}>
              {getMechanicType()}
            </Text>


            <View style={styles.ratingRow}>

              <Ionicons
                name="star"
                size={14}
                color={colors.warning}
              />


              <Text style={styles.rating}>
                {mechanicRating.toFixed(1)}
              </Text>


              <Text style={styles.jobs}>
                • {totalJobs} jobs completed
              </Text>

            </View>

          </View>


          <TouchableOpacity
            style={styles.callButton}
            onPress={callMechanic}
          >

            <Ionicons
              name="call"
              size={19}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            REQUEST INFORMATION
        ================================================= */}

        <View style={styles.infoCard}>

          <InfoRow
            icon="construct-outline"
            label="SERVICE"
            value={getServiceName(category)}
          />


          <View style={styles.divider} />


          <InfoRow
            icon="car-outline"
            label="VEHICLE"
            value={vehicleNumber}
          />


          <View style={styles.divider} />


          <InfoRow
            icon="location-outline"
            label="LOCATION"
            value={getLocationText()}
          />

        </View>


        {/* =================================================
            TRUST
        ================================================= */}

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


      {/* ===================================================
          BOTTOM BAR
      =================================================== */}

      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={trackMechanic}
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


// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
  icon,
  label,
  value,
}) {

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


// =========================================================
// STYLES
// =========================================================

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