import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
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
import { apiRequest } from '../../../services/api';

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value) {
  if (!value) return '—';

  try {
    return new Date(value).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  } catch {
    return '—';
  }
}

function formatTime(value) {
  if (!value) return '—';

  try {
    return new Date(value).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  } catch {
    return '—';
  }
}

function formatAmount(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount.toFixed(0)
    : '0';
}

function getServiceName(category) {
  switch (String(category || '').toUpperCase()) {
    case 'BATTERY':
      return 'Battery Assistance';
    case 'TYRE':
      return 'Tyre Assistance';
    case 'FUEL':
      return 'Fuel Assistance';
    case 'BREAKDOWN':
      return 'Breakdown Assistance';
    case 'ELECTRICAL':
      return 'Electrical Assistance';
    case 'TOWING':
      return 'Towing Assistance';
    default:
      return 'Roadside Assistance';
  }
}

function getPaymentMethod(method) {
  const value = String(method || '')
    .trim()
    .toUpperCase();

  return value || 'PAYMENT';
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text
        style={styles.detailValue}
        numberOfLines={2}
      >
        {value || '—'}
      </Text>
    </View>
  );
}

export default function InvoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestId = firstParam(
    params.requestId,
  );

  const [request, setRequest] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadInvoice() {
      if (!requestId) {
        if (mounted) {
          setError('Request ID is missing.');
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [
          requestResponse,
          paymentResponse,
        ] = await Promise.all([
          apiRequest(
            `/api/v1/requests/${encodeURIComponent(
              String(requestId),
            )}`,
            {
              method: 'GET',
            },
          ),
          apiRequest(
            `/api/v1/payments/requests/${encodeURIComponent(
              String(requestId),
            )}`,
            {
              method: 'GET',
            },
          ),
        ]);

        if (!mounted) return;

        setRequest(
          requestResponse || null,
        );

        setPayment(
          paymentResponse || null,
        );
      } catch (loadError) {
        console.error(
          '[DRIVER INVOICE] Load failed:',
          loadError,
        );

        if (mounted) {
          setError(
            loadError?.data?.message ||
              loadError?.message ||
              'Unable to load invoice.',
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInvoice();

    return () => {
      mounted = false;
    };
  }, [requestId]);

  const serviceName = useMemo(
    () =>
      getServiceName(
        request?.category,
      ),
    [request?.category],
  );

  const amount = Number(
    payment?.amount ?? 0,
  );

  const paymentStatus = String(
    payment?.status || '',
  )
    .trim()
    .toUpperCase();

  const paymentMethod =
    getPaymentMethod(
      payment?.paymentMethod,
    );

  const vehicle = request?.vehicle;

  const vehicleText = [
    vehicle?.manufacturer,
    vehicle?.model,
    vehicle?.registrationNumber,
  ]
    .filter(Boolean)
    .join(' • ');

  const invoiceReference =
    payment?.id ||
    payment?.serviceRequestId ||
    request?.id ||
    requestId;

  const paymentDate =
    payment?.paidAt ||
    payment?.createdAt;

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text style={styles.centerText}>
          Loading invoice...
        </Text>
      </View>
    );
  }

  if (error || !request || !payment) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="receipt-outline"
            size={38}
            color={colors.accent}
          />
        </View>

        <Text style={styles.errorTitle}>
          Invoice unavailable
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'Invoice details are currently unavailable.'}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Invoice
          </Text>

          <Text style={styles.subtitle}>
            {serviceName}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceTop}>
            <View>
              <Text style={styles.brand}>
                TRUCK ASSIST
              </Text>

              <Text style={styles.invoiceTitle}>
                SERVICE INVOICE
              </Text>
            </View>

            <View style={styles.paidBadge}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.success}
              />

              <Text style={styles.paidText}>
                {paymentStatus === 'PAID' ||
                paymentStatus === 'SUCCESS' ||
                paymentStatus === 'COMPLETED'
                  ? 'PAID'
                  : paymentStatus || 'PAID'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <DetailRow
            label="Invoice Reference"
            value={invoiceReference}
          />

          <DetailRow
            label="Request ID"
            value={request.id}
          />

          <DetailRow
            label="Invoice Date"
            value={formatDate(
              paymentDate,
            )}
          />

          <DetailRow
            label="Payment Time"
            value={formatTime(
              paymentDate,
            )}
          />

          <DetailRow
            label="Service"
            value={serviceName}
          />

          <DetailRow
            label="Vehicle"
            value={
              vehicleText ||
              request.vehicleId
            }
          />

          <DetailRow
            label="Service Location"
            value={request.address}
          />

          {request.assignedMechanicId ? (
            <DetailRow
              label="Mechanic ID"
              value={
                request.assignedMechanicId
              }
            />
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            PAYMENT DETAILS
          </Text>

          <DetailRow
            label="Payment Method"
            value={paymentMethod}
          />

          <DetailRow
            label="Payment ID"
            value={payment?.id}
          />

          {payment?.notes ? (
            <DetailRow
              label="Notes"
              value={payment.notes}
            />
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            BILL SUMMARY
          </Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>
              Service charge
            </Text>

            <Text style={styles.billValue}>
              ₹{formatAmount(amount)}
            </Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>
              Travel charge
            </Text>

            <Text style={styles.billValue}>
              ₹0
            </Text>
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              TOTAL PAID
            </Text>

            <Text style={styles.totalValue}>
              ₹{formatAmount(amount)}
            </Text>
          </View>
        </View>

        <View style={styles.thankYouCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.success}
          />

          <Text style={styles.thankYouText}>
            Thank you for using Truck Assist.
            Please keep this invoice for your
            records.
          </Text>
        </View>

        <Text style={styles.footerText}>
          This invoice is generated from your
          completed service request and recorded
          payment.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },

  centerText: {
    marginTop: 12,
    fontFamily: 'InterMedium',
    fontSize: 12,
    color: colors.textMuted,
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
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.text,
  },

  errorText: {
    marginTop: 8,
    fontFamily: 'InterRegular',
    fontSize: 12,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: 'center',
  },

  primaryButton: {
    marginTop: 20,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },

  primaryButtonText: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.white,
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

  headerText: {
    flex: 1,
  },

  title: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  subtitle: {
    marginTop: 3,
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
  },

  headerSpacer: {
    width: 43,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  invoiceCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  invoiceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  brand: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.primary,
    letterSpacing: 0.5,
  },

  invoiceTitle: {
    marginTop: 4,
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
  },

  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.successLight,
    gap: 5,
  },

  paidText: {
    fontFamily: 'InterBold',
    fontSize: 10,
    color: colors.success,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 15,
  },

  detailRow: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailLabel: {
    flex: 1,
    paddingRight: 10,
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textMuted,
  },

  detailValue: {
    flex: 1.35,
    textAlign: 'right',
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  sectionTitle: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 5,
  },

  billRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  billLabel: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },

  billValue: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
  },

  totalDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 8,
  },

  totalRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  totalValue: {
    fontFamily: 'InterExtraBold',
    fontSize: 23,
    color: colors.accent,
  },

  thankYouCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 15,
    backgroundColor: colors.successLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  thankYouText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
  },

  footerText: {
    marginTop: 14,
    paddingHorizontal: 8,
    fontFamily: 'InterRegular',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
