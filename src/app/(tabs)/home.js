import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useCallback,
  useState,
} from 'react';

import { Ionicons } from '@expo/vector-icons';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

import colors from '../../constants/colors';

import {
  getMyServiceRequests,
} from '../../services/requestService';

import {
  getMyDriverProfile,
} from '../../services/driverService';

import {
  apiRequest,
} from '../../services/api';


// =========================================================
// VEHICLE API
// =========================================================

async function getMyVehicles() {
  return apiRequest(
    '/api/v1/vehicles/my',
    {
      method: 'GET',
    }
  );
}


// =========================================================
// GREETING
// =========================================================

function getGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
}


// =========================================================
// VEHICLE NAME
// =========================================================

function getVehicleName(vehicle) {
  if (!vehicle) {
    return '';
  }

  const manufacturer =
    vehicle?.manufacturer || '';

  const model =
    vehicle?.model || '';

  const name =
    `${manufacturer} ${model}`.trim();

  if (name) {
    return name;
  }

  return (
    vehicle?.vehicleType ||
    'My Vehicle'
  );
}


// =========================================================
// STATUS LABEL
// =========================================================

function getRequestStatusLabel(status) {
  switch (status) {

    case 'CREATED':
      return 'Request Created';

    case 'SEARCHING':
      return 'Finding Mechanic';

    case 'ASSIGNED':
      return 'Mechanic Assigned';

    case 'MECHANIC_EN_ROUTE':
      return 'Mechanic On The Way';

    case 'ARRIVED':
      return 'Mechanic Arrived';

    case 'IN_PROGRESS':
      return 'Service In Progress';

    case 'PAYMENT_PENDING':
      return 'Payment Pending';

    case 'COMPLETED':
      return 'Completed';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status || 'Unknown';
  }
}


// =========================================================
// CATEGORY ICON
// =========================================================

function getCategoryIcon(category) {
  switch (category) {

    case 'TYRE':
      return 'speedometer-outline';

    case 'BATTERY':
      return 'battery-half-outline';

    case 'FUEL':
      return 'flame-outline';

    case 'BREAKDOWN':
      return 'construct-outline';

    case 'ELECTRICAL':
      return 'flash-outline';

    case 'TOWING':
      return 'car-outline';

    default:
      return 'construct-outline';
  }
}


// =========================================================
// CATEGORY TITLE
// =========================================================

function getCategoryTitle(category) {
  switch (category) {

    case 'TYRE':
      return 'Tyre Assistance';

    case 'BATTERY':
      return 'Battery Assistance';

    case 'FUEL':
      return 'Fuel Assistance';

    case 'BREAKDOWN':
      return 'Breakdown Assistance';

    case 'ELECTRICAL':
      return 'Electrical Assistance';

    case 'TOWING':
      return 'Towing Assistance';

    case 'OTHER':
      return 'Other Assistance';

    default:
      return category || 'Service Request';
  }
}


// =========================================================
// DATE FORMATTER
// =========================================================

function formatRequestDate(dateValue) {

  if (!dateValue) {
    return '';
  }

  try {

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  } catch (error) {

    return '';
  }
}


// =========================================================
// HOME SCREEN
// =========================================================

