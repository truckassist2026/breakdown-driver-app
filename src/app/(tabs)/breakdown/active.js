import { useEffect, useRef, useState } from 'react';

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
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import colors from '../../../constants/colors';
import {
  getActiveServiceRequest,
} from '../../../services/requestService';

import RealLocationMap from '../../../components/RealLocationMap';


// =========================================================
// ACTIVE / TRACK MECHANIC SCREEN
// =========================================================

export default function ActiveScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const mapRef =
    useRef(null);


  const [
    activeRequest,
    setActiveRequest,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  // =======================================================
  // LOAD ACTIVE REQUEST
  // =======================================================

  useEffect(() => {

    loadActiveRequest();

  }, []);


  async function loadActiveRequest(
    showRefreshing = false
  ) {

    try {

      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }


      console.log(
        '[DRIVER ACTIVE] Loading active request...'
      );


      console.log(
        '[DRIVER ACTIVE] Request ID:',
        params?.requestId
      );


      const response =
        await getActiveServiceRequest();


      console.log(
        '[DRIVER ACTIVE] Active request:',
        JSON.stringify(
          response,
          null,
          2
        )
      );


      setActiveRequest(
        response
      );


    } catch (error) {

      console.error(
        '[DRIVER ACTIVE] Failed to load active request:',
        error
      );


      if (!showRefreshing) {

        Alert.alert(
          'Unable to load request',
          'We could not load your active service request.'
        );

      }

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  }


  // =======================================================
  // DATA
  // =======================================================

  const mechanic =
    activeRequest?.mechanic ||
    null;


  const vehicle =
    activeRequest?.vehicle ||
    null;


  const driverLatitude =
    Number(
      activeRequest?.latitude
    );


  const driverLongitude =
    Number(
      activeRequest?.longitude
    );


  const mechanicLatitude =
    Number(
      mechanic?.latitude
    );


  const mechanicLongitude =
    Number(
      mechanic?.longitude
    );


  const hasDriverLocation =
    Number.isFinite(
      driverLatitude
    ) &&
    Number.isFinite(
      driverLongitude
    );


  const hasMechanicLocation =
    Number.isFinite(
      mechanicLatitude
    ) &&
    Number.isFinite(
      mechanicLongitude
    );


  // =======================================================
  // REQUEST INFORMATION
  // =======================================================

  const requestStatus =
    String(
      activeRequest?.status ||
      'ASSIGNED'
    ).toUpperCase();


  const category =
    activeRequest?.category ||
    '';


  const mechanicName =
    mechanic?.name ||
    'Mechanic';


  const mechanicPhone =
    mechanic?.phone ||
    '';


  const mechanicRating =
    Number(
      mechanic?.rating ?? 0
    );


  const mechanicJobs =
    Number(
      mechanic?.totalJobs ?? 0
    );


  const workshopName =
    mechanic?.workshopName ||
    'Roadside Mechanic';


  const vehicleNumber =
    vehicle?.registrationNumber ||
    activeRequest?.vehicleId ||
    'Vehicle';


  const locationAddress =
    activeRequest?.address ||
    'Current GPS location';


  // =======================================================
  // SERVICE NAME
  // =======================================================

  function getServiceName(
    value
  ) {

    const serviceMap = {

      BATTERY:
        'Battery Assistance',

      BREAKDOWN:
        'Breakdown Assistance',

      TYRE:
        'Tyre Assistance',

      FUEL:
        'Fuel Assistance',

    };


    const normalized =
      String(
        value || ''
      ).toUpperCase();


    return (
      serviceMap[normalized] ||
      value ||
      'Roadside Assistance'
    );
  }


  // =======================================================
  // STATUS LABEL
  // =======================================================

  function getStatusLabel(
    status
  ) {

    const statusMap = {

      SEARCHING:
        'SEARCHING',

      ASSIGNED:
        'ASSIGNED',

      ACCEPTED:
        'ACCEPTED',

      EN_ROUTE:
        'ON THE WAY',

      MECHANIC_EN_ROUTE:
        'ON THE WAY',

      ARRIVED:
        'ARRIVED',

      IN_PROGRESS:
        'IN PROGRESS',

      COMPLETED:
        'COMPLETED',

      CANCELLED:
        'CANCELLED',

    };


    return (
      statusMap[status] ||
      status ||
      'ASSIGNED'
    );
  }


  // =======================================================
  // HEADER TITLE
  // =======================================================

  function getHeaderTitle() {

    if (
      requestStatus ===
      'ARRIVED'
    ) {
      return 'Mechanic arrived';
    }


    if (
      requestStatus ===
      'IN_PROGRESS'
    ) {
      return 'Service in progress';
    }


    if (
      requestStatus ===
      'COMPLETED'
    ) {
      return 'Service completed';
    }


    if (
      requestStatus ===
      'CANCELLED'
    ) {
      return 'Request cancelled';
    }


    return 'Mechanic on the way';
  }


  // =======================================================
  // DISTANCE CALCULATION
  // =======================================================

  function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ) {

    if (
      !Number.isFinite(lat1) ||
      !Number.isFinite(lon1) ||
      !Number.isFinite(lat2) ||
      !Number.isFinite(lon2)
    ) {

      return null;
    }


    const earthRadiusKm =
      6371;


    const dLat =
      (
        lat2 - lat1
      ) *
      Math.PI /
      180;


    const dLon =
      (
        lon2 - lon1
      ) *
      Math.PI /
      180;


    const a =
      Math.sin(
        dLat / 2
      ) *
      Math.sin(
        dLat / 2
      ) +

      Math.cos(
        lat1 *
        Math.PI /
        180
      ) *

      Math.cos(
        lat2 *
        Math.PI /
        180
      ) *

      Math.sin(
        dLon / 2
      ) *
      Math.sin(
        dLon / 2
      );


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(
          1 - a
        )
      );


    return (
      earthRadiusKm *
      c
    );
  }


  const distanceKm =
    calculateDistanceKm(
      driverLatitude,
      driverLongitude,
      mechanicLatitude,
      mechanicLongitude
    );


  const distanceText =
    distanceKm === null

      ? 'Calculating'

      : distanceKm < 1

        ? `${Math.round(
            distanceKm * 1000
          )} m`

        : `${distanceKm.toFixed(
            1
          )} km`;


  // =======================================================
  // ETA
  // =======================================================
  //
  // We do NOT display a fake ETA.
  //
  // Real road ETA will be implemented after the
  // mechanic live-location and routing flow is connected.
  // =======================================================

  function getEtaText() {

    if (
      requestStatus ===
      'ARRIVED'
    ) {
      return 'Arrived';
    }


    if (
      distanceKm === null
    ) {
      return 'Calculating';
    }


    if (
      distanceKm < 0.05
    ) {
      return 'Nearby';
    }


    return 'On the way';
  }


  // =======================================================
  // CALL MECHANIC
  // =======================================================

  async function callMechanic() {

    if (!mechanicPhone) {

      Alert.alert(
        'Phone unavailable',
        'The mechanic phone number is not available.'
      );

      return;
    }


    try {

      await Linking.openURL(
        `tel:${mechanicPhone}`
      );

    } catch (error) {

      console.error(
        '[DRIVER ACTIVE] Call failed:',
        error
      );


      Alert.alert(
        'Unable to call',
        'Unable to open the phone dialer.'
      );
    }
  }


  // =======================================================
  // STATUS PROGRESS
  // =======================================================

  const requestAccepted =
    [
      'ASSIGNED',
      'ACCEPTED',
      'EN_ROUTE',
      'MECHANIC_EN_ROUTE',
      'ARRIVED',
      'IN_PROGRESS',
      'COMPLETED',
    ].includes(
      requestStatus
    );


  const mechanicEnRoute =
    [
      'EN_ROUTE',
      'MECHANIC_EN_ROUTE',
      'ARRIVED',
      'IN_PROGRESS',
      'COMPLETED',
    ].includes(
      requestStatus
    );


  const mechanicArrived =
    [
      'ARRIVED',
      'IN_PROGRESS',
      'COMPLETED',
    ].includes(
      requestStatus
    );


  // =======================================================
  // LOADING
  // =======================================================

  if (
    loading &&
    !activeRequest
  ) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >

        <Ionicons
          name="navigate-outline"
          size={36}
          color={colors.accent}
        />


        <Text
          style={
            styles.loadingTitle
          }
        >
          Loading mechanic location...
        </Text>


        <Text
          style={
            styles.loadingText
          }
        >
          Please wait while we load your active request.
        </Text>

      </View>
    );
  }


  // =======================================================
  // NO ACTIVE REQUEST
  // =======================================================

  if (
    !loading &&
    !activeRequest
  ) {

    return (
      <View
        style={
          styles.loadingContainer
        }
      >

        <Ionicons
          name="alert-circle-outline"
          size={42}
          color={colors.warning}
        />


        <Text
          style={
            styles.loadingTitle
          }
        >
          No active request
        </Text>


        <Text
          style={
            styles.loadingText
          }
        >
          Your active service request could not be found.
        </Text>


        <TouchableOpacity
          style={
            styles.retryButton
          }
          onPress={() =>
            loadActiveRequest()
          }
        >

          <Text
            style={
              styles.retryText
            }
          >
            TRY AGAIN
          </Text>

        </TouchableOpacity>

      </View>
    );
  }


  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <View
      style={
        styles.container
      }
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <View
        style={
          styles.header
        }
      >

        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
        >

          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />

        </TouchableOpacity>


        <View
          style={
            styles.headerInfo
          }
        >

          <Text
            style={
              styles.title
            }
          >
            {getHeaderTitle()}
          </Text>


          <Text
            style={
              styles.subtitle
            }
          >
            Track your mechanic
          </Text>

        </View>


        <View
          style={
            styles.liveBadge
          }
        >

          <View
            style={
              styles.liveDot
            }
          />


          <Text
            style={
              styles.liveText
            }
          >
            LIVE
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
            REAL MAP
        ================================================= */}

        <View
          style={
            styles.mapCard
          }
        >

          {hasDriverLocation ? (

            <RealLocationMap

              location={{
                latitude:
                  driverLatitude,

                longitude:
                  driverLongitude,
              }}


              locationAddress={
                locationAddress
              }


              mechanicLocation={
                hasMechanicLocation
                  ? {
                      latitude:
                        mechanicLatitude,

                      longitude:
                        mechanicLongitude,
                    }
                  : null
              }


              mechanicName={
                mechanicName
              }


              mapRef={
                mapRef
              }

            />

          ) : (

            <View
              style={
                styles.mapUnavailable
              }
            >

              <Ionicons
                name="location-outline"
                size={34}
                color={colors.textMuted}
              />


              <Text
                style={
                  styles.mapUnavailableTitle
                }
              >
                Location unavailable
              </Text>


              <Text
                style={
                  styles.mapUnavailableText
                }
              >
                Waiting for your location.
              </Text>

            </View>

          )}


          {/* MAP LEGEND */}

          <View
            style={
              styles.mapBottom
            }
          >

            <View
              style={
                styles.mapLegend
              }
            >

              <View
                style={
                  styles.legendDotDriver
                }
              />


              <Text
                style={
                  styles.legendText
                }
              >
                You
              </Text>


              <View
                style={
                  styles.legendDotMechanic
                }
              />


              <Text
                style={
                  styles.legendText
                }
              >
                Mechanic
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            DISTANCE / STATUS
        ================================================= */}

        <View
          style={
            styles.etaCard
          }
        >

          <View
            style={
              styles.etaMain
            }
          >

            <Text
              style={
                styles.etaLabel
              }
            >
              MECHANIC STATUS
            </Text>


            <Text
              style={
                styles.eta
              }
            >
              {getEtaText()}
            </Text>

          </View>


          <View
            style={
              styles.dividerVertical
            }
          />


          <View
            style={
              styles.etaSide
            }
          >

            <Ionicons
              name="navigate-outline"
              size={20}
              color={colors.accent}
            />


            <Text
              style={
                styles.distance
              }
            >
              {distanceText}
            </Text>


            <Text
              style={
                styles.distanceLabel
              }
            >
              away
            </Text>

          </View>

        </View>


        {/* =================================================
            YOUR MECHANIC
        ================================================= */}

        <Text
          style={
            styles.sectionLabel
          }
        >
          YOUR MECHANIC
        </Text>


        <View
          style={
            styles.mechanicCard
          }
        >

          <View
            style={
              styles.avatar
            }
          >

            <Ionicons
              name="person"
              size={29}
              color={colors.accent}
            />

          </View>


          <View
            style={
              styles.mechanicInfo
            }
          >

            <Text
              style={
                styles.mechanicName
              }
            >
              {mechanicName}
            </Text>


            <Text
              style={
                styles.mechanicType
              }
              numberOfLines={1}
            >

              {workshopName}

              {vehicleNumber
                ? ` • ${vehicleNumber}`
                : ''}

            </Text>


            <View
              style={
                styles.ratingRow
              }
            >

              <Ionicons
                name="star"
                size={13}
                color={colors.warning}
              />


              <Text
                style={
                  styles.rating
                }
              >
                {mechanicRating.toFixed(
                  1
                )}
              </Text>


              <Text
                style={
                  styles.jobs
                }
              >
                • {mechanicJobs} jobs
              </Text>

            </View>

          </View>


          <TouchableOpacity
            style={
              styles.callButton
            }
            onPress={
              callMechanic
            }
          >

            <Ionicons
              name="call"
              size={18}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            SERVICE STATUS
        ================================================= */}

        <Text
          style={
            styles.sectionLabel
          }
        >
          SERVICE STATUS
        </Text>


        <View
          style={
            styles.statusCard
          }
        >

          <Status
            icon="checkmark"
            title="Request accepted"
            subtitle={
              requestAccepted
                ? 'Mechanic has accepted your request'
                : 'Waiting for mechanic to accept'
            }
            completed={
              requestAccepted
            }
            active={
              false
            }
          />


          <View
            style={
              styles.statusLine
            }
          />


          <Status
            icon="navigate"
            title="Mechanic on the way"
            subtitle={
              mechanicEnRoute
                ? 'Mechanic is heading towards your location'
                : 'Waiting for mechanic to start travelling'
            }
            completed={
              mechanicEnRoute
            }
            active={
              requestStatus ===
              'EN_ROUTE' ||
              requestStatus ===
              'MECHANIC_EN_ROUTE'
            }
          />


          <View
            style={
              styles.statusLine
            }
          />


          <Status
            icon="location"
            title="Mechanic arrived"
            subtitle={
              mechanicArrived
                ? 'Mechanic has arrived at your location'
                : 'Waiting for mechanic to arrive'
            }
            completed={
              mechanicArrived
            }
            active={
              requestStatus ===
              'ARRIVED'
            }
          />

        </View>


        {/* =================================================
            SAFETY
        ================================================= */}

        <View
          style={
            styles.safetyCard
          }
        >

          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color={colors.success}
          />


          <Text
            style={
              styles.safetyText
            }
          >
            Stay in a safe location while you wait.
            Keep your hazard lights on if necessary.
          </Text>

        </View>


        {/* =================================================
            REFRESH
        ================================================= */}

        <TouchableOpacity
          style={
            styles.refreshButton
          }
          onPress={() =>
            loadActiveRequest(true)
          }
          disabled={refreshing}
        >

          <Ionicons
            name="refresh-outline"
            size={17}
            color={colors.accent}
          />


          <Text
            style={
              styles.refreshText
            }
          >
            {refreshing
              ? 'REFRESHING...'
              : 'REFRESH LOCATION'}
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


