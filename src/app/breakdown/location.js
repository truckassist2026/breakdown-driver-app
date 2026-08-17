import { useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function LocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const handleContinue = () => {
    router.push({
      pathname: '/breakdown/searching',
      params: {
        type: params.type || 'battery',
        vehicleNumber: params.vehicleNumber || '',
        description: params.description || '',
      },
    });
  };

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

        <View style={styles.headerInfo}>

          <Text style={styles.title}>
            Confirm Location
          </Text>

          <Text style={styles.subtitle}>
            Where should we send the mechanic?
          </Text>

        </View>

        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepTotal}>/ 4</Text>
        </View>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Map */}

        <View style={styles.mapCard}>

          <View style={styles.mapBackground}>

            <View style={styles.roadOne} />
            <View style={styles.roadTwo} />
            <View style={styles.roadThree} />

            <View style={styles.locationPin}>

              <View style={styles.pinInner}>
                <Ionicons
                  name="location"
                  size={25}
                  color={colors.white}
                />
              </View>

            </View>

            <View style={styles.mapLabel}>
              <Ionicons
                name="navigate-outline"
                size={14}
                color={colors.accent}
              />

              <Text style={styles.mapLabelText}>
                Your location
              </Text>
            </View>

          </View>

        </View>


        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Your location
          </Text>

          <Text style={styles.sectionSubtitle}>
            We'll use this location to find nearby mechanics
          </Text>

        </View>


        <View style={styles.locationCard}>

          <View style={styles.locationIcon}>
            <Ionicons
              name="location"
              size={21}
              color={colors.accent}
            />
          </View>

          <View style={styles.locationInfo}>

            <Text style={styles.locationLabel}>
              CURRENT LOCATION
            </Text>

            <Text style={styles.locationTitle}>
              Chennai, Tamil Nadu
            </Text>

            <Text style={styles.locationAddress}>
              Your current GPS location
            </Text>

          </View>

          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.success}
          />

        </View>


        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setLocationConfirmed(true)}
        >

          <Ionicons
            name="locate-outline"
            size={18}
            color={colors.accent}
          />

          <Text style={styles.refreshText}>
            USE MY CURRENT LOCATION
          </Text>

        </TouchableOpacity>


        <View style={styles.safetyCard}>

          <View style={styles.safetyIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.success}
            />
          </View>

          <View style={styles.safetyInfo}>

            <Text style={styles.safetyTitle}>
              Your location is private
            </Text>

            <Text style={styles.safetyText}>
              Your location is shared only with the
              mechanic assigned to this request.
            </Text>

          </View>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >

          <Text style={styles.continueText}>
            FIND A MECHANIC
          </Text>

          <View style={styles.arrow}>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.white}
            />
          </View>

        </TouchableOpacity>

      </View>

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

  headerInfo: {
    flex: 1,
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

  stepBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  stepNumber: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.accent,
  },

  stepTotal: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  mapCard: {
    height: 260,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },

  mapBackground: {
    flex: 1,
    backgroundColor: colors.mapBackground,
    position: 'relative',
  },

  roadOne: {
    position: 'absolute',
    width: 420,
    height: 34,
    backgroundColor: colors.mapRoad,
    transform: [{ rotate: '-25deg' }],
    top: 95,
    left: -70,
  },

  roadTwo: {
    position: 'absolute',
    width: 360,
    height: 26,
    backgroundColor: colors.mapRoad,
    transform: [{ rotate: '38deg' }],
    top: 125,
    left: 70,
  },

  roadThree: {
    position: 'absolute',
    width: 350,
    height: 18,
    backgroundColor: colors.mapRoad,
    transform: [{ rotate: '-55deg' }],
    top: 50,
    left: 30,
  },

  locationPin: {
    position: 'absolute',
    top: '40%',
    left: '44%',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#2563EB25',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinInner: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapLabel: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  mapLabelText: {
    fontFamily: 'InterMedium',
    fontSize: 10,
    color: colors.text,
  },

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

  locationCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  locationInfo: {
    flex: 1,
  },

  locationLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  locationTitle: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.text,
    marginTop: 3,
  },

  locationAddress: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },

  refreshButton: {
    height: 47,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  refreshText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.accent,
  },

  safetyCard: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 13,
    marginTop: 20,
    flexDirection: 'row',
  },

  safetyIcon: {
    width: 39,
    height: 39,
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

  continueText: {
    flex: 1,
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },

  arrow: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});