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

import { Ionicons } from '@expo/vector-icons';

import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import colors from '../../constants/colors';

import {
    cancelServiceRequest,
    getServiceRequestById,
    getServiceRequestHistory,
} from '../../services/requestService';


// =========================================================
// STATUS CONFIG
// =========================================================

function getStatusConfig(status) {

  switch (status) {

    case 'CREATED':
      return {
        label: 'Request Created',
        icon: 'document-text-outline',
        color: colors.info,
        background: colors.infoLight,
      };

    case 'SEARCHING':
      return {
        label: 'Finding Mechanic',
        icon: 'search-outline',
        color: colors.accent,
        background: colors.accentLight,
      };

    case 'ASSIGNED':
      return {
        label: 'Mechanic Assigned',
        icon: 'person-outline',
        color: colors.info,
        background: colors.infoLight,
      };

    case 'MECHANIC_EN_ROUTE':
      return {
        label: 'Mechanic On The Way',
        icon: 'navigate-outline',
        color: colors.accent,
        background: colors.accentLight,
      };

    case 'ARRIVED':
      return {
        label: 'Mechanic Arrived',
        icon: 'location-outline',
        color: colors.success,
        background: colors.successLight,
      };

    case 'IN_PROGRESS':
      return {
        label: 'Service In Progress',
        icon: 'construct-outline',
        color: colors.info,
        background: colors.infoLight,
      };

    case 'PAYMENT_PENDING':
      return {
        label: 'Payment Pending',
        icon: 'card-outline',
        color: colors.warning,
        background: colors.warningLight,
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        icon: 'checkmark-circle-outline',
        color: colors.success,
        background: colors.successLight,
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        icon: 'close-circle-outline',
        color: colors.danger,
        background: colors.dangerLight,
      };

    default:
      return {
        label: status || 'Unknown',
        icon: 'help-circle-outline',
        color: colors.textMuted,
        background: colors.background,
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
    return 'Not available';
  }

  try {

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Not available';
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

    return 'Not available';
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
// REQUEST DETAILS SCREEN
// =========================================================

export default function RequestDetailsScreen() {

  const router =
    useRouter();

  const {
    id,
  } = useLocalSearchParams();

  const requestId =
    Array.isArray(id)
      ? id[0]
      : id;


  // =======================================================
  // STATE
  // =======================================================

  const [
    request,
    setRequest,
  ] = useState(null);

  const [
    history,
    setHistory,
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

  const [
    cancelling,
    setCancelling,
  ] = useState(false);


  // =======================================================
  // LOAD REQUEST
  // =======================================================

  const loadRequest =
    useCallback(
      async ({
        refresh = false,
      } = {}) => {

        if (!requestId) {

          setError(
            'Invalid service request'
          );

          setLoading(false);

          return;
        }

        try {

          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);


          const [
            requestResponse,
            historyResponse,
          ] = await Promise.all([

            getServiceRequestById(
              requestId
            ),

            getServiceRequestHistory(
              requestId
            ),

          ]);


          console.log(
            '[Truck Assist] Request:',
            requestResponse
          );

          console.log(
            '[Truck Assist] Request history:',
            historyResponse
          );


          setRequest(
            requestResponse
          );


          setHistory(
            Array.isArray(
              historyResponse
            )
              ? historyResponse
              : []
          );

        } catch (err) {

          console.error(
            'Unable to load request details:',
            err
          );

          setError(
            err?.message ||
            'Unable to load request details'
          );

        } finally {

          setLoading(false);

          setRefreshing(false);
        }

      },
      [
        requestId,
      ]
    );


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadRequest();

  }, [
    loadRequest,
  ]);


  // =======================================================
  // CANCEL REQUEST
  // =======================================================

  const handleCancel =
    async () => {

      if (!requestId) {
        return;
      }

      if (cancelling) {
        return;
      }

      try {

        setCancelling(true);

        await cancelServiceRequest(
          requestId
        );

        await loadRequest({
          refresh: true,
        });

      } catch (err) {

        console.error(
          'Unable to cancel request:',
          err
        );

        setError(
          err?.message ||
          'Unable to cancel request'
        );

      } finally {

        setCancelling(false);
      }
    };


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (

      <View
        style={styles.container}
      >

        <View
          style={styles.topBar}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />

          </TouchableOpacity>


          <Text
            style={styles.topBarTitle}
          >
            Request Details
          </Text>


          <View
            style={styles.topBarSpacer}
          />

        </View>


        <View
          style={styles.loadingContainer}
        >

          <ActivityIndicator
            size="large"
            color={colors.accent}
          />

          <Text
            style={styles.loadingText}
          >
            Loading request...
          </Text>

        </View>

      </View>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error && !request) {

    return (

      <View
        style={styles.container}
      >

        <View
          style={styles.topBar}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />

          </TouchableOpacity>


          <Text
            style={styles.topBarTitle}
          >
            Request Details
          </Text>


          <View
            style={styles.topBarSpacer}
          />

        </View>


        <View
          style={styles.errorContainer}
        >

          <View
            style={styles.errorIcon}
          >

            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={colors.danger}
            />

          </View>


          <Text
            style={styles.errorTitle}
          >
            Unable to load request
          </Text>


          <Text
            style={styles.errorMessage}
          >
            {error}
          </Text>


          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              loadRequest()
            }
          >

            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.white}
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
  // SAFETY
  // =======================================================

  if (!request) {
    return null;
  }


  // =======================================================
  // CONFIG
  // =======================================================

  const category =
    getCategoryConfig(
      request.category
    );

  const status =
    getStatusConfig(
      request.status
    );


  // =======================================================
  // CAN CANCEL
  // =======================================================

  const canCancel =
    ![
      'COMPLETED',
      'CANCELLED',
      'IN_PROGRESS',
      'PAYMENT_PENDING',
    ].includes(
      request.status
    );


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <View
      style={styles.container}
    >

      {/* =================================================
          TOP BAR
          ================================================= */}

      <View
        style={styles.topBar}
      >

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() =>
            router.back()
          }
        >

          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />

        </TouchableOpacity>


        <Text
          style={styles.topBarTitle}
        >
          Request Details
        </Text>


        <View
          style={styles.topBarSpacer}
        />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadRequest({
                refresh: true,
              })
            }
            tintColor={
              colors.accent
            }
          />
        }
      >

        {/* =================================================
            MAIN REQUEST CARD
            ================================================= */}

        <View
          style={styles.heroCard}
        >

          <View
            style={styles.heroTop}
          >

            <View
              style={styles.categoryIcon}
            >

              <Ionicons
                name={category.icon}
                size={29}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.heroInfo}
            >

              <Text
                style={styles.categoryTitle}
              >
                {category.title}
              </Text>


              <Text
                style={styles.requestId}
              >
                #{String(
                  request.id
                ).slice(0, 8)}
              </Text>

            </View>

          </View>


          {/* STATUS */}

          <View
            style={[
              styles.currentStatus,
              {
                backgroundColor:
                  status.background,
              },
            ]}
          >

            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor:
                    status.color,
                },
              ]}
            >

              <Ionicons
                name={status.icon}
                size={18}
                color={colors.white}
              />

            </View>


            <View
              style={styles.statusInfo}
            >

              <Text
                style={styles.statusLabel}
              >
                CURRENT STATUS
              </Text>


              <Text
                style={[
                  styles.statusValue,
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

        </View>


        {/* =================================================
            REQUEST INFORMATION
            ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          Request Information
        </Text>


        <View
          style={styles.infoCard}
        >

          {/* DATE */}

          <View
            style={styles.infoRow}
          >

            <View
              style={styles.infoIcon}
            >

              <Ionicons
                name="calendar-outline"
                size={19}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.infoContent}
            >

              <Text
                style={styles.infoLabel}
              >
                REQUESTED ON
              </Text>


              <Text
                style={styles.infoValue}
              >
                {formatDate(
                  request.createdAt
                )}

                {request.createdAt
                  ? ` • ${formatTime(
                      request.createdAt
                    )}`
                  : ''}
              </Text>

            </View>

          </View>


          <View
            style={styles.rowDivider}
          />


          {/* VEHICLE */}

          <View
            style={styles.infoRow}
          >

            <View
              style={styles.infoIcon}
            >

              <Ionicons
                name="car-outline"
                size={19}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.infoContent}
            >

              <Text
                style={styles.infoLabel}
              >
                VEHICLE
              </Text>


              <Text
                style={styles.infoValue}
              >
                {request.vehicleId
                  ? String(
                      request.vehicleId
                    ).slice(0, 8)
                  : 'Vehicle information unavailable'}
              </Text>

            </View>

          </View>


          <View
            style={styles.rowDivider}
          />


          {/* LOCATION */}

          <View
            style={styles.infoRow}
          >

            <View
              style={styles.infoIcon}
            >

              <Ionicons
                name="location-outline"
                size={19}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.infoContent}
            >

              <Text
                style={styles.infoLabel}
              >
                LOCATION
              </Text>


              <Text
                style={styles.infoValue}
              >
                {request.address ||
                  'Address not available'}
              </Text>

            </View>

          </View>


          {/* COORDINATES */}

          {(
            request.latitude != null &&
            request.longitude != null
          ) && (

            <>

              <View
                style={styles.rowDivider}
              />

              <View
                style={styles.infoRow}
              >

                <View
                  style={styles.infoIcon}
                >

                  <Ionicons
                    name="navigate-outline"
                    size={19}
                    color={colors.accent}
                  />

                </View>


                <View
                  style={styles.infoContent}
                >

                  <Text
                    style={styles.infoLabel}
                  >
                    COORDINATES
                  </Text>


                  <Text
                    style={styles.infoValue}
                  >
                    {request.latitude}
                    {' , '}
                    {request.longitude}
                  </Text>

                </View>

              </View>

            </>

          )}

        </View>


        {/* =================================================
            DESCRIPTION
            ================================================= */}

        {request.description && (

          <>

            <Text
              style={styles.sectionTitle}
            >
              Problem Description
            </Text>


            <View
              style={styles.descriptionCard}
            >

              <View
                style={styles.descriptionIcon}
              >

                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={colors.accent}
                />

              </View>


              <Text
                style={styles.descriptionText}
              >
                {request.description}
              </Text>

            </View>

          </>

        )}


        {/* =================================================
            MECHANIC
            ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          Mechanic
        </Text>


        <View
          style={styles.mechanicCard}
        >

          <View
            style={styles.mechanicIcon}
          >

            <Ionicons
              name="person-outline"
              size={25}
              color={colors.accent}
            />

          </View>


          <View
            style={styles.mechanicInfo}
          >

            <Text
              style={styles.mechanicTitle}
            >
              {request.assignedMechanicId
                ? 'Mechanic Assigned'
                : 'Finding a mechanic'}
            </Text>


            <Text
              style={styles.mechanicSubtitle}
            >
              {request.assignedMechanicId
                ? `ID: ${String(
                    request.assignedMechanicId
                  ).slice(0, 8)}`
                : 'A nearby mechanic will be assigned to your request.'}
            </Text>

          </View>

        </View>


        {/* =================================================
            STATUS TIMELINE
            ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          Status Timeline
        </Text>


        <View
          style={styles.timelineCard}
        >

          {history.length === 0 ? (

            <View
              style={styles.noHistory}
            >

              <Ionicons
                name="time-outline"
                size={22}
                color={colors.textMuted}
              />

              <Text
                style={styles.noHistoryText}
              >
                No status history available.
              </Text>

            </View>

          ) : (

            history.map(
              (item, index) => {

                const itemStatus =
                  getStatusConfig(
                    item.status
                  );

                const isLast =
                  index ===
                  history.length - 1;

                return (

                  <View
                    key={
                      item.id ||
                      `${item.status}-${index}`
                    }
                    style={styles.timelineRow}
                  >

                    {/* TIMELINE */}

                    <View
                      style={styles.timelineLeft}
                    >

                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor:
                              itemStatus.color,
                          },
                        ]}
                      >

                        <Ionicons
                          name={
                            itemStatus.icon
                          }
                          size={12}
                          color={colors.white}
                        />

                      </View>


                      {!isLast && (

                        <View
                          style={[
                            styles.timelineLine,
                            {
                              backgroundColor:
                                colors.border,
                            },
                          ]}
                        />

                      )}

                    </View>


                    {/* CONTENT */}

                    <View
                      style={
                        styles.timelineContent
                      }
                    >

                      <Text
                        style={
                          styles.timelineStatus
                        }
                      >
                        {itemStatus.label}
                      </Text>


                      <Text
                        style={
                          styles.timelineDate
                        }
                      >
                        {formatDate(
                          item.createdAt
                        )}

                        {item.createdAt
                          ? ` • ${formatTime(
                              item.createdAt
                            )}`
                          : ''}
                      </Text>


                      {item.notes && (

                        <Text
                          style={
                            styles.timelineNotes
                          }
                        >
                          {item.notes}
                        </Text>

                      )}

                    </View>

                  </View>

                );
              }
            )

          )}

        </View>


        {/* =================================================
            ERROR AFTER REFRESH / ACTION
            ================================================= */}

        {error && request && (

          <View
            style={styles.inlineError}
          >

            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.danger}
            />

            <Text
              style={styles.inlineErrorText}
            >
              {error}
            </Text>

          </View>

        )}


        {/* =================================================
            CANCEL
            ================================================= */}

        {canCancel && (

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            disabled={cancelling}
            onPress={handleCancel}
          >

            {cancelling ? (

              <ActivityIndicator
                size="small"
                color={colors.danger}
              />

            ) : (

              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.danger}
              />

            )}


            <Text
              style={styles.cancelText}
            >
              {cancelling
                ? 'Cancelling...'
                : 'Cancel Request'}
            </Text>

          </TouchableOpacity>

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
      colors.background,
  },


  // =======================================================
  // TOP BAR
  // =======================================================

  topBar: {
    height: 64,

    paddingHorizontal: 20,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    backgroundColor:
      colors.background,
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor:
      colors.white,

    borderWidth: 1,

    borderColor:
      colors.border,

    justifyContent: 'center',
    alignItems: 'center',
  },

  topBarTitle: {
    fontFamily: 'InterBold',

    fontSize: 17,

    color:
      colors.text,
  },

  topBarSpacer: {
    width: 42,
  },


  // =======================================================
  // CONTENT
  // =======================================================

  content: {
    paddingHorizontal: 20,

    paddingTop: 8,

    paddingBottom: 100,
  },


  // =======================================================
  // HERO
  // =======================================================

  heroCard: {
    backgroundColor:
      colors.white,

    borderRadius: 22,

    padding: 18,

    borderWidth: 1,

    borderColor:
      colors.border,

    marginBottom: 24,
  },

  heroTop: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  categoryIcon: {
    width: 56,
    height: 56,

    borderRadius: 17,

    backgroundColor:
      colors.accentLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  heroInfo: {
    flex: 1,
  },

  categoryTitle: {
    fontFamily: 'InterBold',

    fontSize: 19,

    color:
      colors.text,
  },

  requestId: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    marginTop: 4,
  },


  // =======================================================
  // CURRENT STATUS
  // =======================================================

  currentStatus: {
    flexDirection: 'row',

    alignItems: 'center',

    borderRadius: 15,

    padding: 13,

    marginTop: 18,
  },

  statusIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 11,
  },

  statusInfo: {
    flex: 1,
  },

  statusLabel: {
    fontFamily: 'InterBold',

    fontSize: 9,

    letterSpacing: 0.7,

    color:
      colors.textMuted,

    marginBottom: 3,
  },

  statusValue: {
    fontFamily: 'InterBold',

    fontSize: 14,
  },


  // =======================================================
  // SECTION
  // =======================================================

  sectionTitle: {
    fontFamily: 'InterBold',

    fontSize: 17,

    color:
      colors.text,

    marginBottom: 12,

    marginTop: 3,
  },


  // =======================================================
  // INFO CARD
  // =======================================================

  infoCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    paddingHorizontal: 15,

    borderWidth: 1,

    borderColor:
      colors.border,

    marginBottom: 24,
  },

  infoRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 15,
  },

  infoIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor:
      colors.accentLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontFamily: 'InterBold',

    fontSize: 9,

    letterSpacing: 0.7,

    color:
      colors.textMuted,

    marginBottom: 4,
  },

  infoValue: {
    fontFamily: 'InterMedium',

    fontSize: 13,

    color:
      colors.text,

    lineHeight: 19,
  },

  rowDivider: {
    height: 1,

    backgroundColor:
      colors.border,
  },


  // =======================================================
  // DESCRIPTION
  // =======================================================

  descriptionCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,

    borderColor:
      colors.border,

    flexDirection: 'row',

    marginBottom: 24,
  },

  descriptionIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor:
      colors.accentLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  descriptionText: {
    flex: 1,

    fontFamily: 'InterRegular',

    fontSize: 13,

    lineHeight: 20,

    color:
      colors.textSecondary,
  },


  // =======================================================
  // MECHANIC
  // =======================================================

  mechanicCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,

    borderColor:
      colors.border,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 24,
  },

  mechanicIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor:
      colors.accentLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },

  mechanicInfo: {
    flex: 1,
  },

  mechanicTitle: {
    fontFamily: 'InterBold',

    fontSize: 14,

    color:
      colors.text,
  },

  mechanicSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 11,

    color:
      colors.textMuted,

    marginTop: 4,

    lineHeight: 17,
  },


  // =======================================================
  // TIMELINE
  // =======================================================

  timelineCard: {
    backgroundColor:
      colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,

    borderColor:
      colors.border,

    marginBottom: 20,
  },

  timelineRow: {
    flexDirection: 'row',

    minHeight: 68,
  },

  timelineLeft: {
    width: 35,

    alignItems: 'center',
  },

  timelineDot: {
    width: 27,
    height: 27,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },

  timelineLine: {
    width: 2,

    flex: 1,

    marginVertical: 3,
  },

  timelineContent: {
    flex: 1,

    paddingLeft: 8,

    paddingBottom: 18,
  },

  timelineStatus: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color:
      colors.text,
  },

  timelineDate: {
    fontFamily: 'InterRegular',

    fontSize: 10,

    color:
      colors.textMuted,

    marginTop: 3,
  },

  timelineNotes: {
    fontFamily: 'InterRegular',

    fontSize: 11,

    color:
      colors.textSecondary,

    lineHeight: 17,

    marginTop: 5,
  },

  noHistory: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 12,
  },

  noHistoryText: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    marginLeft: 9,
  },


  // =======================================================
  // CANCEL
  // =======================================================

  cancelButton: {
    height: 50,

    borderRadius: 15,

    borderWidth: 1,

    borderColor:
      colors.danger,

    backgroundColor:
      colors.dangerLight,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    marginTop: 4,
  },

  cancelText: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color:
      colors.danger,
  },


  // =======================================================
  // INLINE ERROR
  // =======================================================

  inlineError: {
    backgroundColor:
      colors.dangerLight,

    borderRadius: 13,

    padding: 12,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 15,
  },

  inlineErrorText: {
    flex: 1,

    fontFamily: 'InterRegular',

    fontSize: 11,

    color:
      colors.danger,

    marginLeft: 8,

    lineHeight: 17,
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
    fontFamily: 'InterRegular',

    fontSize: 13,

    color:
      colors.textMuted,

    marginTop: 12,
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
    width: 70,
    height: 70,

    borderRadius: 23,

    backgroundColor:
      colors.dangerLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 18,
  },

  errorTitle: {
    fontFamily: 'InterBold',

    fontSize: 18,

    color:
      colors.text,

    textAlign: 'center',
  },

  errorMessage: {
    fontFamily: 'InterRegular',

    fontSize: 13,

    color:
      colors.textMuted,

    textAlign: 'center',

    lineHeight: 20,

    marginTop: 8,
  },

  retryButton: {
    height: 46,

    paddingHorizontal: 20,

    borderRadius: 13,

    backgroundColor:
      colors.primary,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    marginTop: 20,
  },

  retryText: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color:
      colors.white,
  },


  // =======================================================
  // BOTTOM
  // =======================================================

  bottomSpace: {
    height: 20,
  },

});