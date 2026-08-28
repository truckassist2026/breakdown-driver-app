import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
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

import colors from '../../../constants/colors';

import {
  getServiceCategories,
} from '../../../services/serviceCategoryService';

import {
  getMyVehicles,
} from '../../../services/vehicleService';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // =====================================================
  // ROUTE PARAMETERS
  // =====================================================

  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId || '';

  const categoryCode = Array.isArray(params.categoryCode)
    ? params.categoryCode[0]
    : params.categoryCode || '';

  const quick = Array.isArray(params.quick)
    ? params.quick[0]
    : params.quick || '';

  // =====================================================
  // STATE
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    // Quick Assistance can open this screen repeatedly with
    // different categoryCode values (Tyre -> Battery -> Fuel).
    // Reload whenever the route selection changes so the previous
    // assistance is never retained.
    setSelectedCategory(null);
    setSelectedVehicle(null);
    setDescription('');
    setError('');

    loadData();
  }, [categoryId, categoryCode, quick]);

  async function loadData() {
    try {
      setLoading(true);
      setVehicleLoading(true);
      setError('');

      const [
        categoryResponse,
        vehicleResponse,
      ] = await Promise.all([
        getServiceCategories(),
        getMyVehicles(),
      ]);

      // =================================================
      // CATEGORY
      // =================================================

      const categories = Array.isArray(categoryResponse)
        ? categoryResponse
        : [];

      let category = null;

      // Quick Assistance is driven by categoryCode.
      // Prefer the current code so an older categoryId cannot win.
      if (categoryCode) {
        category = categories.find(
          item =>
            String(item.code).toUpperCase() ===
            String(categoryCode).toUpperCase()
        );
      }

      if (!category && categoryId) {
        category = categories.find(
          item =>
            String(item.id) ===
            String(categoryId)
        );
      }

      if (!category && categoryCode) {
        category = categories.find(
          item =>
            String(item.code).toUpperCase() ===
            String(categoryCode).toUpperCase()
        );
      }

      if (!category) {
        throw new Error(
          quick === 'true'
            ? 'The selected quick assistance could not be found.'
            : 'The selected assistance could not be found.'
        );
      }

      setSelectedCategory(category);

      // =================================================
      // VEHICLES
      // =================================================

      const vehicleList = Array.isArray(vehicleResponse)
        ? vehicleResponse
        : [];

      setVehicles(vehicleList);

      // Automatically select if only one vehicle exists
      if (vehicleList.length === 1) {
        setSelectedVehicle(vehicleList[0]);
      }
    } catch (err) {
      console.error(
        '[Breakdown Details] Load error:',
        err
      );

      setError(
        err?.message ||
        'Unable to load request details.'
      );
    } finally {
      setLoading(false);
      setVehicleLoading(false);
    }
  }

  // =====================================================
  // VEHICLE SELECTION
  // =====================================================

  function handleVehicleSelect(vehicle) {
    setSelectedVehicle(vehicle);
    setError('');
  }

  // =====================================================
  // CONTINUE
  // =====================================================

  function handleContinue() {
    if (!selectedCategory) {
      setError(
        'Please select an assistance type.'
      );
      return;
    }

    if (!selectedVehicle) {
      setError(
        'Please select a vehicle.'
      );
      return;
    }

    const vehicleId =
      selectedVehicle.id;

    const vehicleNumber =
      selectedVehicle.registrationNumber ||
      selectedVehicle.vehicleNumber ||
      selectedVehicle.registration_number ||
      '';

    setSubmitting(true);

    router.push({
      pathname: '/breakdown/location',

      params: {
        categoryId:
          selectedCategory.id || '',

        categoryCode:
          selectedCategory.code || '',

        categoryName:
          selectedCategory.name || '',

        categoryIcon:
          selectedCategory.icon || '',

        vehicleId:
          vehicleId || '',

        vehicleNumber:
          vehicleNumber || '',

        description:
          description.trim(),

        quick:
          quick === 'true' ? 'true' : 'false',
      },
    });

    setTimeout(() => {
      setSubmitting(false);
    }, 500);
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text style={styles.loadingText}>
          Loading request details...
        </Text>
      </View>
    );
  }

  // =====================================================
  // CATEGORY ERROR
  // =====================================================

  if (error && !selectedCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Tell us more
            </Text>

            <Text style={styles.subtitle}>
              Request details
            </Text>
          </View>
        </View>

        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={colors.danger}
            />
          </View>

          <Text style={styles.errorTitle}>
            Assistance not selected
          </Text>

          <Text style={styles.errorMessage}>
            We could not determine the assistance
            type. Please select the assistance again.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              router.replace(
                '/breakdown/category'
              )
            }
          >
            <Text style={styles.retryText}>
              SELECT ASSISTANCE
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =====================================================
  // CATEGORY DISPLAY
  // =====================================================

  const categoryName =
    selectedCategory?.name ||
    'Assistance';

  const categoryDescription =
    selectedCategory?.description ||
    'Tell us about the problem.';

  const categoryIcon =
    selectedCategory?.icon ||
    'construct-outline';

  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Tell us more
          </Text>

          <Text style={styles.subtitle}>
            Provide a few details about your request
          </Text>
        </View>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* =================================================
            SELECTED ASSISTANCE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            SELECTED ASSISTANCE
          </Text>

          <View style={styles.assistanceCard}>
            <View style={styles.assistanceIcon}>
              <Ionicons
                name={categoryIcon}
                size={25}
                color={colors.accent}
              />
            </View>

            <View style={styles.assistanceInfo}>
              <Text style={styles.assistanceTitle}>
                {categoryName}
              </Text>

              <Text style={styles.assistanceDescription}>
                {categoryDescription}
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={21}
              color={colors.success}
            />
          </View>
        </View>

        {/* =================================================
            VEHICLE
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            VEHICLE
          </Text>

          <Text style={styles.sectionHint}>
            Select the vehicle that needs assistance
          </Text>

          {vehicleLoading ? (
            <View style={styles.vehicleLoading}>
              <ActivityIndicator
                size="small"
                color={colors.accent}
              />

              <Text style={styles.vehicleLoadingText}>
                Loading vehicles...
              </Text>
            </View>
          ) : vehicles.length === 0 ? (
            <View style={styles.emptyVehicleCard}>
              <Ionicons
                name="car-outline"
                size={28}
                color={colors.textMuted}
              />

              <Text style={styles.emptyVehicleTitle}>
                No vehicle found
              </Text>

              <Text style={styles.emptyVehicleText}>
                Please add a vehicle before requesting
                roadside assistance.
              </Text>
            </View>
          ) : (
            vehicles.map(vehicle => {
              const vehicleId =
                vehicle.id;

              const registrationNumber =
                vehicle.registrationNumber ||
                vehicle.vehicleNumber ||
                vehicle.registration_number ||
                'Vehicle';

              const isSelected =
                selectedVehicle?.id ===
                vehicleId;

              return (
                <TouchableOpacity
                  key={vehicleId}
                  activeOpacity={0.85}
                  style={[
                    styles.vehicleCard,
                    isSelected &&
                      styles.vehicleCardSelected,
                  ]}
                  onPress={() =>
                    handleVehicleSelect(
                      vehicle
                    )
                  }
                >
                  <View
                    style={[
                      styles.vehicleIcon,
                      isSelected &&
                        styles.vehicleIconSelected,
                    ]}
                  >
                    <Ionicons
                      name="car-outline"
                      size={24}
                      color={
                        isSelected
                          ? colors.white
                          : colors.accent
                      }
                    />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleLabel}>
                      REGISTRATION NUMBER
                    </Text>

                    <Text style={styles.vehicleNumber}>
                      {registrationNumber}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      isSelected &&
                        styles.radioSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.white}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            WHAT'S HAPPENING?
          </Text>

          <Text style={styles.sectionHint}>
            Tell us a little more so the mechanic can
            understand the problem.
          </Text>

          <View style={styles.inputCard}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={`Example: ${categoryName} problem...`}
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              maxLength={1000}
              textAlignVertical="top"
              style={styles.input}
            />

            <Text style={styles.characterCount}>
              {description.length}/1000
            </Text>
          </View>
        </View>

        {/* =================================================
            INLINE ERROR
        ================================================= */}

        {error ? (
          <View style={styles.inlineError}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={colors.danger}
            />

            <Text style={styles.inlineErrorText}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.bottomSpace} />

      </ScrollView>

      {/* =================================================
          FOOTER
      ================================================= */}

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={
            !selectedVehicle ||
            submitting
          }
          style={[
            styles.continueButton,
            (
              !selectedVehicle ||
              submitting
            )
              ? styles.disabledButton
              : null,
          ]}
          onPress={handleContinue}
        >
          {submitting ? (
            <ActivityIndicator
              size="small"
              color={colors.white}
            />
          ) : (
            <>
              <Text style={styles.continueText}>
                CONTINUE
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={colors.white}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 22,
    color: colors.text,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  section: {
    marginBottom: 22,
  },

  sectionLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,
    letterSpacing: 0.7,
    color: colors.textMuted,
  },

  sectionHint: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 10,
    lineHeight: 16,
  },

  assistanceCard: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.5,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
  },

  assistanceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  assistanceInfo: {
    flex: 1,
  },

  assistanceTitle: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.text,
  },

  assistanceDescription: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },

  vehicleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  vehicleCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFF7ED',
  },

  vehicleIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  vehicleIconSelected: {
    backgroundColor: colors.accent,
  },

  vehicleInfo: {
    flex: 1,
  },

  vehicleLabel: {
    fontFamily: 'InterBold',
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textMuted,
  },

  vehicleNumber: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.text,
    marginTop: 4,
  },

  radio: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  vehicleLoading: {
    backgroundColor: colors.white,
    borderRadius: 18,
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  vehicleLoadingText: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 9,
  },

  emptyVehicleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyVehicleTitle: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: colors.text,
    marginTop: 9,
  },

  emptyVehicleText: {
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 17,
  },

  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  input: {
    minHeight: 130,
    padding: 15,
    fontFamily: 'InterRegular',
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },

  characterCount: {
    fontFamily: 'InterRegular',
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'right',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },

  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },

  inlineErrorText: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },

  continueButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  disabledButton: {
    backgroundColor: '#CBD5E1',
  },

  continueText: {
    fontFamily: 'InterBold',
    fontSize: 13,
    color: colors.white,
  },

  bottomSpace: {
    height: 20,
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    marginTop: 18,
    fontFamily: 'InterExtraBold',
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },

  errorMessage: {
    marginTop: 8,
    fontFamily: 'InterRegular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 20,
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 15,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  retryText: {
    fontFamily: 'InterBold',
    fontSize: 12,
    color: colors.white,
  },
});