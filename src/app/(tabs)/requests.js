import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useRouter,
} from 'expo-router';

import {
  getMyServiceRequests,
} from '../../services/requestService';


// =========================================================
// COLORS
// =========================================================

const COLORS = {
  background: '#F8FAFC',

  white: '#FFFFFF',

  primary: '#0F172A',

  text: '#0F172A',

  textSecondary: '#475569',

  textMuted: '#64748B',

  border: '#E2E8F0',

  accent: '#F97316',

  accentLight: '#FFF7ED',

  blue: '#2563EB',

  blueLight: '#EFF6FF',

  green: '#16A34A',

  greenLight: '#F0FDF4',

  yellow: '#CA8A04',

  yellowLight: '#FEFCE8',

  red: '#DC2626',

  redLight: '#FEF2F2',
};


// =========================================================
// STATUS
// =========================================================

function getStatusConfig(status) {

  switch (status) {

    case 'CREATED':
      return {
        label: 'Request Created',
        color: COLORS.blue,
        background: COLORS.blueLight,
        icon: 'document-text-outline',
      };

    case 'SEARCHING':
      return {
        label: 'Finding Mechanic',
        color: COLORS.accent,
        background: COLORS.accentLight,
        icon: 'search-outline',
      };

    case 'ASSIGNED':
      return {
        label: 'Mechanic Assigned',
        color: COLORS.blue,
        background: COLORS.blueLight,
        icon: 'person-outline',
      };

    case 'MECHANIC_EN_ROUTE':
      return {
        label: 'Mechanic On The Way',
        color: COLORS.accent,
        background: COLORS.accentLight,
        icon: 'navigate-outline',
      };

    case 'ARRIVED':
      return {
        label: 'Mechanic Arrived',
        color: COLORS.green,
        background: COLORS.greenLight,
        icon: 'location-outline',
      };

    case 'IN_PROGRESS':
      return {
        label: 'Service In Progress',
        color: COLORS.blue,
        background: COLORS.blueLight,
        icon: 'construct-outline',
      };

    case 'PAYMENT_PENDING':
      return {
        label: 'Payment Pending',
        color: COLORS.yellow,
        background: COLORS.yellowLight,
        icon: 'card-outline',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        color: COLORS.green,
        background: COLORS.greenLight,
        icon: 'checkmark-circle-outline',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        color: COLORS.red,
        background: COLORS.redLight,
        icon: 'close-circle-outline',
      };

    default:
      return {
        label: status || 'Unknown',
        color: COLORS.textMuted,
        background: '#F1F5F9',
        icon: 'help-circle-outline',
      };
  }
}


// =========================================================
// CATEGORY
// =========================================================

function getCategoryConfig(category) {

  switch (category) {

    case 'TYRE':
      return {
        title: 'Tyre Assistance',
        icon: 'speedometer-outline',
      };

    case 'BATTERY':
      return {
        title: 'Battery Assistance',
        icon: 'battery-half-outline',
      };

    case 'FUEL':
      return {
        title: 'Fuel Assistance',
        icon: 'flame-outline',
      };

    case 'BREAKDOWN':
      return {
        title: 'Breakdown Assistance',
        icon: 'construct-outline',
      };

    case 'ELECTRICAL':
      return {
        title: 'Electrical Assistance',
        icon: 'flash-outline',
      };

    case 'TOWING':
      return {
        title: 'Towing Assistance',
        icon: 'car-outline',
      };

    case 'OTHER':
      return {
        title: 'Other Assistance',
        icon: 'ellipsis-horizontal-circle-outline',
      };

    default:
      return {
        title: category || 'Service Request',
        icon: 'construct-outline',
      };
  }
}


// =========================================================
// DATE
// =========================================================

function formatDate(dateValue) {

  if (!dateValue) {
    return 'Date unavailable';
  }

  try {

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Date unavailable';
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

    return 'Date unavailable';
  }
}


