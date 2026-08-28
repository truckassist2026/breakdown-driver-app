import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../constants/colors';

import {
  cancelServiceRequest,
  getServiceRequestById,
  getServiceRequestHistory,
} from '../../services/requestService';

import { apiRequest } from '../../services/api';


// =========================================================
// HELPERS
// =========================================================

function formatDate(value) {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  } catch {
    return '—';
  }
}


function formatTime(value) {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  } catch {
    return '—';
  }
}


function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  const date = formatDate(value);
  const time = formatTime(value);

  return `${date} ${time}`;
}


function getCategoryLabel(category) {
  const map = {
    BREAKDOWN: 'Breakdown',
    TYRE: 'Tyre Issue',
    BATTERY: 'Battery Issue',
    FUEL: 'Fuel Issue',
    OTHER: 'Other',
  };

  return map[category] || category || 'Service Request';
}


function getCategoryIcon(category) {
  const map = {
    BREAKDOWN: 'warning-outline',
    TYRE: 'disc-outline',
    BATTERY: 'battery-half-outline',
    FUEL: 'water-outline',
    OTHER: 'construct-outline',
  };

  return map[category] || 'construct-outline';
}


function getStatusLabel(status) {
  const map = {
    CREATED: 'Created',
    SEARCHING: 'Searching',
    ASSIGNED: 'Mechanic Assigned',
    EN_ROUTE: 'Mechanic On The Way',
    ARRIVED: 'Mechanic Arrived',
    IN_PROGRESS: 'Service In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return map[status] || status || 'Unknown';
}


function getStatusIcon(status) {
  const map = {
    CREATED: 'add-circle-outline',
    SEARCHING: 'search-outline',
    ASSIGNED: 'person-outline',
    EN_ROUTE: 'navigate-outline',
    ARRIVED: 'location-outline',
    IN_PROGRESS: 'construct-outline',
    COMPLETED: 'checkmark-circle-outline',
    CANCELLED: 'close-circle-outline',
  };

  return map[status] || 'ellipse-outline';
}


function isTerminalStatus(status) {
  return (
    status === 'COMPLETED' ||
    status === 'CANCELLED'
  );
}


// =========================================================
// SMALL COMPONENTS
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
          size={18}
          color={colors.accent}
        />
      </View>

      <View style={styles.infoTextContainer}>

        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value || '—'}
        </Text>

      </View>

    </View>
  );
}


function SectionCard({
  title,
  icon,
  children,
}) {
  return (
    <View style={styles.sectionCard}>

      <View style={styles.sectionHeader}>

        <View style={styles.sectionHeaderIcon}>
          <Ionicons
            name={icon}
            size={18}
            color={colors.accent}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

      </View>

      {children}

    </View>
  );
}


function StatusBadge({
  status,
}) {
  const completed =
    status === 'COMPLETED';

  const cancelled =
    status === 'CANCELLED';

  const assigned =
    status === 'ASSIGNED';

  let backgroundColor =
    '#F1F5F9';

  let textColor =
    '#475569';

  if (completed) {
    backgroundColor = '#DCFCE7';
    textColor = '#166534';
  }

  if (cancelled) {
    backgroundColor = '#FEE2E2';
    textColor = '#991B1B';
  }

  if (assigned) {
    backgroundColor = '#DBEAFE';
    textColor = '#1D4ED8';
  }

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.statusBadgeText,
          {
            color: textColor,
          },
        ]}
      >
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}


// =========================================================
// MAIN SCREEN
// =========================================================