// =========================================================
// STATUS COMPONENT
// =========================================================

function Status({
  icon,
  title,
  subtitle,
  completed,
  active,
}) {

  return (
    <View
      style={
        styles.statusRow
      }
    >

      <View
        style={[
          styles.statusIcon,

          completed &&
            styles.completedIcon,

          active &&
            styles.activeIcon,
        ]}
      >

        <Ionicons
          name={icon}
          size={15}
          color={
            completed ||
            active
              ? colors.white
              : colors.textLight
          }
        />

      </View>


      <View
        style={
          styles.statusInfo
        }
      >

        <Text
          style={[
            styles.statusTitle,

            active &&
              styles.activeStatusTitle,

            completed &&
              styles.completedStatusTitle,
          ]}
        >
          {title}
        </Text>


        <Text
          style={
            styles.statusSubtitle
          }
        >
          {subtitle}
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
    backgroundColor:
      colors.background,
  },


  loadingContainer: {
    flex: 1,
    backgroundColor:
      colors.background,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 30,
  },


  loadingTitle: {
    fontFamily:
      'InterBold',

    fontSize: 16,

    color:
      colors.text,

    marginTop: 14,

    textAlign: 'center',
  },


  loadingText: {
    fontFamily:
      'InterRegular',

    fontSize: 11,

    lineHeight: 17,

    color:
      colors.textMuted,

    marginTop: 6,

    textAlign: 'center',
  },


  retryButton: {
    marginTop: 20,

    height: 46,

    paddingHorizontal: 25,

    borderRadius: 13,

    backgroundColor:
      colors.accent,

    alignItems: 'center',

    justifyContent: 'center',
  },


  retryText: {
    fontFamily:
      'InterBold',

    fontSize: 10,

    color:
      colors.white,
  },


  header: {
    minHeight: 76,

    paddingHorizontal: 20,

    paddingTop: 16,

    paddingBottom: 12,

    backgroundColor:
      colors.white,

    borderBottomWidth: 1,

    borderBottomColor:
      colors.borderLight,

    flexDirection: 'row',

    alignItems: 'center',
  },


  backButton: {
    width: 43,
    height: 43,

    borderRadius: 14,

    backgroundColor:
      colors.background,

    borderWidth: 1,

    borderColor:
      colors.border,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,
  },


  headerInfo: {
    flex: 1,
  },


  title: {
    fontFamily:
      'InterBold',

    fontSize: 17,

    color:
      colors.text,
  },


  subtitle: {
    fontFamily:
      'InterRegular',

    fontSize: 10,

    color:
      colors.textMuted,

    marginTop: 3,
  },


  liveBadge: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      colors.successLight,

    borderRadius: 9,

    paddingHorizontal: 8,

    paddingVertical: 6,

    gap: 5,
  },


  liveDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor:
      colors.success,
  },


  liveText: {
    fontFamily:
      'InterBold',

    fontSize: 8,

    color:
      colors.success,
  },


  content: {
    padding: 20,

    paddingBottom: 40,
  },


  // =======================================================
  // MAP
  // =======================================================

  mapCard: {
    height: 280,

    borderRadius: 22,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      colors.border,

    position: 'relative',
  },


  mapBottom: {
    position: 'absolute',

    bottom: 12,

    left: 12,
  },


  mapLegend: {
    backgroundColor:
      colors.white,

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

    backgroundColor:
      colors.accent,
  },


  legendDotMechanic: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor:
      colors.success,

    marginLeft: 6,
  },


  legendText: {
    fontFamily:
      'InterMedium',

    fontSize: 9,

    color:
      colors.textSecondary,
  },


  mapUnavailable: {
    flex: 1,

    backgroundColor:
      colors.mapBackground,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,
  },


  mapUnavailableTitle: {
    fontFamily:
      'InterBold',

    fontSize: 13,

    color:
      colors.text,

    marginTop: 8,
  },


  mapUnavailableText: {
    fontFamily:
      'InterRegular',

    fontSize: 10,

    color:
      colors.textMuted,

    marginTop: 4,

    textAlign: 'center',
  },


  // =======================================================
  // ETA / DISTANCE
  // =======================================================

  etaCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    marginTop: 14,

    borderWidth: 1,

    borderColor:
      colors.borderLight,

    flexDirection: 'row',

    alignItems: 'center',
  },


  etaMain: {
    flex: 1,
  },


  etaLabel: {
    fontFamily:
      'InterBold',

    fontSize: 9,

    letterSpacing: 0.7,

    color:
      colors.textMuted,
  },


  eta: {
    fontFamily:
      'InterExtraBold',

    fontSize: 24,

    color:
      colors.text,

    marginTop: 2,
  },


  dividerVertical: {
    width: 1,

    height: 43,

    backgroundColor:
      colors.border,

    marginHorizontal: 18,
  },


  etaSide: {
    width: 75,

    alignItems: 'center',
  },


  distance: {
    fontFamily:
      'InterBold',

    fontSize: 13,

    color:
      colors.text,

    marginTop: 2,
  },


  distanceLabel: {
    fontFamily:
      'InterRegular',

    fontSize: 9,

    color:
      colors.textMuted,
  },


  // =======================================================
  // SECTION
  // =======================================================

  sectionLabel: {
    fontFamily:
      'InterBold',

    fontSize: 10,

    letterSpacing: 0.8,

    color:
      colors.textMuted,

    marginTop: 22,

    marginBottom: 9,
  },


  // =======================================================
  // MECHANIC
  // =======================================================

  mechanicCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    borderWidth: 1,

    borderColor:
      colors.borderLight,

    padding: 14,

    flexDirection: 'row',

    alignItems: 'center',
  },


  avatar: {
    width: 53,
    height: 53,

    borderRadius: 17,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,
  },


  mechanicInfo: {
    flex: 1,
  },


  mechanicName: {
    fontFamily:
      'InterBold',

    fontSize: 14,

    color:
      colors.text,
  },


  mechanicType: {
    fontFamily:
      'InterRegular',

    fontSize: 9,

    color:
      colors.textMuted,

    marginTop: 3,
  },


  ratingRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 4,

    marginTop: 5,
  },


  rating: {
    fontFamily:
      'InterBold',

    fontSize: 10,

    color:
      colors.text,
  },


  jobs: {
    fontFamily:
      'InterRegular',

    fontSize: 9,

    color:
      colors.textMuted,
  },


  callButton: {
    width: 42,
    height: 42,

    borderRadius: 14,

    backgroundColor:
      colors.accent,

    alignItems: 'center',

    justifyContent: 'center',
  },


  // =======================================================
  // STATUS
  // =======================================================

  statusCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,

    borderColor:
      colors.borderLight,
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

    backgroundColor:
      colors.background,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,
  },


  completedIcon: {
    backgroundColor:
      colors.success,
  },


  activeIcon: {
    backgroundColor:
      colors.accent,
  },


  statusInfo: {
    flex: 1,
  },


  statusTitle: {
    fontFamily:
      'InterSemiBold',

    fontSize: 12,

    color:
      colors.textLight,
  },


  activeStatusTitle: {
    color:
      colors.accent,
  },


  completedStatusTitle: {
    color:
      colors.text,
  },


  statusSubtitle: {
    fontFamily:
      'InterRegular',

    fontSize: 9,

    color:
      colors.textMuted,

    marginTop: 2,
  },


  statusLine: {
    width: 1,

    height: 11,

    backgroundColor:
      colors.border,

    marginLeft: 17,
  },


  // =======================================================
  // SAFETY
  // =======================================================

  safetyCard: {
    marginTop: 18,

    backgroundColor:
      colors.successLight,

    borderRadius: 15,

    padding: 13,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 9,
  },


  safetyText: {
    flex: 1,

    fontFamily:
      'InterRegular',

    fontSize: 10,

    lineHeight: 15,

    color:
      colors.textSecondary,
  },


  // =======================================================
  // REFRESH
  // =======================================================

  refreshButton: {
    marginTop: 15,

    height: 44,

    borderRadius: 13,

    borderWidth: 1,

    borderColor:
      colors.accent,

    backgroundColor:
      colors.white,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 7,
  },


  refreshText: {
    fontFamily:
      'InterBold',

    fontSize: 10,

    color:
      colors.accent,
  },

});