// =========================================================
// TIME
// =========================================================

function formatTime(dateValue) {

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

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  } catch (error) {

    return '';
  }
}


// =========================================================
// REQUEST CARD
// =========================================================

function RequestCard({
  request,
  onPress,
}) {

  const category =
    getCategoryConfig(
      request?.category
    );

  const status =
    getStatusConfig(
      request?.status
    );

  const requestId =
    request?.id
      ? String(request.id)
      : '';

  return (

    <TouchableOpacity
      style={styles.requestCard}
      activeOpacity={0.85}
      onPress={onPress}
    >

      {/* =================================================
          TOP ROW
          ================================================= */}

      <View style={styles.cardTopRow}>

        <View
          style={styles.categoryIcon}
        >

          <Ionicons
            name={category.icon}
            size={23}
            color={COLORS.accent}
          />

        </View>


        <View
          style={styles.requestMainInfo}
        >

          <Text
            style={styles.categoryTitle}
            numberOfLines={1}
          >
            {category.title}
          </Text>


          <Text
            style={styles.requestId}
            numberOfLines={1}
          >
            #{requestId.slice(0, 8)}
          </Text>

        </View>


        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status.background,
            },
          ]}
        >

          <Text
            style={[
              styles.statusText,
              {
                color:
                  status.color,
              },
            ]}
          >
            {status.label}
          </Text>

        </View>

      </View>


      {/* =================================================
          DIVIDER
          ================================================= */}

      <View
        style={styles.divider}
      />


      {/* =================================================
          INFORMATION
          ================================================= */}

      <View
        style={styles.infoRow}
      >

        <View
          style={styles.infoItem}
        >

          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textMuted}
          />

          <Text
            style={styles.infoText}
          >
            {formatDate(
              request?.createdAt
            )}
          </Text>

        </View>


        <View
          style={styles.infoItem}
        >

          <Ionicons
            name="time-outline"
            size={16}
            color={COLORS.textMuted}
          />

          <Text
            style={styles.infoText}
          >
            {formatTime(
              request?.createdAt
            )}
          </Text>

        </View>


        <Ionicons
          name="chevron-forward"
          size={19}
          color={COLORS.textMuted}
        />

      </View>

    </TouchableOpacity>
  );
}


// =========================================================
// REQUESTS SCREEN
// =========================================================