export default function RequestDetailsScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const rawId =
    params?.id;

  const requestId =
    Array.isArray(rawId)
      ? rawId[0]
      : rawId;


  const [
    request,
    setRequest,
  ] = useState(null);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    payment,
    setPayment,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // SAFE BACK
  // =======================================================

  const handleBack =
    useCallback(() => {

      try {

        if (
          typeof router.canGoBack === 'function' &&
          router.canGoBack()
        ) {
          router.back();
          return;
        }

        router.replace('/');

      } catch (navigationError) {

        console.log(
          '[DRIVER REQUEST] Back navigation error:',
          navigationError
        );

        router.replace('/');

      }

    }, [router]);


  // =======================================================
  // LOAD DATA
  // =======================================================

  const loadRequest =
    useCallback(
      async ({
        refresh = false,
      } = {}) => {

        if (!requestId) {

          setError(
            'Request ID is missing.'
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

          console.log(
            '[DRIVER REQUEST] Loading request:',
            requestId
          );

          console.log(
            '[DRIVER REQUEST] Loading history:',
            requestId
          );

          const [
            requestResponse,
            historyResponse,
            paymentResponse,
          ] =
            await Promise.all([
              getServiceRequestById(
                requestId
              ),
              getServiceRequestHistory(
                requestId
              ),
              apiRequest(
                `/api/v1/payments/requests/${encodeURIComponent(
                  String(requestId)
                )}`,
                {
                  method: 'GET',
                }
              ),
            ]);

          console.log(
            '[DRIVER REQUEST] Request details:',
            JSON.stringify(
              requestResponse,
              null,
              2
            )
          );

          console.log(
            '[DRIVER REQUEST] History:',
            JSON.stringify(
              historyResponse,
              null,
              2
            )
          );

          setRequest(
            requestResponse || null
          );

          setHistory(
            Array.isArray(
              historyResponse
            )
              ? historyResponse
              : []
          );

          setPayment(
            paymentResponse || null
          );

        } catch (loadError) {

          console.error(
            '[DRIVER REQUEST] Load error:',
            loadError
          );

          setRequest(null);

          setHistory([]);

          setPayment(null);

          setError(
            loadError?.message ||
            'Unable to load request details.'
          );

        } finally {

          setLoading(false);
          setRefreshing(false);

        }

      },
      [requestId]
    );


  useEffect(() => {

    loadRequest();

  }, [loadRequest]);


  // =======================================================
  // VIEW INVOICE
  // =======================================================

  const handleViewInvoice = useCallback(() => {
    if (!requestId) {
      return;
    }

    router.push({
      pathname: '/breakdown/invoice',
      params: {
        requestId: String(requestId),
      },
    });
  }, [requestId, router]);


  // =======================================================
  // CANCEL
  // =======================================================

  const handleCancel =
    useCallback(() => {

      if (!requestId) {
        return;
      }

      if (
        cancelling ||
        isTerminalStatus(
          request?.status
        )
      ) {
        return;
      }

      Alert.alert(
        'Cancel Request',
        'Are you sure you want to cancel this service request?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {

              try {

                setCancelling(true);

                console.log(
                  '[DRIVER REQUEST] Cancelling:',
                  requestId
                );

                const response =
                  await cancelServiceRequest(
                    requestId
                  );

                console.log(
                  '[DRIVER REQUEST] Cancel response:',
                  JSON.stringify(
                    response,
                    null,
                    2
                  )
                );

                await loadRequest({
                  refresh: true,
                });

              } catch (cancelError) {

                console.error(
                  '[DRIVER REQUEST] Cancel error:',
                  cancelError
                );

                Alert.alert(
                  'Unable to Cancel',
                  cancelError?.message ||
                  'Unable to cancel the request.'
                );

              } finally {

                setCancelling(false);

              }

            },
          },
        ]
      );

    }, [
      requestId,
      request?.status,
      cancelling,
      loadRequest,
    ]);


  // =======================================================
  // DERIVED DATA
  // =======================================================

  const categoryLabel =
    useMemo(
      () =>
        getCategoryLabel(
          request?.category
        ),
      [request?.category]
    );


  const categoryIcon =
    useMemo(
      () =>
        getCategoryIcon(
          request?.category
        ),
      [request?.category]
    );


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <View style={styles.container}>

        <View style={styles.simpleTopBar}>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            Request Details
          </Text>

          <View style={styles.topBarSpacer} />

        </View>

        <View style={styles.centerContent}>

          <ActivityIndicator
            size="small"
            color={colors.accent}
          />

          <Text style={styles.centerText}>
            Loading request details...
          </Text>

        </View>

      </View>
    );
  }


  // =======================================================
  // ERROR / NOT FOUND
  // =======================================================

  if (
    error ||
    !request
  ) {

    return (
      <View style={styles.container}>

        <View style={styles.simpleTopBar}>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>
            Request Details
          </Text>

          <View style={styles.topBarSpacer} />

        </View>

        <View style={styles.centerContent}>

          <View style={styles.errorIcon}>

            <Ionicons
              name="alert-circle-outline"
              size={42}
              color={colors.accent}
            />

          </View>

          <Text style={styles.errorTitle}>
            Request not found
          </Text>

          <Text style={styles.errorText}>
            {error || 'Unable to load this service request.'}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.85}
            onPress={() =>
              loadRequest()
            }
          >

            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.white}
            />

            <Text style={styles.retryButtonText}>
              Try Again
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    );
  }


  // =======================================================
  // MAIN RENDER
  // =======================================================

  return (
    <View style={styles.container}>

      <View style={styles.simpleTopBar}>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBack}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          Request Details
        </Text>

        <View style={styles.topBarSpacer} />

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadRequest({
                refresh: true,
              })
            }
            tintColor={colors.accent}
          />
        }
      >

        {/* =================================================
            REQUEST HERO
        ================================================= */}

        <View style={styles.heroCard}>

          <View style={styles.heroTop}>

            <View style={styles.categoryIcon}>

              <Ionicons
                name={categoryIcon}
                size={26}
                color={colors.accent}
              />

            </View>

            <View style={styles.heroText}>

              <Text style={styles.categoryLabel}>
                {categoryLabel}
              </Text>

              <Text style={styles.requestIdLabel}>
                Request ID
              </Text>

              <Text
                style={styles.requestId}
                numberOfLines={1}
              >
                {request.id}
              </Text>

            </View>

            <StatusBadge
              status={request.status}
            />

          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMeta}>

            <View style={styles.metaItem}>

              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textMuted}
              />

              <Text style={styles.metaText}>
                {formatDate(request.createdAt)}
              </Text>

            </View>

            <View style={styles.metaItem}>

              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textMuted}
              />

              <Text style={styles.metaText}>
                {formatTime(request.createdAt)}
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            REQUEST INFORMATION
        ================================================= */}

        <SectionCard
          title="Request Information"
          icon="document-text-outline"
        >

          <InfoRow
            icon="construct-outline"
            label="Service"
            value={categoryLabel}
          />

          <InfoRow
            icon="flag-outline"
            label="Status"
            value={getStatusLabel(request.status)}
          />

          <InfoRow
            icon="location-outline"
            label="Location"
            value={request.address}
          />

          <InfoRow
            icon="navigate-outline"
            label="Latitude"
            value={
              request.latitude !== null &&
              request.latitude !== undefined
                ? String(request.latitude)
                : '—'
            }
          />

          <InfoRow
            icon="navigate-outline"
            label="Longitude"
            value={
              request.longitude !== null &&
              request.longitude !== undefined
                ? String(request.longitude)
                : '—'
            }
          />

          <InfoRow
            icon="calendar-outline"
            label="Created"
            value={
              formatDateTime(
                request.createdAt
              )
            }
          />

        </SectionCard>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <SectionCard
          title="Problem Description"
          icon="chatbox-ellipses-outline"
        >

          <Text style={styles.descriptionText}>
            {request.description
              ? request.description
              : 'No additional description provided.'}
          </Text>

        </SectionCard>


        {/* =================================================
            VEHICLE
        ================================================= */}

        <SectionCard
          title="Vehicle"
          icon="car-outline"
        >

          <InfoRow
            icon="barcode-outline"
            label="Vehicle ID"
            value={request.vehicleId}
          />

        </SectionCard>


        {/* =================================================
            MECHANIC ASSIGNMENT
        ================================================= */}

        <SectionCard
          title="Mechanic Assignment"
          icon="person-outline"
        >

          <InfoRow
            icon="person-circle-outline"
            label="Mechanic Status"
            value={
              request.assignedMechanicId
                ? 'Mechanic Assigned'
                : 'Searching for Mechanic'
            }
          />

          <InfoRow
            icon="key-outline"
            label="Mechanic ID"
            value={
              request.assignedMechanicId ||
              'Not assigned yet'
            }
          />

        </SectionCard>


        {/* =================================================
            STATUS TIMELINE
        ================================================= */}

        <SectionCard
          title="Request Timeline"
          icon="time-outline"
        >

          {history.length === 0 ? (

            <Text style={styles.emptyText}>
              No status history available.
            </Text>

          ) : (

            <View style={styles.timeline}>

              {history.map(
                (item, index) => {

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

                      <View style={styles.timelineLeft}>

                        <View
                          style={[
                            styles.timelineIcon,
                            isLast &&
                              styles.timelineIconActive,
                          ]}
                        >

                          <Ionicons
                            name={
                              getStatusIcon(
                                item.status
                              )
                            }
                            size={16}
                            color={
                              isLast
                                ? colors.white
                                : colors.accent
                            }
                          />

                        </View>

                        {!isLast ? (
                          <View
                            style={styles.timelineLine}
                          />
                        ) : null}

                      </View>

                      <View
                        style={styles.timelineContent}
                      >

                        <Text
                          style={
                            styles.timelineStatus
                          }
                        >
                          {getStatusLabel(
                            item.status
                          )}
                        </Text>

                        <Text
                          style={
                            styles.timelineDate
                          }
                        >
                          {formatDate(
                            item.createdAt
                          )}
                          {' '}
                          {formatTime(
                            item.createdAt
                          )}
                        </Text>

                        {item.notes ? (
                          <Text
                            style={
                              styles.timelineNotes
                            }
                          >
                            {item.notes}
                          </Text>
                        ) : null}

                      </View>

                    </View>
                  );

                }
              )}

            </View>

          )}

        </SectionCard>


        {/* =================================================
            PAYMENT / INVOICE
        ================================================= */}

        {request.status === 'COMPLETED' &&
        payment &&
        ['PAID', 'SUCCESS', 'COMPLETED'].includes(
          String(payment.status || '')
            .trim()
            .toUpperCase()
        ) ? (
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceInfo}>
              <View style={styles.invoiceIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={20}
                  color={colors.success}
                />
              </View>

              <View style={styles.invoiceTextContainer}>
                <Text style={styles.invoiceTitle}>
                  Payment Completed
                </Text>

                <Text style={styles.invoiceSubtitle}>
                  ₹{Number(payment.amount || 0).toFixed(0)} •{' '}
                  {String(
                    payment.paymentMethod || 'Payment'
                  ).toUpperCase()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.invoiceButton}
              activeOpacity={0.85}
              onPress={handleViewInvoice}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.white}
              />

              <Text style={styles.invoiceButtonText}>
                VIEW INVOICE
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}


        {/* =================================================
            CANCEL
        ================================================= */}

        {!isTerminalStatus(
          request.status
        ) ? (

          <TouchableOpacity
            style={[
              styles.cancelButton,
              cancelling &&
                styles.disabledButton,
            ]}
            activeOpacity={0.85}
            disabled={cancelling}
            onPress={handleCancel}
          >

            {cancelling ? (

              <ActivityIndicator
                size="small"
                color={colors.white}
              />

            ) : (

              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.white}
              />

            )}

            <Text style={styles.cancelButtonText}>
              {cancelling
                ? 'Cancelling...'
                : 'Cancel Request'}
            </Text>

          </TouchableOpacity>

        ) : null}


        <View style={styles.bottomSpace} />

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
    backgroundColor: colors.background,
  },

  simpleTopBar: {
    minHeight: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },

  topBarTitle: {
    flex: 1,
    marginHorizontal: 12,
    fontFamily: 'InterSemiBold',
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },

  topBarSpacer: {
    width: 42,
    height: 42,
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  centerText: {
    marginTop: 12,
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },

  errorIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginBottom: 16,
  },

  errorTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },

  errorText: {
    marginTop: 8,
    fontFamily: 'InterRegular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },

  retryButtonText: {
    marginLeft: 8,
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: colors.white,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  heroCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white,
    marginBottom: 14,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  heroText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  categoryLabel: {
    fontFamily: 'InterSemiBold',
    fontSize: 16,
    color: colors.text,
  },

  requestIdLabel: {
    marginTop: 4,
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
  },

  requestId: {
    marginTop: 2,
    fontFamily: 'InterMedium',
    fontSize: 10,
    color: colors.textMuted,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  statusBadgeText: {
    fontFamily: 'InterSemiBold',
    fontSize: 10,
  },

  heroDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  metaText: {
    marginLeft: 6,
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textMuted,
  },

  sectionCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  sectionTitle: {
    marginLeft: 10,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    color: colors.text,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },

  infoLabel: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
  },

  infoValue: {
    marginTop: 2,
    fontFamily: 'InterMedium',
    fontSize: 13,
    color: colors.text,
  },

  descriptionText: {
    fontFamily: 'InterRegular',
    fontSize: 13,
    lineHeight: 21,
    color: colors.text,
  },

  emptyText: {
    fontFamily: 'InterRegular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },

  timeline: {
    paddingTop: 2,
  },

  timelineRow: {
    flexDirection: 'row',
  },

  timelineLeft: {
    width: 32,
    alignItems: 'center',
  },

  timelineIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  timelineIconActive: {
    backgroundColor: colors.accent,
  },

  timelineLine: {
    width: 1,
    flex: 1,
    minHeight: 34,
    backgroundColor: '#CBD5E1',
  },

  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 18,
  },

  timelineStatus: {
    fontFamily: 'InterSemiBold',
    fontSize: 13,
    color: colors.text,
  },

  timelineDate: {
    marginTop: 3,
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
  },

  timelineNotes: {
    marginTop: 5,
    fontFamily: 'InterRegular',
    fontSize: 11,
    lineHeight: 17,
    color: colors.textMuted,
  },

  // -------------------------------------------------------
  // INVOICE
  // -------------------------------------------------------

  invoiceCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  invoiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  invoiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successLight,
  },

  invoiceTextContainer: {
    flex: 1,
    marginLeft: 11,
  },

  invoiceTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: colors.text,
  },

  invoiceSubtitle: {
    marginTop: 3,
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
  },

  invoiceButton: {
    minHeight: 48,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    gap: 8,
  },

  invoiceButtonText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.white,
  },

  cancelButton: {
    minHeight: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    marginBottom: 4,
  },

  disabledButton: {
    opacity: 0.65,
  },

  cancelButtonText: {
    marginLeft: 8,
    fontFamily: 'InterSemiBold',
    fontSize: 14,
    color: colors.white,
  },

  bottomSpace: {
    height: 30,
  },

});
