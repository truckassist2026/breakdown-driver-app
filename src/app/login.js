import { useState } from 'react';

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
import { useRouter } from 'expo-router';

import colors from '../constants/colors';
import spacing from '../constants/spacing';

export default function LoginScreen() {
  const router = useRouter();

  const [mobile, setMobile] = useState('');

  const isValidMobile = mobile.length === 10;

  const handleContinue = () => {
    if (!isValidMobile) {
      return;
    }

    router.push({
      pathname: '/otp',
      params: {
        mobile,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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

          <View style={styles.brandContainer}>

            <View style={styles.brandIcon}>
              <Ionicons
                name="car-sport"
                size={24}
                color={colors.white}
              />
            </View>

            <View>
              <Text style={styles.brandTitle}>
                RoadAssist
              </Text>

              <Text style={styles.brandSubtitle}>
                Roadside assistance
              </Text>
            </View>

          </View>

        </View>


        {/* =====================================================
            INTRO
        ===================================================== */}

        <View style={styles.intro}>

          <Text style={styles.greeting}>
            Welcome back
          </Text>

          <Text style={styles.title}>
            Get help on the road
          </Text>

          <Text style={styles.description}>
            Sign in to request reliable roadside assistance
            whenever you need it.
          </Text>

        </View>


        {/* =====================================================
            LOGIN CARD
        ===================================================== */}

        <View style={styles.card}>

          {/* Icon */}

          <View style={styles.iconBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={25}
              color={colors.accent}
            />
          </View>


          <Text style={styles.cardTitle}>
            Driver sign in
          </Text>

          <Text style={styles.cardDescription}>
            Enter your mobile number to continue.
          </Text>


          {/* =================================================
              MOBILE NUMBER
          ================================================= */}

          <View style={styles.field}>

            <Text style={styles.label}>
              Mobile number
            </Text>

            <View
              style={[
                styles.inputContainer,
                mobile.length > 0 &&
                  styles.inputContainerActive,
              ]}
            >

              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>
                  +91
                </Text>
              </View>

              <View style={styles.divider} />

              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={(value) => {
                  const number = value
                    .replace(/[^0-9]/g, '')
                    .slice(0, 10);

                  setMobile(number);
                }}
                placeholder="Enter mobile number"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus={false}
              />

              {mobile.length === 10 && (
                <View style={styles.validIcon}>
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={colors.success}
                  />
                </View>
              )}

            </View>

          </View>


          {/* =================================================
              CONTINUE
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isValidMobile &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValidMobile}
            activeOpacity={0.85}
          >

            <Text
              style={[
                styles.continueText,
                !isValidMobile &&
                  styles.continueTextDisabled,
              ]}
            >
              CONTINUE
            </Text>

            <View
              style={[
                styles.arrowBox,
                !isValidMobile &&
                  styles.arrowBoxDisabled,
              ]}
            >
              <Ionicons
                name="arrow-forward"
                size={19}
                color={
                  isValidMobile
                    ? colors.white
                    : colors.textLight
                }
              />
            </View>

          </TouchableOpacity>


          {/* =================================================
              OTP INFORMATION
          ================================================= */}

          <View style={styles.infoRow}>

            <View style={styles.infoIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={colors.textMuted}
              />
            </View>

            <Text style={styles.infoText}>
              We'll send a one-time verification code to
              your mobile number.
            </Text>

          </View>

        </View>


        {/* =====================================================
            SAFETY CARD
        ===================================================== */}

        <View style={styles.safetyCard}>

          <View style={styles.safetyIcon}>
            <Ionicons
              name="flash-outline"
              size={20}
              color={colors.accent}
            />
          </View>

          <View style={styles.safetyContent}>

            <Text style={styles.safetyTitle}>
              Assistance when you need it
            </Text>

            <Text style={styles.safetyText}>
              Find a nearby mechanic quickly and get back
              on the road.
            </Text>

          </View>

        </View>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Text style={styles.footer}>
          Safe • Fast • Reliable
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({

  /* =========================================================
     SCREEN
  ========================================================= */

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 20,
    paddingBottom: 28,
  },


  /* =========================================================
     HEADER
  ========================================================= */

  header: {
    height: 58,
    justifyContent: 'center',
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  brandTitle: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.text,
    lineHeight: 21,
  },

  brandSubtitle: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },


  /* =========================================================
     INTRO
  ========================================================= */

  intro: {
    marginTop: 27,
    marginBottom: 23,
  },

  greeting: {
    fontFamily: 'InterRegular',
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },

  title: {
    fontFamily: 'InterBold',
    fontSize: 27,
    lineHeight: 32,
    color: colors.text,
    letterSpacing: -0.6,
  },

  description: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 6,
    maxWidth: 390,
  },


  /* =========================================================
     LOGIN CARD
  ========================================================= */

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

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  cardTitle: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.text,
  },

  cardDescription: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
    marginBottom: 22,
  },


  /* =========================================================
     FIELD
  ========================================================= */

  field: {
    marginBottom: 17,
  },

  label: {
    fontFamily: 'InterSemiBold',
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    borderRadius: spacing.radiusMedium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputContainerActive: {
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },

  countryCode: {
    paddingLeft: 15,
    paddingRight: 12,
  },

  countryCodeText: {
    fontFamily: 'InterSemiBold',
    fontSize: 13,
    color: colors.textSecondary,
  },

  divider: {
    height: 22,
    width: 1,
    backgroundColor: colors.border,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.text,
  },

  validIcon: {
    marginRight: 13,
  },


  /* =========================================================
     CONTINUE BUTTON
  ========================================================= */

  continueButton: {
    height: spacing.buttonHeight,
    borderRadius: 15,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 7,
  },

  continueButtonDisabled: {
    backgroundColor: colors.borderLight,
  },

  continueText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.15,
  },

  continueTextDisabled: {
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


  /* =========================================================
     OTP INFO
  ========================================================= */

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  infoIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  infoText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 14,
    color: colors.textMuted,
  },


  /* =========================================================
     SAFETY CARD
  ========================================================= */

  safetyCard: {
    marginTop: 17,
    backgroundColor: colors.accentLight,
    borderRadius: spacing.radiusMedium,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  safetyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  safetyContent: {
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
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },


  /* =========================================================
     FOOTER
  ========================================================= */

  footer: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 22,
  },

});