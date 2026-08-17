import { useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

export default function RequestAssistanceScreen() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState(null);

  const assistanceTypes = [
    {
      id: 'battery',
      title: 'Battery',
      description: 'Battery dead or vehicle won’t start',
      icon: 'battery-half-outline',
      color: colors.serviceBattery,
    },
    {
      id: 'tyre',
      title: 'Tyre',
      description: 'Flat tyre or tyre damage',
      icon: 'disc-outline',
      color: colors.serviceTyre,
    },
    {
      id: 'fuel',
      title: 'Fuel',
      description: 'Out of fuel or fuel related issue',
      icon: 'water-outline',
      color: colors.serviceFuel,
    },
    {
      id: 'engine',
      title: 'Engine',
      description: 'Engine problem or overheating',
      icon: 'construct-outline',
      color: colors.serviceEngine,
    },
    {
      id: 'electrical',
      title: 'Electrical',
      description: 'Lights, wiring or electrical issue',
      icon: 'flash-outline',
      color: colors.serviceElectrical,
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Something else is wrong',
      icon: 'help-circle-outline',
      color: colors.serviceOther,
    },
  ];

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }

    router.push({
      pathname: '/breakdown/details',
      params: {
        type: selectedType,
      },
    });
  };

  return (
    <View style={styles.container}>

      {/* =====================================================
          HEADER
      ===================================================== */}

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

        <View style={styles.headerTextContainer}>

          <Text style={styles.headerTitle}>
            Request Assistance
          </Text>

          <Text style={styles.headerSubtitle}>
            Tell us what happened
          </Text>

        </View>

        <View style={styles.headerStep}>

          <Text style={styles.headerStepText}>
            1
          </Text>

          <Text style={styles.headerStepOf}>
            / 4
          </Text>

        </View>

      </View>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* =================================================
            INTRO
        ================================================= */}

        <View style={styles.intro}>

          <View style={styles.introIcon}>

            <Ionicons
              name="warning-outline"
              size={25}
              color={colors.accent}
            />

          </View>

          <View style={styles.introText}>

            <Text style={styles.introTitle}>
              What happened to your vehicle?
            </Text>

            <Text style={styles.introDescription}>
              Choose the issue that best describes
              your current situation.
            </Text>

          </View>

        </View>


        {/* =================================================
            EMERGENCY NOTICE
        ================================================= */}

        <View style={styles.noticeCard}>

          <View style={styles.noticeIcon}>

            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color={colors.success}
            />

          </View>

          <View style={styles.noticeInfo}>

            <Text style={styles.noticeTitle}>
              Don't worry, we've got you covered
            </Text>

            <Text style={styles.noticeText}>
              We'll find an available mechanic near
              your location.
            </Text>

          </View>

        </View>


        {/* =================================================
            SECTION
        ================================================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Select an issue
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose one option to continue
          </Text>

        </View>


        {/* =================================================
            ASSISTANCE OPTIONS
        ================================================= */}

        <View style={styles.optionsContainer}>

          {assistanceTypes.map((item) => {

            const selected = selectedType === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedType(item.id)}
                activeOpacity={0.8}
              >

                {/* Icon */}

                <View
                  style={[
                    styles.optionIcon,
                    {
                      backgroundColor: selected
                        ? item.color
                        : `${item.color}15`,
                    },
                  ]}
                >

                  <Ionicons
                    name={item.icon}
                    size={25}
                    color={
                      selected
                        ? colors.white
                        : item.color
                    }
                  />

                </View>


                {/* Text */}

                <View style={styles.optionInfo}>

                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {item.description}
                  </Text>

                </View>


                {/* Selection */}

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                  ]}
                >

                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={13}
                      color={colors.white}
                    />
                  )}

                </View>

              </TouchableOpacity>
            );
          })}

        </View>


        {/* =================================================
            SAFETY
        ================================================= */}

        <View style={styles.safetyCard}>

          <View style={styles.safetyIcon}>

            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.info}
            />

          </View>

          <View style={styles.safetyInfo}>

            <Text style={styles.safetyTitle}>
              Safety first
            </Text>

            <Text style={styles.safetyText}>
              If you are in an unsafe location, move to
              a safe place if possible and turn on your
              vehicle hazard lights.
            </Text>

          </View>

        </View>


        <View style={styles.bottomSpace} />

      </ScrollView>


      {/* =====================================================
          BOTTOM ACTION
      ===================================================== */}

      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedType && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedType}
          activeOpacity={0.85}
        >

          <Text
            style={[
              styles.continueText,
              !selectedType && styles.continueTextDisabled,
            ]}
          >
            CONTINUE
          </Text>

          <View
            style={[
              styles.continueArrow,
              !selectedType && styles.continueArrowDisabled,
            ]}
          >

            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                selectedType
                  ? colors.white
                  : colors.textLight
              }
            />

          </View>

        </TouchableOpacity>

      </View>

    </View>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },


  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    minHeight: 76,
    paddingHorizontal: spacing.screenHorizontal,
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

  headerTextContainer: {
    flex: 1,
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
    marginTop: 3,
  },

  headerStep: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  headerStepText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.accent,
  },

  headerStepOf: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },


  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: 20,
    paddingBottom: 110,
  },


  /* =======================================================
     INTRO
  ======================================================= */

  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  introIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  introText: {
    flex: 1,
  },

  introTitle: {
    fontFamily: 'InterBold',
    fontSize: 16,
    color: colors.text,
  },

  introDescription: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },


  /* =======================================================
     NOTICE
  ======================================================= */

  noticeCard: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  noticeIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  noticeInfo: {
    flex: 1,
  },

  noticeTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  noticeText: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },


  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    marginBottom: 12,
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


  /* =======================================================
     OPTIONS
  ======================================================= */

  optionsContainer: {
    gap: 10,
    marginBottom: 20,
  },

  optionCard: {
    minHeight: 79,
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  optionInfo: {
    flex: 1,
  },

  optionTitle: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
  },

  optionTitleSelected: {
    color: colors.accentDark,
  },

  optionDescription: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 14,
    color: colors.textMuted,
    marginTop: 3,
    paddingRight: 5,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  radioSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },


  /* =======================================================
     SAFETY
  ======================================================= */

  safetyCard: {
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  safetyIcon: {
    width: 38,
    height: 38,
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


  /* =======================================================
     BOTTOM
  ======================================================= */

  bottomSpace: {
    height: 20,
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
    backgroundColor: colors.borderLight,
  },

  continueText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.2,
  },

  continueTextDisabled: {
    color: colors.textLight,
  },

  continueArrow: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueArrowDisabled: {
    backgroundColor: colors.border,
  },

});