export default function HomeScreen() {

  const router =
    useRouter();


  // =======================================================
  // DRIVER PROFILE STATE
  // =======================================================

  const [
    driverProfile,
    setDriverProfile,
  ] = useState(null);

  const [
    loadingDriver,
    setLoadingDriver,
  ] = useState(true);


  // =======================================================
  // PRIMARY VEHICLE STATE
  // =======================================================

  const [
    primaryVehicle,
    setPrimaryVehicle,
  ] = useState(null);

  const [
    loadingVehicle,
    setLoadingVehicle,
  ] = useState(true);


  // =======================================================
  // SERVICE REQUEST STATE
  // =======================================================

  const [
    recentRequest,
    setRecentRequest,
  ] = useState(null);

  const [
    loadingRequests,
    setLoadingRequests,
  ] = useState(false);

  const [
    requestError,
    setRequestError,
  ] = useState(null);


  // =======================================================
  // BREAKDOWN TYPES
  // =======================================================

  const breakdownTypes = [

    {
      title: 'Tyre',
      category: 'TYRE',
      icon: 'speedometer-outline',
    },

    {
      title: 'Battery',
      category: 'BATTERY',
      icon: 'battery-half-outline',
    },

    {
      title: 'Fuel',
      category: 'FUEL',
      icon: 'flame-outline',
    },

    {
      title: 'Mechanical',
      category: 'BREAKDOWN',
      icon: 'construct-outline',
    },

    {
      title: 'Electrical',
      category: 'ELECTRICAL',
      icon: 'flash-outline',
    },

    {
      title: 'Towing',
      category: 'TOWING',
      icon: 'car-outline',
    },

  ];


  // =======================================================
  // LOAD DRIVER PROFILE
  // =======================================================

  const loadDriverProfile =
    useCallback(
      async () => {

        try {

          setLoadingDriver(true);

          const response =
            await getMyDriverProfile();

          console.log(
            '[Truck Assist] Driver profile:',
            response
          );

          setDriverProfile(
            response || null
          );

        } catch (error) {

          console.error(
            'Unable to load driver profile:',
            error
          );

          setDriverProfile(
            null
          );

        } finally {

          setLoadingDriver(false);
        }

      },
      []
    );


  // =======================================================
  // LOAD PRIMARY VEHICLE
  // =======================================================

  const loadPrimaryVehicle =
    useCallback(
      async () => {

        try {

          setLoadingVehicle(true);

          const response =
            await getMyVehicles();

          console.log(
            '[Truck Assist] My vehicles:',
            response
          );

          const vehicles =
            Array.isArray(response)
              ? response
              : [];


          // -------------------------------------------------
          // Find explicitly selected primary vehicle
          // -------------------------------------------------

          const primary =
            vehicles.find(
              (vehicle) =>
                vehicle?.primary === true &&
                String(
                  vehicle?.status || ''
                ).toUpperCase() !==
                  'DELETED'
            );


          // -------------------------------------------------
          // Fallback to first ACTIVE vehicle
          // -------------------------------------------------

          const activeVehicle =
            vehicles.find(
              (vehicle) =>
                String(
                  vehicle?.status || ''
                ).toUpperCase() ===
                  'ACTIVE'
            );


          const selectedVehicle =
            primary ||
            activeVehicle ||
            null;


          console.log(
            '[Truck Assist] Selected primary vehicle:',
            selectedVehicle
          );


          setPrimaryVehicle(
            selectedVehicle
          );

        } catch (error) {

          console.error(
            'Unable to load primary vehicle:',
            error
          );

          setPrimaryVehicle(
            null
          );

        } finally {

          setLoadingVehicle(false);
        }

      },
      []
    );


  // =======================================================
  // LOAD RECENT REQUEST
  // =======================================================

  const loadRecentRequest =
    useCallback(
      async () => {

        try {

          setLoadingRequests(true);

          setRequestError(null);


          const requests =
            await getMyServiceRequests();


          console.log(
            '[Truck Assist] Driver service requests:',
            requests
          );


          if (
            Array.isArray(requests) &&
            requests.length > 0
          ) {

            setRecentRequest(
              requests[0]
            );

          } else {

            setRecentRequest(
              null
            );
          }

        } catch (error) {

          console.error(
            'Unable to load recent service:',
            error
          );

          setRequestError(
            error?.message ||
            'Unable to load service requests'
          );

        } finally {

          setLoadingRequests(false);
        }

      },
      []
    );


  // =======================================================
  // LOAD WHEN HOME SCREEN GETS FOCUS
  // =======================================================

  useFocusEffect(
    useCallback(
      () => {

        loadDriverProfile();

        loadPrimaryVehicle();

        loadRecentRequest();

      },
      [
        loadDriverProfile,
        loadPrimaryVehicle,
        loadRecentRequest,
      ]
    )
  );


  // =======================================================
  // OPEN RECENT REQUEST
  // =======================================================

  const openRecentRequest = () => {

    if (!recentRequest?.id) {
      return;
    }

    router.push(
      `/requests/${recentRequest.id}`
    );
  };


  // =======================================================
  // DRIVER NAME
  // =======================================================

  const driverName =
    driverProfile?.name ||
    'Driver';


  // =======================================================
  // GREETING
  // =======================================================

  const greeting =
    getGreeting();


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <View style={styles.header}>

          <View>

            <Text
              style={styles.greeting}
            >
              {greeting} 👋
            </Text>


            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {loadingDriver
                ? 'Driver'
                : driverName}
            </Text>

          </View>


          <TouchableOpacity
            style={
              styles.notificationButton
            }
            activeOpacity={0.8}
          >

            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />

            <View
              style={
                styles.notificationDot
              }
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            PRIMARY VEHICLE
            ================================================= */}

        <TouchableOpacity
          style={styles.vehicleCard}
          activeOpacity={0.85}
        >

          <View
            style={styles.vehicleIcon}
          >

            <Ionicons
              name="car-sport"
              size={28}
              color={colors.accent}
            />

          </View>


          <View
            style={styles.vehicleInfo}
          >

            <Text
              style={styles.vehicleLabel}
            >
              PRIMARY VEHICLE
            </Text>


            {loadingVehicle ? (

              <View
                style={
                  styles.vehicleLoading
                }
              >

                <ActivityIndicator
                  size="small"
                  color={colors.accent}
                />

              </View>

            ) : primaryVehicle ? (

              <>

                <Text
                  style={
                    styles.vehicleNumber
                  }
                  numberOfLines={1}
                >
                  {
                    primaryVehicle
                      ?.registrationNumber ||
                    'Registration unavailable'
                  }
                </Text>


                <Text
                  style={
                    styles.vehicleName
                  }
                  numberOfLines={1}
                >
                  {getVehicleName(
                    primaryVehicle
                  )}
                </Text>

              </>

            ) : (

              <>

                <Text
                  style={
                    styles.vehicleNumber
                  }
                >
                  No vehicle added
                </Text>


                <Text
                  style={
                    styles.vehicleName
                  }
                >
                  Add your vehicle
                </Text>

              </>

            )}

          </View>


          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textMuted}
          />

        </TouchableOpacity>


        {/* =================================================
            ASSISTANCE CARD
            ================================================= */}

        <View
          style={styles.assistanceCard}
        >

          <View
            style={
              styles.assistanceIconContainer
            }
          >

            <Ionicons
              name="construct"
              size={34}
              color={colors.white}
            />

          </View>


          <Text
            style={styles.assistanceTitle}
          >
            Vehicle breakdown?
          </Text>


          <Text
            style={
              styles.assistanceDescription
            }
          >
            Get roadside assistance from a nearby
            mechanic.
          </Text>


          <TouchableOpacity
            style={styles.requestButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                '/breakdown/category'
              )
            }
          >

            <Text
              style={
                styles.requestButtonText
              }
            >
              REQUEST ASSISTANCE
            </Text>


            <Ionicons
              name="arrow-forward"
              size={19}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            QUICK ASSISTANCE HEADER
            ================================================= */}

        <View
          style={styles.sectionHeader}
        >

          <View>

            <Text
              style={styles.sectionTitle}
            >
              Quick Assistance
            </Text>


            <Text
              style={styles.sectionSubtitle}
            >
              Select your problem
            </Text>

          </View>

        </View>


        {/* =================================================
            QUICK ASSISTANCE GRID
            ================================================= */}

        <View style={styles.grid}>

          {breakdownTypes.map(
            (item) => (

              <TouchableOpacity
                key={item.title}
                style={
                  styles.breakdownItem
                }
                activeOpacity={0.85}
                onPress={() =>
                  router.push(
                    '/breakdown/category'
                  )
                }
              >

                <View
                  style={
                    styles.breakdownIcon
                  }
                >

                  <Ionicons
                    name={item.icon}
                    size={23}
                    color={colors.accent}
                  />

                </View>


                <Text
                  style={
                    styles.breakdownText
                  }
                >
                  {item.title}
                </Text>

              </TouchableOpacity>

            )
          )}

        </View>


        {/* =================================================
            RECENT SERVICE HEADER
            ================================================= */}

        <View
          style={styles.sectionHeader}
        >

          <Text
            style={styles.sectionTitle}
          >
            Recent Service
          </Text>


          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              router.push(
                '/(tabs)/requests'
              )
            }
          >

            <Text
              style={styles.viewAll}
            >
              View all
            </Text>

          </TouchableOpacity>

        </View>


        {/* =================================================
            RECENT SERVICE
            ================================================= */}

        {loadingRequests ? (

          <View
            style={
              styles.emptyHistoryCard
            }
          >

            <ActivityIndicator
              size="small"
              color={colors.accent}
            />


            <Text
              style={
                styles.emptyHistoryText
              }
            >
              Loading recent service...
            </Text>

          </View>

        ) : requestError ? (

          <TouchableOpacity
            style={
              styles.emptyHistoryCard
            }
            activeOpacity={0.8}
            onPress={
              loadRecentRequest
            }
          >

            <View
              style={
                styles.emptyHistoryIcon
              }
            >

              <Ionicons
                name="refresh-outline"
                size={23}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.historyInfo}
            >

              <Text
                style={
                  styles.historyTitle
                }
              >
                Unable to load service
              </Text>


              <Text
                style={
                  styles.historyId
                }
                numberOfLines={2}
              >
                Tap to try again
              </Text>

            </View>

          </TouchableOpacity>

        ) : recentRequest ? (

          <TouchableOpacity
            style={styles.historyCard}
            activeOpacity={0.85}
            onPress={
              openRecentRequest
            }
          >

            <View
              style={styles.historyIcon}
            >

              <Ionicons
                name={
                  getCategoryIcon(
                    recentRequest.category
                  )
                }
                size={23}
                color={colors.info}
              />

            </View>


            <View
              style={styles.historyInfo}
            >

              <Text
                style={
                  styles.historyTitle
                }
                numberOfLines={1}
              >
                {
                  getCategoryTitle(
                    recentRequest.category
                  )
                }
              </Text>


              <Text
                style={
                  styles.historyId
                }
                numberOfLines={1}
              >
                #{String(
                  recentRequest.id || ''
                ).slice(0, 8)}

                {recentRequest.createdAt
                  ? ` • ${formatRequestDate(
                      recentRequest.createdAt
                    )}`
                  : ''}
              </Text>

            </View>


            <View
              style={
                styles.statusBadge
              }
            >

              <Text
                style={
                  styles.statusText
                }
              >
                {
                  getRequestStatusLabel(
                    recentRequest.status
                  )
                }
              </Text>

            </View>


            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
              style={
                styles.historyChevron
              }
            />

          </TouchableOpacity>

        ) : (

          <TouchableOpacity
            style={
              styles.emptyHistoryCard
            }
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                '/(tabs)/requests'
              )
            }
          >

            <View
              style={
                styles.emptyHistoryIcon
              }
            >

              <Ionicons
                name="document-text-outline"
                size={23}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.historyInfo}
            >

              <Text
                style={
                  styles.historyTitle
                }
              >
                No service requests yet
              </Text>


              <Text
                style={
                  styles.historyId
                }
              >
                Your recent assistance requests
                will appear here.
              </Text>

            </View>


            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />

          </TouchableOpacity>

        )}


        {/* =================================================
            BOTTOM SPACE
            ================================================= */}

        <View
          style={styles.bottomSpace}
        />

      </ScrollView>

    </View>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  // =======================================================
  // CONTAINER
  // =======================================================

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,

    // Space for Expo Router bottom tabs
    paddingBottom: 90,
  },


  // =======================================================
  // HEADER
  // =======================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  greeting: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  name: {
    fontFamily: 'InterBold',
    fontSize: 23,
    color: colors.text,
    letterSpacing: -0.3,
    maxWidth: 280,
  },


  // =======================================================
  // NOTIFICATION
  // =======================================================

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 15,

    backgroundColor:
      colors.white,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.border,
  },

  notificationDot: {
    position: 'absolute',

    top: 10,
    right: 11,

    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor:
      colors.danger,

    borderWidth: 1.5,
    borderColor:
      colors.white,
  },


  // =======================================================
  // VEHICLE CARD
  // =======================================================

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,
    borderColor:
      colors.border,

    marginBottom: 18,
  },

  vehicleIcon: {
    width: 52,
    height: 52,

    borderRadius: 16,

    backgroundColor:
      '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  vehicleInfo: {
    flex: 1,
    minWidth: 0,
  },

  vehicleLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,

    color:
      colors.textMuted,

    letterSpacing: 0.8,

    marginBottom: 3,
  },

  vehicleNumber: {
    fontFamily: 'InterBold',
    fontSize: 17,

    color:
      colors.text,

    letterSpacing: -0.2,
  },

  vehicleName: {
    fontFamily: 'InterRegular',
    fontSize: 13,

    color:
      colors.textSecondary,

    marginTop: 2,
  },

  vehicleLoading: {
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },


  // =======================================================
  // ASSISTANCE CARD
  // =======================================================

  assistanceCard: {
    backgroundColor:
      colors.primary,

    borderRadius: 24,

    padding: 22,

    marginBottom: 26,

    overflow: 'hidden',
  },

  assistanceIconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor:
      colors.accent,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 17,
  },

  assistanceTitle: {
    fontFamily: 'InterBold',

    color:
      colors.white,

    fontSize: 24,

    letterSpacing: -0.4,
  },

  assistanceDescription: {
    fontFamily: 'InterRegular',

    color: '#CBD5E1',

    fontSize: 14,

    lineHeight: 21,

    marginTop: 7,

    maxWidth: 290,
  },


  // =======================================================
  // REQUEST BUTTON
  // =======================================================

  requestButton: {
    height: 52,

    borderRadius: 15,

    backgroundColor:
      colors.accent,

    marginTop: 20,

    paddingHorizontal: 18,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    gap: 10,
  },

  requestButtonText: {
    fontFamily: 'InterBold',

    color:
      colors.white,

    fontSize: 13,

    letterSpacing: 0.4,
  },


  // =======================================================
  // SECTION HEADER
  // =======================================================

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    justifyContent: 'space-between',

    marginBottom: 13,
  },

  sectionTitle: {
    fontFamily: 'InterBold',

    fontSize: 18,

    color:
      colors.text,

    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    marginTop: 3,
  },

  viewAll: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color:
      colors.accent,
  },


  // =======================================================
  // QUICK ASSISTANCE GRID
  // =======================================================

  grid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 27,
  },

  breakdownItem: {
    width: '31.5%',

    backgroundColor:
      colors.white,

    borderRadius: 17,

    paddingVertical: 15,

    alignItems: 'center',

    borderWidth: 1,
    borderColor:
      colors.border,

    marginBottom: 10,
  },

  breakdownIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    backgroundColor:
      '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 8,
  },

  breakdownText: {
    fontFamily: 'InterBold',

    fontSize: 12,

    color:
      colors.text,
  },


  // =======================================================
  // RECENT SERVICE
  // =======================================================

  historyCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 15,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,
    borderColor:
      colors.border,
  },

  historyIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor:
      colors.infoLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  historyInfo: {
    flex: 1,
    minWidth: 0,
  },

  historyTitle: {
    fontFamily: 'InterBold',

    fontSize: 14,

    color:
      colors.text,
  },

  historyId: {
    fontFamily: 'InterRegular',

    fontSize: 11,

    color:
      colors.textMuted,

    marginTop: 4,
  },


  // =======================================================
  // STATUS BADGE
  // =======================================================

  statusBadge: {
    backgroundColor:
      colors.successLight,

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,

    maxWidth: 105,
  },

  statusText: {
    fontFamily: 'InterBold',

    color:
      colors.success,

    fontSize: 9,

    textAlign: 'center',
  },

  historyChevron: {
    marginLeft: 8,
  },


  // =======================================================
  // EMPTY / LOADING CARD
  // =======================================================

  emptyHistoryCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 15,

    minHeight: 76,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,
    borderColor:
      colors.border,
  },

  emptyHistoryIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor:
      '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  emptyHistoryText: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    marginLeft: 12,
  },


  // =======================================================
  // BOTTOM SPACE
  // =======================================================

  bottomSpace: {
    height: 20,
  },

});