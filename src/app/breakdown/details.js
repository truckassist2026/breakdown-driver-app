import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const type = params.type || 'battery';

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [description, setDescription] = useState('');

  const typeInfo = {
    battery: {
      title: 'Battery Assistance',
      icon: 'battery-half-outline',
      color: colors.serviceBattery,
      placeholder: 'Example: Vehicle is not starting...',
    },
    tyre: {
      title: 'Tyre Assistance',
      icon: 'disc-outline',
      color: colors.serviceTyre,
      placeholder: 'Example: Front tyre is flat...',
    },
    fuel: {
      title: 'Fuel Assistance',
      icon: 'water-outline',
      color: colors.serviceFuel,
      placeholder: 'Example: Vehicle ran out of fuel...',
    },
    engine: {
      title: 'Engine Assistance',
      icon: 'construct-outline',
      color: colors.serviceEngine,
      placeholder: 'Example: Engine stopped suddenly...',
    },
    electrical: {
      title: 'Electrical Assistance',
      icon: 'flash-outline',
      color: colors.serviceElectrical,
      placeholder: 'Example: Lights and electrical system not working...',
    },
    other: {
      title: 'Other Assistance',
      icon: 'help-circle-outline',
      color: colors.serviceOther,
      placeholder: 'Describe what happened...',
    },
  };

  const selected = typeInfo[type] || typeInfo.battery;

  const handleContinue = () => {
    router.push({
      pathname: '/breakdown/location',
      params: {
        type,
        vehicleNumber,
        description,
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
          <Text style={styles.headerTitle}>
            Breakdown Details
          </Text>

          <Text style={styles.headerSubtitle}>
            Tell us a little more
          </Text>
        </View>

        <View style={styles.stepBadge}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepTotal}>/ 4</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <View style={styles.selectedCard}>

          <View
            style={[
              styles.selectedIcon,
              { backgroundColor: `${selected.color}18` },
            ]}
          >
            <Ionicons
              name={selected.icon}
              size={27}
              color={selected.color}
            />
          </View>

          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>
              SELECTED ISSUE
            </Text>

            <Text style={styles.selectedTitle}>
              {selected.title}
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.success}
          />

        </View>


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Vehicle details
          </Text>

          <Text style={styles.sectionSubtitle}>
            Help the mechanic identify your vehicle
          </Text>
        </View>


        <View style={styles.fieldCard}>

          <Text style={styles.label}>
            VEHICLE NUMBER
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="car-outline"
              size={20}
              color={colors.textMuted}
            />

            <TextInput
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholder="TN 01 AB 1234"
              placeholderTextColor={colors.textLight}
              autoCapitalize="characters"
              style={styles.input}
            />

          </View>

          <Text style={styles.helper}>
            Example: TN 01 AB 1234
          </Text>

        </View>


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            What happened?
          </Text>

          <Text style={styles.sectionSubtitle}>
            Describe the problem if you can
          </Text>
        </View>


        <View style={styles.textAreaCard}>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={selected.placeholder}
            placeholderTextColor={colors.textLight}
            multiline
            textAlignVertical="top"
            style={styles.textArea}
            maxLength={500}
          />

          <Text style={styles.counter}>
            {description.length}/500
          </Text>

        </View>


        <View style={styles.tipCard}>

          <View style={styles.tipIcon}>
            <Ionicons
              name="bulb-outline"
              size={19}
              color={colors.warning}
            />
          </View>

          <View style={styles.tipInfo}>
            <Text style={styles.tipTitle}>
              Helpful information
            </Text>

            <Text style={styles.tipText}>
              Mention warning lights, unusual sounds,
              smoke or anything else you noticed.
            </Text>
          </View>

        </View>

      </ScrollView>


      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>
            CONFIRM DETAILS
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

  selectedCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  selectedIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  selectedInfo: {
    flex: 1,
  },

  selectedLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  selectedTitle: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
    marginTop: 3,
  },

  sectionHeader: {
    marginBottom: 11,
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

  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 24,
  },

  label: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.textMuted,
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  input: {
    flex: 1,
    fontFamily: 'InterMedium',
    fontSize: 13,
    color: colors.text,
    marginLeft: 9,
  },

  helper: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textLight,
    marginTop: 6,
  },

  textAreaCard: {
    height: 125,
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 13,
    marginBottom: 20,
  },

  textArea: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
  },

  counter: {
    alignSelf: 'flex-end',
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textLight,
  },

  tipCard: {
    backgroundColor: colors.warningLight,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
  },

  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  tipInfo: {
    flex: 1,
  },

  tipTitle: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: colors.text,
  },

  tipText: {
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