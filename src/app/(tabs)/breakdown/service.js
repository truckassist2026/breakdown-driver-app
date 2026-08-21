import {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import colors from '../../../constants/colors';

import {
  getActiveServiceRequest,
} from '../../../services/requestService';

export default function ServiceScreen() {

  const router = useRouter();

  const params = useLocalSearchParams();

  const requestId =
    Array.isArray(params.requestId)
      ? params.requestId[0]
      : params.requestId;

  const [
    request,
    setRequest,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  // =======================================================
  // LIVE BACKEND STATUS
  // =======================================================
  //
  // Driver NEVER changes the service status.
  // The mechanic changes it.
  //
  // ARRIVED
  //   -> mechanic sees arrived
  //
  // IN_PROGRESS
  //   -> driver automatically sees service in progress
  //
  // PAYMENT_PENDING
  //   -> driver moves to payment
  // =======================================================

  useEffect(() => {

    let mounted = true;

    const loadRequest = async () => {

      try {

        const response =
          await getActiveServiceRequest();

        if (!mounted) {
          return;
        }

        const responseId =
          response?.id
            ? String(response.id)
            : '';

        // If the active endpoint returned another request,
        // do not replace the request shown by this screen.
        if (
          requestId &&
          responseId &&
          responseId !== String(requestId)
        ) {
          return;
        }

        console.log(
          '[DRIVER SERVICE] Backend status:',
          response?.status
        );

        setRequest(response);
        setError('');

      } catch (err) {

        console.error(
          '[DRIVER SERVICE] Status load failed:',
          err
        );

        if (mounted) {
          setError(
            err?.message ||
            'Unable to load live service status.'
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    };

    loadRequest();

    const interval =
      setInterval(
        loadRequest,
        2000
      );

    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, [requestId]);

  const status =
    String(
      request?.status ||
      'ARRIVED'
    )
      .trim()
      .toUpperCase();

  const mechanic =
    request?.mechanic ||
    null;

  const vehicle =
    request?.vehicle ||
    null;

  const category =
    String(
      request?.category ||
      'OTHER'
    ).toUpperCase();

  const mechanicName =
    mechanic?.name ||
    'Your mechanic';

  const mechanicPhone =
    mechanic?.phone ||
    '';

  const mechanicRating =
    mechanic?.rating !== null &&
    mechanic?.rating !== undefined
      ? Number(mechanic.rating).toFixed(1)
      : '--';

  const mechanicJobs =
    mechanic?.totalJobs ?? 0;

  const serviceTitle =
    category === 'BATTERY'
      ? 'Battery inspection'
      : category === 'TYRE'
        ? 'Tyre service'
        : category === 'FUEL'
          ? 'Fuel assistance'
          : category === 'BREAKDOWN'
            ? 'Vehicle breakdown service'
            : 'Roadside assistance';

  const serviceDescription =
    request?.description ||
    'Your mechanic is working on your vehicle.';

  const vehicleName =
    [
      vehicle?.manufacturer,
      vehicle?.model,
    ]
      .filter(Boolean)
      .join(' ') ||
    'Vehicle';

  const vehicleNumber =
    vehicle?.registrationNumber ||
    'Vehicle number unavailable';

  const isAccepted =
    [
      'ASSIGNED',
      'MECHANIC_EN_ROUTE',
      'ARRIVED',
      'IN_PROGRESS',
      'PAYMENT_PENDING',
    ].includes(status);

  const isEnRoute =
    [
      'MECHANIC_EN_ROUTE',
      'ARRIVED',
      'IN_PROGRESS',
      'PAYMENT_PENDING',
    ].includes(status);

  const isArrived =
    [
      'ARRIVED',
      'IN_PROGRESS',
      'PAYMENT_PENDING',
    ].includes(status);

  const isInProgress =
    [
      'IN_PROGRESS',
      'PAYMENT_PENDING',
    ].includes(status);

  const isPaymentPending =
    status === 'PAYMENT_PENDING';

  useEffect(() => {

    if (!isPaymentPending || !requestId) {
      return;
    }

    console.log(
      '[DRIVER SERVICE] Payment pending - opening payment:',
      requestId
    );

    router.replace({
      pathname:
        '/breakdown/payment',
      params: {
        requestId:
          String(requestId),
      },
    });

  }, [
    isPaymentPending,
    requestId,
    router,
  ]);

  const handleCallMechanic = async () => {

    if (!mechanicPhone) {
      return;
    }

    try {

      await Linking.openURL(
        `tel:${mechanicPhone}`
      );

    } catch (err) {

      console.error(
        '[DRIVER SERVICE] Call failed:',
        err
      );

    }
  };

  if (loading && !request) {

    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />

          <Text style={styles.loadingText}>
            Loading live service status...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !request) {

    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>

          <Ionicons
            name="alert-circle-outline"
            size={36}
            color={colors.accent}
          />

          <Text style={styles.errorTitle}>
            Unable to load service
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>
              GO BACK
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

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
            {isInProgress
              ? 'Service in Progress'
              : 'Mechanic Arrived'}
          </Text>

          <Text style={styles.subtitle}>
            {isInProgress
              ? 'Your vehicle is being serviced'
              : 'Your mechanic has reached your location'}
          </Text>

        </View>

        <View style={styles.statusBadge}>

          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            {status}
          </Text>

        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>

          <View style={styles.heroIcon}>

            <Ionicons
              name={
                isInProgress
                  ? 'construct'
                  : 'location'
              }
              size={34}
              color={colors.white}
            />

          </View>

          <Text style={styles.heroTitle}>
            {isInProgress
              ? 'Service in progress'
              : 'Mechanic arrived'}
          </Text>

          <Text style={styles.heroText}>
            {isInProgress
              ? `${mechanicName} is working on your vehicle.`
              : `${mechanicName} has reached your location.`}
          </Text>

        </View>


        {/* =================================================
            MECHANIC
        ================================================= */}

        <View style={styles.mechanicCard}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={29}
              color={colors.accent}
            />

          </View>

          <View style={styles.mechanicInfo}>

            <Text style={styles.name}>
              {mechanicName}
            </Text>

            <Text style={styles.type}>
              {mechanic?.workshopName ||
                'Roadside Mechanic'}
            </Text>

            <View style={styles.ratingRow}>

              <Ionicons
                name="star"
                size={13}
                color={colors.warning}
              />

              <Text style={styles.rating}>
                {mechanicRating}
              </Text>

              <Text style={styles.jobs}>
                • {mechanicJobs} jobs
              </Text>

            </View>

          </View>

          <TouchableOpacity
            style={styles.callButton}
            onPress={handleCallMechanic}
            disabled={!mechanicPhone}
          >

            <Ionicons
              name="call"
              size={18}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            CURRENT SERVICE
        ================================================= */}

        <Text style={styles.sectionLabel}>
          CURRENT SERVICE
        </Text>

        <View style={styles.workCard}>

          <View style={styles.workIcon}>

            <Ionicons
              name={
                category === 'BATTERY'
                  ? 'battery-half-outline'
                  : category === 'TYRE'
                    ? 'disc-outline'
                    : category === 'FUEL'
                      ? 'flame-outline'
                      : 'construct-outline'
              }
              size={24}
              color={colors.serviceBattery}
            />

          </View>

          <View style={styles.workInfo}>

            <Text style={styles.workTitle}>
              {serviceTitle}
            </Text>

            <Text style={styles.workText}>
              {serviceDescription}
            </Text>

            <View style={styles.workingBadge}>

              <View style={styles.workingDot} />

              <Text style={styles.workingText}>
                {isInProgress
                  ? 'IN PROGRESS'
                  : 'MECHANIC ARRIVED'}
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            VEHICLE
        ================================================= */}

        <Text style={styles.sectionLabel}>
          YOUR VEHICLE
        </Text>

        <View style={styles.vehicleCard}>

          <View style={styles.vehicleIcon}>

            <Ionicons
              name="car-outline"
              size={25}
              color={colors.accent}
            />

          </View>

          <View style={styles.vehicleInfo}>

            <Text style={styles.vehicleTitle}>
              {vehicleNumber}
            </Text>

            <Text style={styles.vehicleSubtitle}>
              {vehicleName}
            </Text>

          </View>

        </View>


        {/* =================================================
            SERVICE STATUS
        ================================================= */}

        <Text style={styles.sectionLabel}>
          SERVICE STATUS
        </Text>

        <View style={styles.timelineCard}>

          <Timeline
            icon="checkmark"
            title="Request accepted"
            subtitle="Mechanic accepted your request"
            completed={isAccepted}
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="location"
            title="Mechanic arrived"
            subtitle="Mechanic reached your location"
            active={status === 'ARRIVED'}
            completed={isInProgress}
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="construct"
            title="Service in progress"
            subtitle={
              isInProgress
                ? 'Vehicle is currently being serviced'
                : 'Waiting for mechanic to start service'
            }
            active={isInProgress}
            completed={isPaymentPending}
          />

          <View style={styles.timelineLine} />

          <Timeline
            icon="card-outline"
            title="Payment pending"
            subtitle={
              isPaymentPending
                ? 'Service completed. Payment is pending.'
                : 'Waiting for service completion'
            }
            active={isPaymentPending}
          />

        </View>


        <View style={styles.liveCard}>

          <View style={styles.liveIcon}>
            <Ionicons
              name="sync-outline"
              size={20}
              color={colors.accent}
            />
          </View>

          <View style={styles.liveInfo}>

            <Text style={styles.liveTitle}>
              Live service status
            </Text>

            <Text style={styles.liveText}>
              This screen updates automatically when
              your mechanic changes the service status.
            </Text>

          </View>

        </View>


        <View style={styles.noteCard}>

          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.info}
          />

          <Text style={styles.noteText}>
            The final bill will be generated after the
            mechanic completes the service.
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}

function Timeline({
  icon,
  title,
  subtitle,
  completed,
  active,
}) {

  return (
    <View style={styles.timelineRow}>

      <View
        style={[
          styles.timelineIcon,
          completed &&
            styles.timelineCompleted,
          active &&
            styles.timelineActive,
        ]}
      >

        <Ionicons
          name={icon}
          size={14}
          color={
            completed || active
              ? colors.white
              : colors.textLight
          }
        />

      </View>

      <View style={styles.timelineInfo}>

        <Text
          style={[
            styles.timelineTitle,
            active &&
              styles.timelineTitleActive,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.timelineSubtitle}>
          {subtitle}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    fontFamily: 'InterMedium',
    fontSize: 11,
    color: colors.textMuted,
  },

  errorTitle: {
    marginTop: 12,
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  errorText: {
    marginTop: 7,
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: colors.accent,
  },

  retryText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.white,
  },

  vehicleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
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

  vehicleInfo: {
    flex: 1,
  },

  vehicleTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  vehicleSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 3,
  },

  liveCard: {
    marginTop: 16,
    backgroundColor: colors.infoLight,
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  liveIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liveInfo: {
    flex: 1,
  },

  liveTitle: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.text,
  },

  liveText: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },


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

  statusBadge: {
    backgroundColor: colors.accentLight,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  statusText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.accent,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  hero: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 22,
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
    fontFamily: 'InterExtraBold',
    fontSize: 24,
    color: colors.text,
    marginTop: 15,
  },

  heroText: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
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
    width: 54,
    height: 54,
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

  callButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginTop: 22,
    marginBottom: 9,
  },

  workCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
  },

  workIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  workInfo: {
    flex: 1,
  },

  workTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  workText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 3,
  },

  workingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },

  workingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  workingText: {
    fontFamily: 'InterBold',
    fontSize: 8,
    color: colors.accent,
  },

  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  timelineRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  timelineCompleted: {
    backgroundColor: colors.success,
  },

  timelineActive: {
    backgroundColor: colors.accent,
  },

  timelineInfo: {
    flex: 1,
  },

  timelineTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.textLight,
  },

  timelineTitleActive: {
    color: colors.accent,
  },

  timelineSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },

  timelineLine: {
    height: 10,
    width: 1,
    backgroundColor: colors.border,
    marginLeft: 17,
  },

  noteCard: {
    marginTop: 17,
    backgroundColor: colors.infoLight,
    borderRadius: 15,
    padding: 13,
    flexDirection: 'row',
    gap: 9,
  },

  noteText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  demoButton: {
    height: 51,
    borderRadius: 15,
    backgroundColor: colors.primary,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  demoText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.white,
  },
});