export default function RequestsScreen() {

  const router =
    useRouter();

  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // LOAD REQUESTS
  // =======================================================

  const loadRequests =
    useCallback(
      async ({
        refresh = false,
      } = {}) => {

        try {

          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await getMyServiceRequests();

          console.log(
            '[Truck Assist] My requests:',
            response
          );

          if (
            Array.isArray(response)
          ) {

            setRequests(response);

          } else {

            setRequests([]);
          }

        } catch (err) {

          console.error(
            'Unable to load service requests:',
            err
          );

          setError(
            err?.message ||
            'Unable to load your service requests'
          );

        } finally {

          setLoading(false);

          setRefreshing(false);
        }

      },
      []
    );


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadRequests();

  }, [
    loadRequests,
  ]);


  // =======================================================
  // OPEN REQUEST
  // =======================================================

  const openRequest =
    (request) => {

      if (!request?.id) {
        return;
      }

      router.push(
        `/requests/${request.id}`
      );
    };


  // =======================================================
  // HEADER
  // =======================================================

  const renderHeader = () => (

    <View style={styles.header}>

      <View>

        <Text
          style={styles.headerTitle}
        >
          My Requests
        </Text>

        <Text
          style={styles.headerSubtitle}
        >
          Track your roadside assistance
        </Text>

      </View>


      <View
        style={styles.countBadge}
      >

        <Text
          style={styles.countText}
        >
          {requests.length}
        </Text>

      </View>

    </View>
  );


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <View
        style={styles.container}
      >

        {renderHeader()}

        <View
          style={styles.loadingContainer}
        >

          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />

          <Text
            style={styles.loadingText}
          >
            Loading your requests...
          </Text>

        </View>

      </View>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {

    return (

      <View
        style={styles.container}
      >

        {renderHeader()}

        <View
          style={styles.errorContainer}
        >

          <View
            style={styles.errorIcon}
          >

            <Ionicons
              name="cloud-offline-outline"
              size={30}
              color={COLORS.red}
            />

          </View>


          <Text
            style={styles.errorTitle}
          >
            Unable to load requests
          </Text>


          <Text
            style={styles.errorMessage}
          >
            {error}
          </Text>


          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.85}
            onPress={() =>
              loadRequests()
            }
          >

            <Ionicons
              name="refresh-outline"
              size={18}
              color={COLORS.white}
            />

            <Text
              style={styles.retryText}
            >
              Try Again
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    );
  }


  // =======================================================
  // EMPTY
  // =======================================================

  if (
    requests.length === 0
  ) {

    return (

      <View
        style={styles.container}
      >

        {renderHeader()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                loadRequests({
                  refresh: true,
                })
              }
              tintColor={
                COLORS.accent
              }
            />
          }
        >

          <View
            style={styles.emptyContainer}
          >

            <View
              style={styles.emptyIcon}
            >

              <Ionicons
                name="document-text-outline"
                size={42}
                color={COLORS.accent}
              />

            </View>


            <Text
              style={styles.emptyTitle}
            >
              No requests yet
            </Text>


            <Text
              style={styles.emptyDescription}
            >
              Your roadside assistance requests
              will appear here once you create one.
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

              <Ionicons
                name="construct-outline"
                size={19}
                color={COLORS.white}
              />

              <Text
                style={styles.requestButtonText}
              >
                REQUEST ASSISTANCE
              </Text>

            </TouchableOpacity>

          </View>

        </ScrollView>

      </View>
    );
  }


  // =======================================================
  // REQUEST LIST
  // =======================================================

  return (

    <View
      style={styles.container}
    >

      {renderHeader()}


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadRequests({
                refresh: true,
              })
            }
            tintColor={
              COLORS.accent
            }
          />
        }
      >

        <View
          style={styles.summaryCard}
        >

          <View
            style={styles.summaryIcon}
          >

            <Ionicons
              name="time-outline"
              size={21}
              color={COLORS.accent}
            />

          </View>


          <View
            style={styles.summaryInfo}
          >

            <Text
              style={styles.summaryTitle}
            >
              Service History
            </Text>

            <Text
              style={styles.summaryText}
            >
              {requests.length === 1
                ? '1 service request'
                : `${requests.length} service requests`}
            </Text>

          </View>

        </View>


        {requests.map(
          (request) => (

            <RequestCard
              key={
                request.id
              }
              request={
                request
              }
              onPress={() =>
                openRequest(
                  request
                )
              }
            />

          )
        )}


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

  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,

    paddingHorizontal: 20,

    paddingTop: 20,
  },


  // =======================================================
  // HEADER
  // =======================================================

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    marginBottom: 22,
  },

  headerTitle: {
    fontSize: 24,

    fontWeight: '800',

    color:
      COLORS.text,

    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 5,

    fontSize: 13,

    color:
      COLORS.textMuted,
  },

  countBadge: {
    minWidth: 38,

    height: 38,

    paddingHorizontal: 10,

    borderRadius: 13,

    backgroundColor:
      COLORS.accentLight,

    justifyContent: 'center',

    alignItems: 'center',
  },

  countText: {
    fontSize: 14,

    fontWeight: '800',

    color:
      COLORS.accent,
  },


  // =======================================================
  // LIST
  // =======================================================

  listContent: {
    paddingBottom: 100,
  },


  // =======================================================
  // SUMMARY
  // =======================================================

  summaryCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 18,

    padding: 15,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      COLORS.border,

    marginBottom: 14,
  },

  summaryIcon: {
    width: 44,

    height: 44,

    borderRadius: 14,

    backgroundColor:
      COLORS.accentLight,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 14,

    fontWeight: '800',

    color:
      COLORS.text,
  },

  summaryText: {
    marginTop: 3,

    fontSize: 12,

    color:
      COLORS.textMuted,
  },


  // =======================================================
  // REQUEST CARD
  // =======================================================

  requestCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 19,

    padding: 16,

    marginBottom: 12,

    borderWidth: 1,

    borderColor:
      COLORS.border,
  },

  cardTopRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  categoryIcon: {
    width: 48,

    height: 48,

    borderRadius: 15,

    backgroundColor:
      COLORS.accentLight,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,
  },

  requestMainInfo: {
    flex: 1,

    minWidth: 0,

    marginRight: 8,
  },

  categoryTitle: {
    fontSize: 15,

    fontWeight: '800',

    color:
      COLORS.text,
  },

  requestId: {
    marginTop: 4,

    fontSize: 11,

    color:
      COLORS.textMuted,
  },


  // =======================================================
  // STATUS
  // =======================================================

  statusBadge: {
    borderRadius: 9,

    paddingHorizontal: 9,

    paddingVertical: 7,

    maxWidth: 120,
  },

  statusText: {
    fontSize: 9,

    fontWeight: '800',

    textAlign: 'center',
  },


  // =======================================================
  // DIVIDER
  // =======================================================

  divider: {
    height: 1,

    backgroundColor:
      COLORS.border,

    marginVertical: 14,
  },


  // =======================================================
  // INFO
  // =======================================================

  infoRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  infoItem: {
    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 18,
  },

  infoText: {
    marginLeft: 6,

    fontSize: 11,

    color:
      COLORS.textSecondary,
  },


  // =======================================================
  // LOADING
  // =======================================================

  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingBottom: 100,
  },

  loadingText: {
    marginTop: 12,

    fontSize: 13,

    color:
      COLORS.textMuted,
  },


  // =======================================================
  // ERROR
  // =======================================================

  errorContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 25,

    paddingBottom: 100,
  },

  errorIcon: {
    width: 68,

    height: 68,

    borderRadius: 22,

    backgroundColor:
      COLORS.redLight,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 18,

    fontWeight: '800',

    color:
      COLORS.text,

    textAlign: 'center',
  },

  errorMessage: {
    marginTop: 8,

    fontSize: 13,

    color:
      COLORS.textMuted,

    textAlign: 'center',

    lineHeight: 20,
  },

  retryButton: {
    marginTop: 20,

    height: 46,

    paddingHorizontal: 20,

    borderRadius: 13,

    backgroundColor:
      COLORS.primary,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,
  },

  retryText: {
    fontSize: 13,

    fontWeight: '800',

    color:
      COLORS.white,
  },


  // =======================================================
  // EMPTY
  // =======================================================

  emptyContainer: {
    flex: 1,

    minHeight: 550,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 88,

    height: 88,

    borderRadius: 28,

    backgroundColor:
      COLORS.accentLight,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 21,

    fontWeight: '800',

    color:
      COLORS.text,

    textAlign: 'center',
  },

  emptyDescription: {
    marginTop: 8,

    fontSize: 13,

    color:
      COLORS.textMuted,

    lineHeight: 20,

    textAlign: 'center',

    maxWidth: 300,
  },

  requestButton: {
    marginTop: 24,

    height: 50,

    paddingHorizontal: 20,

    borderRadius: 14,

    backgroundColor:
      COLORS.accent,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 9,
  },

  requestButtonText: {
    fontSize: 12,

    fontWeight: '800',

    color:
      COLORS.white,

    letterSpacing: 0.3,
  },


  // =======================================================
  // BOTTOM
  // =======================================================

  bottomSpace: {
    height: 30,
  },

});