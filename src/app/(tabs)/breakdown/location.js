import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Location from 'expo-location';

import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import colors from '../../../constants/colors';

import {
  createServiceRequest,
} from '../../../services/requestService';

import RealLocationMap from '../../../components/RealLocationMap';

export default function LocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [locationConfirmed, setLocationConfirmed] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [location, setLocation] =
    useState(null);

  const mapRef = useRef(null);

  const [locationAddress, setLocationAddress] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  // =====================================================
  // NORMALIZE PARAMETER
  // =====================================================

  const getParam = (value) => {
    if (Array.isArray(value)) {
      return value[0] || '';
    }

    return value || '';
  };

  const vehicleId =
    getParam(params.vehicleId);

  const vehicleNumber =
    getParam(params.vehicleNumber);

  const categoryId =
    getParam(params.categoryId);

  const categoryCode =
    getParam(params.categoryCode);

  const categoryName =
    getParam(params.categoryName);

  const categoryIcon =
    getParam(params.categoryIcon);

  const description =
    getParam(params.description);

  // =====================================================
  // GET CURRENT DRIVER LOCATION
  // =====================================================

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      setErrorMessage('');

      console.log(
        '[Driver Location] Requesting location permission...'
      );

      const {
        status,
      } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocation(null);
        setLocationConfirmed(false);

        setErrorMessage(
          'Location permission is required to find nearby mechanics.'
        );

        return;
      }

      console.log(
        '[Driver Location] Permission granted.'
      );

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        });

      const latitude =
        currentLocation.coords.latitude;

      const longitude =
        currentLocation.coords.longitude;

      console.log(
        '[Driver Location] GPS:',
        {
          latitude,
          longitude,
          accuracy:
            currentLocation.coords.accuracy,
        }
      );

      setLocation({
        latitude,
        longitude,
        accuracy:
          currentLocation.coords.accuracy,
      });

      // =================================================
      // REVERSE GEOCODE
      // =================================================

      try {
        const addresses =
          await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

        if (
          addresses &&
          addresses.length > 0
        ) {
          const address =
            addresses[0];

          const parts = [
            address.name,
            address.street,
            address.district,
            address.city,
            address.region,
            address.postalCode,
          ].filter(Boolean);

          const formattedAddress =
            [...new Set(parts)]
              .join(', ');

          setLocationAddress(
            formattedAddress ||
            'Current GPS location'
          );
        } else {
          setLocationAddress(
            'Current GPS location'
          );
        }
      } catch (geocodeError) {
        console.warn(
          '[Driver Location] Reverse geocoding failed:',
          geocodeError
        );

        setLocationAddress(
          'Current GPS location'
        );
      }

      setLocationConfirmed(true);

    } catch (error) {
      console.error(
        '[Driver Location] Failed to get GPS:',
        error
      );

      setLocation(null);
      setLocationConfirmed(false);

      setErrorMessage(
        error?.message ||
        'Unable to get your current location. Please try again.'
      );

    } finally {
      setLoadingLocation(false);
    }
  };

  // =====================================================
  // LOAD LOCATION WHEN SCREEN OPENS
  // =====================================================

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // =====================================================
  // KEEP MAP CENTERED ON CURRENT GPS
  // =====================================================

  useEffect(() => {
    if (
      !location ||
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number'
    ) {
      return;
    }

    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    };

    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(region, 500);
    }
  }, [location]);

  // =====================================================
  // FIND A MECHANIC
  // =====================================================

  const handleContinue = async () => {
    if (submitting) {
      return;
    }

    // ---------------------------------------------------
    // Validate vehicle
    // ---------------------------------------------------

    if (!vehicleId) {
      setErrorMessage(
        'Please select a vehicle before continuing.'
      );

      return;
    }

    // ---------------------------------------------------
    // Validate category
    // ---------------------------------------------------

    const apiCategory =
      categoryCode ||
      getParam(params.apiCategory);

    if (!apiCategory) {
      setErrorMessage(
        'Please select the type of assistance required.'
      );

      return;
    }

    // ---------------------------------------------------
    // Validate GPS
    // ---------------------------------------------------

    if (
      !location ||
      typeof location.latitude !== 'number' ||
      typeof location.longitude !== 'number'
    ) {
      setErrorMessage(
        'Your current location could not be detected. Please use your current location and try again.'
      );

      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      // =================================================
      // CREATE SERVICE REQUEST
      // =================================================

      const payload = {
        vehicleId,

        category:
          apiCategory,

        description,

        // ===============================================
        // REAL DRIVER GPS
        // ===============================================

        latitude:
          location.latitude,

        longitude:
          location.longitude,

        address:
          locationAddress ||
          'Current GPS location',
      };

      console.log(
        '[Driver Request] Category:',
        apiCategory
      );

      console.log(
        '[Driver Request] Vehicle:',
        vehicleId
      );

      console.log(
        '[Driver Request] Driver GPS:',
        {
          latitude:
            location.latitude,

          longitude:
            location.longitude,

          accuracy:
            location.accuracy,
        }
      );

      console.log(
        '[Driver Request] Address:',
        locationAddress
      );

      console.log(
        '[Driver Request] Creating service request:',
        payload
      );

      const response =
        await createServiceRequest(
          payload
        );

      console.log(
        '[Driver Request] Request created:',
        response
      );

      // =================================================
      // VALIDATE RESPONSE
      // =================================================

      if (!response?.id) {
        throw new Error(
          'Service request was created but no request ID was returned.'
        );
      }

      // =================================================
      // GO TO SEARCHING
      // =================================================

      router.replace({
        pathname:
          '/breakdown/searching',

        params: {
          requestId:
            String(response.id),

          type:
            categoryName,

          apiCategory:
            apiCategory,

          categoryId:
            categoryId,

          categoryCode:
            apiCategory,

          categoryName:
            categoryName,

          categoryIcon:
            categoryIcon,

          vehicleId:
            vehicleId,

          vehicleNumber:
            vehicleNumber,

          description:
            description,
        },
      });

    } catch (error) {
      console.error(
        '[Driver Request] Create request failed:',
        error
      );

      setErrorMessage(
        error?.message ||
        'Unable to create your request. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>

          <Text style={styles.title}>
            Confirm Location
          </Text>

          <Text style={styles.subtitle}>
            Where should we send the mechanic?
          </Text>

        </View>

        <View style={styles.stepBadge}>

          <Text style={styles.stepNumber}>
            3
          </Text>

          <Text style={styles.stepTotal}>
            / 4
          </Text>

        </View>

      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* =================================================
            REAL GPS MAP
        ================================================= */}

        <View style={styles.mapCard}>

          <RealLocationMap
            location={location}
            locationAddress={locationAddress}
            mapRef={mapRef}
          />

          {location ? (
            <View style={styles.mapLabel}>
              <Ionicons
                name="navigate-outline"
                size={14}
                color={colors.accent}
              />

              <Text style={styles.mapLabelText}>
                Your location
              </Text>
            </View>
          ) : null}

        </View>

        {/* =================================================
            SELECTED ASSISTANCE
        ================================================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Assistance
          </Text>

          <Text style={styles.sectionSubtitle}>
            Selected assistance for this request
          </Text>

        </View>

        <View style={styles.assistanceCard}>

          <View style={styles.assistanceIcon}>

            <Ionicons
              name={
                categoryIcon ||
                'construct-outline'
              }
              size={21}
              color={colors.accent}
            />

          </View>

          <View style={styles.assistanceInfo}>

            <Text style={styles.assistanceLabel}>
              ASSISTANCE REQUIRED
            </Text>

            <Text style={styles.assistanceTitle}>
              {categoryName || 'Assistance'}
            </Text>

            {description ? (
              <Text
                style={
                  styles.assistanceDescription
                }
              >
                {description}
              </Text>
            ) : null}

          </View>

          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.success}
          />

        </View>

        {/* =================================================
            VEHICLE
        ================================================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Vehicle
          </Text>

          <Text style={styles.sectionSubtitle}>
            Vehicle selected for this request
          </Text>

        </View>

        <View style={styles.locationCard}>

          <View style={styles.locationIcon}>

            <Ionicons
              name="car-outline"
              size={21}
              color={colors.accent}
            />

          </View>

          <View style={styles.locationInfo}>

            <Text style={styles.locationLabel}>
              VEHICLE
            </Text>

            <Text style={styles.locationTitle}>
              {vehicleNumber || 'Vehicle'}
            </Text>

            <Text style={styles.locationAddress}>
              Vehicle selected for roadside assistance
            </Text>

          </View>

          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.success}
          />

        </View>

        {/* =================================================
            LOCATION
        ================================================= */}

        <View
          style={[
            styles.sectionHeader,
            styles.locationSection,
          ]}
        >

          <Text style={styles.sectionTitle}>
            Your location
          </Text>

          <Text style={styles.sectionSubtitle}>
            We'll use this location to find nearby mechanics
          </Text>

        </View>

        <View style={styles.locationCard}>

          <View style={styles.locationIcon}>

            <Ionicons
              name="location"
              size={21}
              color={colors.accent}
            />

          </View>

          <View style={styles.locationInfo}>

            <Text style={styles.locationLabel}>
              CURRENT LOCATION
            </Text>

            <Text style={styles.locationTitle}>
              {loadingLocation
                ? 'Detecting your location...'
                : locationAddress ||
                  'Current GPS location'}
            </Text>

            <Text style={styles.locationAddress}>
              {location
                ? `GPS: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                : 'Waiting for GPS location'}
            </Text>

          </View>

          {loadingLocation ? (
            <ActivityIndicator
              size="small"
              color={colors.accent}
            />
          ) : (
            <Ionicons
              name={
                locationConfirmed
                  ? 'checkmark-circle'
                  : 'alert-circle-outline'
              }
              size={22}
              color={
                locationConfirmed
                  ? colors.success
                  : colors.danger
              }
            />
          )}

        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getCurrentLocation}
          disabled={
            submitting ||
            loadingLocation
          }
        >

          {loadingLocation ? (
            <ActivityIndicator
              size="small"
              color={colors.accent}
            />
          ) : (
            <Ionicons
              name="locate-outline"
              size={18}
              color={colors.accent}
            />
          )}

          <Text style={styles.refreshText}>
            {loadingLocation
              ? 'GETTING LOCATION...'
              : 'USE MY CURRENT LOCATION'}
          </Text>

        </TouchableOpacity>

        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage ? (
          <View style={styles.errorCard}>

            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.danger}
            />

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>

          </View>
        ) : null}

        {/* =================================================
            SAFETY
        ================================================= */}

        <View style={styles.safetyCard}>

          <View style={styles.safetyIcon}>

            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.success}
            />

          </View>

          <View style={styles.safetyInfo}>

            <Text style={styles.safetyTitle}>
              Your location is private
            </Text>

            <Text style={styles.safetyText}>
              Your location is shared only with the
              mechanic assigned to this request.
            </Text>

          </View>

        </View>

      </ScrollView>

      {/* =================================================
          BOTTOM ACTION
      ================================================= */}

      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={[
            styles.continueButton,
            submitting &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={
            submitting ||
            loadingLocation
          }
        >

          {submitting ? (

            <View style={styles.loadingContent}>

              <ActivityIndicator
                size="small"
                color={colors.white}
              />

              <Text style={styles.continueText}>
                CREATING REQUEST...
              </Text>

            </View>

          ) : (

            <>
              <Text style={styles.continueText}>
                FIND A MECHANIC
              </Text>

              <View style={styles.arrow}>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={colors.white}
                />

              </View>
            </>

          )}

        </TouchableOpacity>

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

  stepBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  stepNumber: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.accent,
  },

  stepTotal: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  content: {
    padding: 20,
    paddingBottom: 130,
  },

  mapCard: {
    height: 260,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  realMap: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  webMapFallback: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  webMapPin: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#2563EB25',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB25',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapLoading: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapLoadingText: {
    marginTop: 10,
    fontFamily: 'InterMedium',
    fontSize: 11,
    color: colors.textMuted,
  },

  webCoordinates: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  webCoordinatesLabel: {
    fontFamily: 'InterBold',
    fontSize: 8,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  webCoordinatesText: {
    fontFamily: 'InterSemiBold',
    fontSize: 10,
    color: colors.text,
    marginTop: 2,
  },

  mapLabel: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  mapLabelText: {
    fontFamily: 'InterMedium',
    fontSize: 10,
    color: colors.text,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  locationSection: {
    marginTop: 22,
  },

  sectionTitle: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  sectionSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },

  assistanceCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  assistanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  assistanceInfo: {
    flex: 1,
  },

  assistanceLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  assistanceTitle: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
    marginTop: 3,
  },

  assistanceDescription: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },

  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  locationInfo: {
    flex: 1,
  },

  locationLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  locationTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
    marginTop: 3,
  },

  locationAddress: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  refreshButton: {
    height: 47,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  refreshText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.accent,
  },

  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  errorText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.danger,
  },

  safetyCard: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 13,
    marginTop: 20,
    flexDirection: 'row',
  },

  safetyIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  safetyInfo: {
    flex: 1,
  },

  safetyTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  safetyText: {
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },

  continueButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingLeft: 18,
    paddingRight: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  continueButtonDisabled: {
    opacity: 0.7,
  },

  continueText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },

  loadingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  arrow: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

});