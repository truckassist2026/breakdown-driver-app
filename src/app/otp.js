import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import colors from '../constants/colors';
import spacing from '../constants/spacing';

import {
  sendDriverOtp,
  verifyDriverOtp,
} from '../services/authService';

export default function OTPScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams();

  const mobile =
    params.mobile || '';

  const [otp, setOtp] =
    useState('');

  const [seconds, setSeconds] =
    useState(60);

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const inputRef =
    useRef(null);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {

    if (seconds <= 0) {
      return;
    }

    const timer =
      setInterval(() => {

        setSeconds(
          (previous) =>
            previous - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [seconds]);

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerify =
    async () => {

      if (otp.length !== 6) {

        setError(
          'Please enter the 6-digit verification code.'
        );

        return;
      }

      if (loading) {
        return;
      }

      try {

        setLoading(true);
        setError('');

        await verifyDriverOtp(
          mobile,
          otp
        );

        /*
         * JWT has now been stored
         * securely by authService.
         *
         * Navigate to existing
         * Driver Home.
         */

        router.replace(
          '/(tabs)/home'
        );

      } catch (error) {

        console.error(
          'OTP verification failed:',
          error
        );

        setError(
          error?.message ||
            'Invalid verification code. Please try again.'
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResend =
    async () => {

      if (
        seconds > 0 ||
        loading
      ) {
        return;
      }

      try {

        setLoading(true);
        setError('');

        await sendDriverOtp(
          mobile
        );

        setSeconds(60);
        setOtp('');

        /*
         * Focus OTP input again.
         */

        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);

      } catch (error) {

        console.error(
          'OTP resend failed:',
          error
        );

        setError(
          error?.message ||
            'Unable to resend OTP. Please try again.'
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================================================
  // FORMAT MOBILE
  // =========================================================

  const maskedMobile =
    mobile.length === 10
      ? `+91 ${mobile.slice(0, 2)}******${mobile.slice(-2)}`
      : '+91 ******';

  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
            disabled={loading}
          >

            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />

          </TouchableOpacity>

          <View>

            <Text style={styles.headerTitle}>
              Verification
            </Text>

            <Text style={styles.headerSubtitle}>
              Confirm your mobile number
            </Text>

          </View>

        </View>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <View style={styles.intro}>

          <View style={styles.iconBox}>

            <Ionicons
              name="chatbubble-ellipses-outline"
              size={25}
              color={colors.accent}
            />

          </View>

          <Text style={styles.title}>
            Enter verification code
          </Text>

          <Text style={styles.description}>
            We've sent a 6-digit verification code to
          </Text>

          <Text style={styles.mobile}>
            {maskedMobile}
          </Text>

        </View>

        {/* =====================================================
            OTP CARD
        ===================================================== */}

        <View style={styles.card}>

          <Text style={styles.label}>
            Verification code
          </Text>

          {/* =================================================
              OTP INPUT
          ================================================= */}

          <View style={styles.otpContainer}>

            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={(value) => {

                const cleaned =
                  value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 6);

                setOtp(cleaned);
                setError('');

              }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              editable={!loading}
              style={styles.otpInput}
              caretHidden={false}
            />

            {Array.from({
              length: 6,
            }).map(
              (_, index) => {

                const value =
                  otp[index];

                return (

                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.otpBox,

                      index === otp.length &&
                        styles.otpBoxActive,

                      error &&
                        styles.otpBoxError,
                    ]}
                    onPress={() =>
                      inputRef.current?.focus()
                    }
                    activeOpacity={0.9}
                    disabled={loading}
                  >

                    <Text
                      style={styles.otpDigit}
                    >
                      {value || ''}
                    </Text>

                  </TouchableOpacity>

                );
              }
            )}

          </View>

          {/* =================================================
              ERROR
          ================================================= */}

          {error ? (

            <View style={styles.errorRow}>

              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={colors.danger}
              />

              <Text style={styles.errorText}>
                {error}
              </Text>

            </View>

          ) : null}

          {/* =================================================
              VERIFY BUTTON
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.verifyButton,

              (otp.length !== 6 ||
                loading) &&
                styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={
              otp.length !== 6 ||
              loading
            }
            activeOpacity={0.85}
          >

            <Text
              style={[
                styles.verifyText,

                (otp.length !== 6 ||
                  loading) &&
                  styles.verifyTextDisabled,
              ]}
            >
              {loading
                ? 'VERIFYING...'
                : 'VERIFY & CONTINUE'}
            </Text>

            <View
              style={[
                styles.arrowBox,

                (otp.length !== 6 ||
                  loading) &&
                  styles.arrowBoxDisabled,
              ]}
            >

              <Ionicons
                name="arrow-forward"
                size={19}
                color={
                  otp.length === 6 &&
                  !loading
                    ? colors.white
                    : colors.textLight
                }
              />

            </View>

          </TouchableOpacity>

          {/* =================================================
              RESEND
          ================================================= */}

          <View style={styles.resendContainer}>

            <Text style={styles.resendLabel}>
              Didn't receive the code?
            </Text>

            {seconds > 0 ? (

              <Text style={styles.timerText}>
                Resend in {seconds}s
              </Text>

            ) : (

              <TouchableOpacity
                onPress={handleResend}
                activeOpacity={0.7}
                disabled={loading}
              >

                <Text style={styles.resendText}>
                  Resend code
                </Text>

              </TouchableOpacity>

            )}

          </View>

        </View>

        {/* =====================================================
            SECURITY CARD
        ===================================================== */}

        <View style={styles.securityCard}>

          <View style={styles.securityIcon}>

            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.success}
            />

          </View>

          <View style={styles.securityContent}>

            <Text style={styles.securityTitle}>
              Secure verification
            </Text>

            <Text style={styles.securityText}>
              Your verification code keeps your RoadAssist
              account secure.
            </Text>

          </View>

        </View>

        <Text style={styles.footer}>
          Safe • Fast • Reliable
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  // =========================================================
  // SCREEN
  // =========================================================

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal:
      spacing.screenHorizontal,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // =========================================================
  // HEADER
  // =========================================================

  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  headerTitle: {
    fontFamily: 'InterBold',
    fontSize: 17,
    color: colors.text,
  },

  headerSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  // =========================================================
  // INTRO
  // =========================================================

  intro: {
    marginTop: 30,
    marginBottom: 23,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  title: {
    fontFamily: 'InterBold',
    fontSize: 25,
    lineHeight: 30,
    color: colors.text,
    letterSpacing: -0.4,
  },

  description: {
    fontFamily: 'InterRegular',
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },

  mobile: {
    fontFamily: 'InterSemiBold',
    fontSize: 13,
    color: colors.text,
    marginTop: 3,
  },

  // =========================================================
  // CARD
  // =========================================================

  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusLarge,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.borderLight,

    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },

  label: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
    marginBottom: 10,
  },

  // =========================================================
  // OTP
  // =========================================================

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },

  otpInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  otpBox: {
    width: 43,
    height: 54,
    borderRadius: spacing.radiusMedium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpBoxActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },

  otpBoxError: {
    borderColor: colors.danger,
  },

  otpDigit: {
    fontFamily: 'InterBold',
    fontSize: 20,
    color: colors.text,
  },

  // =========================================================
  // ERROR
  // =========================================================

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  errorText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.danger,
    marginLeft: 5,
    flex: 1,
  },

  // =========================================================
  // VERIFY
  // =========================================================

  verifyButton: {
    height: spacing.buttonHeight,
    borderRadius: 15,
    backgroundColor: colors.accent,
    paddingLeft: 18,
    paddingRight: 7,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
  },

  verifyButtonDisabled: {
    backgroundColor: colors.borderLight,
  },

  verifyText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },

  verifyTextDisabled: {
    color: colors.textLight,
  },

  arrowBox: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowBoxDisabled: {
    backgroundColor: colors.border,
  },

  // =========================================================
  // RESEND
  // =========================================================

  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  resendLabel: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
  },

  timerText: {
    fontFamily: 'InterSemiBold',
    fontSize: 10,
    color: colors.textLight,
    marginLeft: 4,
  },

  resendText: {
    fontFamily: 'InterSemiBold',
    fontSize: 10,
    color: colors.accent,
    marginLeft: 4,
  },

  // =========================================================
  // SECURITY
  // =========================================================

  securityCard: {
    marginTop: 17,
    backgroundColor: colors.successLight,
    borderRadius: spacing.radiusMedium,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  securityText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // =========================================================
  // FOOTER
  // =========================================================

  footer: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 22,
  },

});