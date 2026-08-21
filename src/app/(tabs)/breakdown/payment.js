import { useEffect, useState } from 'react';

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
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../../constants/colors';
import { apiRequest } from '../../../services/api';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const requestId = Array.isArray(params.requestId)
    ? params.requestId[0]
    : params.requestId;

  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');

  const loadPayment = async (showLoader = false) => {
    if (!requestId) {
      setError('Request ID is missing.');
      setLoading(false);
      return;
    }

    try {
      if (showLoader) setLoading(true);
      setError('');

      const [requestResponse, paymentResponse] = await Promise.all([
        apiRequest(`/api/v1/requests/${encodeURIComponent(String(requestId))}`, { method: 'GET' }),
        apiRequest(`/api/v1/payments/requests/${encodeURIComponent(String(requestId))}`, { method: 'GET' }),
      ]);

      console.log('[DRIVER PAYMENT] Request:', requestResponse);
      console.log('[DRIVER PAYMENT] Payment:', paymentResponse);

      setRequest(requestResponse);
      setPayment(paymentResponse);
    } catch (err) {
      console.error('[DRIVER PAYMENT] Load failed:', err);
      setError(err?.data?.message || err?.message || 'Unable to load payment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mounted) await loadPayment(true);
    };
    load();
    return () => { mounted = false; };
  }, [requestId]);

  const pay = async () => {
    if (!requestId || processing || !payment) return;

    try {
      setProcessing(true);

      const response = await apiRequest(
        `/api/v1/payments/requests/${encodeURIComponent(String(requestId))}/pay`,
        {
          method: 'POST',
          body: { paymentMethod: method },
        }
      );

      console.log('[DRIVER PAYMENT] Payment response:', response);

      router.replace({
        pathname: '/breakdown/payment-success',
        params: {
          requestId: String(requestId),
          amount: String(response?.amount ?? payment?.amount ?? ''),
          paymentMethod: String(response?.paymentMethod ?? method),
          transactionId: String(response?.id ?? ''),
        },
      });
    } catch (err) {
      console.error('[DRIVER PAYMENT] Payment failed:', err);
      Alert.alert(
        'Payment Failed',
        err?.data?.message || err?.message || 'Unable to complete payment.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const amount = Number(payment?.amount ?? 0);
  const serviceName =
    request?.category === 'BATTERY' ? 'Battery Assistance' :
    request?.category === 'TYRE' ? 'Tyre Assistance' :
    request?.category === 'FUEL' ? 'Fuel Assistance' :
    request?.category === 'BREAKDOWN' ? 'Breakdown Assistance' :
    request?.category || 'Roadside Assistance';
  const vehicle = request?.vehicle;
  const vehicleText = [vehicle?.manufacturer, vehicle?.model, vehicle?.registrationNumber]
    .filter(Boolean).join(' • ');

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ marginTop: 12, color: colors.textMuted, fontFamily: 'InterMedium', fontSize: 11 }}>Loading payment...</Text>
      </View>
    );
  }

  if (error || !payment) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.accent} />
        <Text style={{ marginTop: 12, fontFamily: 'InterBold', fontSize: 16, color: colors.text }}>Unable to load payment</Text>
        <Text style={{ marginTop: 7, fontFamily: 'InterRegular', fontSize: 11, color: colors.textMuted, textAlign: 'center' }}>{error || 'Payment details are unavailable.'}</Text>
        <TouchableOpacity style={{ marginTop: 20, backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 13 }} onPress={() => loadPayment(true)}>
          <Text style={{ fontFamily: 'InterBold', fontSize: 10, color: colors.white }}>RETRY</Text>
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
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.text}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Payment
          </Text>

          <Text style={styles.subtitle}>
            {serviceName}{vehicle?.registrationNumber ? ` • ${vehicle.registrationNumber}` : ''}
          </Text>
        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.amountCard}>

          <Text style={styles.amountLabel}>
            AMOUNT PAYABLE
          </Text>

          <Text style={styles.amount}>
            ₹{amount.toFixed(0)}
          </Text>

          <View style={styles.amountStatus}>

            <Ionicons
              name="shield-checkmark"
              size={15}
              color={colors.white}
            />

            <Text style={styles.amountStatusText}>
              Secure payment
            </Text>

          </View>

        </View>


        <Text style={styles.sectionLabel}>
          PAYMENT METHOD
        </Text>

        <View style={styles.paymentCard}>

          <PaymentOption
            icon="phone-portrait-outline"
            title="UPI"
            subtitle="Google Pay, PhonePe, Paytm and more"
            selected={method === 'UPI'}
            onPress={() => setMethod('UPI')}
          />

          <PaymentOption
            icon="cash-outline"
            title="Cash"
            subtitle="Pay directly to the mechanic"
            selected={method === 'CASH'}
            onPress={() => setMethod('CASH')}
          />

        </View>


        <Text style={styles.sectionLabel}>
          BILL SUMMARY
        </Text>

        <View style={styles.billCard}>

          <Row
            label="Service charge"
            value={`₹${amount.toFixed(0)}`}
          />

          <Row
            label="Travel charge"
            value="₹0"
          />

          <View style={styles.divider} />

          <View style={styles.totalRow}>

            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              {`₹${amount.toFixed(0)}`}
            </Text>

          </View>

        </View>


        <View style={styles.secureCard}>

          <Ionicons
            name="lock-closed-outline"
            size={19}
            color={colors.success}
          />

          <Text style={styles.secureText}>
            Your payment information is securely processed.
          </Text>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={[
            styles.payButton,
            processing && styles.disabled,
          ]}
          onPress={pay}
          disabled={processing || String(payment?.status || '').toUpperCase() !== 'PENDING'}
        >

          {processing ? (
            <>
              <ActivityIndicator
                size="small"
                color={colors.white}
              />

              <Text style={styles.payText}>
                PROCESSING...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="lock-closed-outline"
                size={17}
                color={colors.white}
              />

              <Text style={styles.payText}>
                PAY {`₹${amount.toFixed(0)}`}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.white}
              />
            </>
          )}

        </TouchableOpacity>

      </View>

    </View>
  );
}

function PaymentOption({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selected && styles.paymentSelected,
      ]}
      onPress={onPress}
    >

      <View
        style={[
          styles.paymentIcon,
          selected && styles.paymentIconSelected,
        ]}
      >

        <Ionicons
          name={icon}
          size={21}
          color={
            selected
              ? colors.accent
              : colors.textSecondary
          }
        />

      </View>

      <View style={styles.paymentInfo}>

        <Text style={styles.paymentTitle}>
          {title}
        </Text>

        <Text style={styles.paymentSubtitle}>
          {subtitle}
        </Text>

      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >

        {selected && (
          <View style={styles.radioDot} />
        )}

      </View>

    </TouchableOpacity>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>

      <Text style={styles.rowLabel}>
        {label}
      </Text>

      <Text style={styles.rowValue}>
        {value}
      </Text>

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

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  amountCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 27,
    alignItems: 'center',
    marginBottom: 25,
  },

  amountLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 1,
    color: '#CBD5E1',
  },

  amount: {
    fontFamily: 'InterExtraBold',
    fontSize: 38,
    color: colors.white,
    marginTop: 3,
  },

  amountStatus: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  amountStatusText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.white,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 9,
  },

  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 23,
  },

  paymentOption: {
    minHeight: 74,
    borderRadius: 14,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  paymentSelected: {
    backgroundColor: colors.accentLight,
  },

  paymentIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  paymentIconSelected: {
    backgroundColor: colors.white,
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  paymentSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    lineHeight: 14,
    color: colors.textMuted,
    marginTop: 3,
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: colors.accent,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },

  billCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  rowLabel: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },

  rowValue: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 3,
    marginBottom: 14,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
  },

  total: {
    fontFamily: 'InterExtraBold',
    fontSize: 21,
    color: colors.accent,
  },

  secureCard: {
    backgroundColor: colors.successLight,
    borderRadius: 15,
    padding: 13,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  secureText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
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

  payButton: {
    height: 53,
    borderRadius: 15,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  disabled: {
    opacity: 0.7,
  },

  payText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});
