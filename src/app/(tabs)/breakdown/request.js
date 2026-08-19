import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    useRouter,
} from 'expo-router';

import colors from '../../../constants/colors';

import {
    apiRequest,
} from '../../../services/api';


// =========================================================
// SERVICE TYPES
// =========================================================

const SERVICES = [
  {
    key: 'BATTERY',
    title: 'Battery',
    subtitle: 'Battery problem',
    icon: 'battery-half-outline',
    color: colors.serviceBattery,
    background: colors.warningLight,
  },
  {
    key: 'BREAKDOWN',
    title: 'Engine',
    subtitle: 'Engine breakdown',
    icon: 'construct-outline',
    color: colors.serviceEngine,
    background: '#F3E8FF',
  },
  {
    key: 'TYRE',
    title: 'Tyre',
    subtitle: 'Tyre issue',
    icon: 'ellipse-outline',
    color: colors.serviceTyre,
    background: colors.borderLight,
  },
  {
    key: 'FUEL',
    title: 'Fuel',
    subtitle: 'Fuel assistance',
    icon: 'flame-outline',
    color: colors.serviceFuel,
    background: '#FFEDD5',
  },
  {
    key: 'ELECTRICAL',
    title: 'Electrical',
    subtitle: 'Electrical issue',
    icon: 'flash-outline',
    color: colors.serviceElectrical,
    background: colors.accentLight,
  },
  {
    key: 'OTHER',
    title: 'Other',
    subtitle: 'Other assistance',
    icon: 'ellipsis-horizontal-circle-outline',
    color: colors.serviceOther,
    background: colors.borderLight,
  },
];


// =========================================================
// VEHICLE API
// =========================================================

async function getMyVehicles() {
  return apiRequest(
    '/api/v1/vehicles/my',
    {
      method: 'GET',
    }
  );
}


// =========================================================
// CREATE REQUEST API
// =========================================================

async function createRequest(payload) {
  return apiRequest(
    '/api/v1/requests',
    {
      method: 'POST',
      body: payload,
    }
  );
}


// =========================================================
// VEHICLE DISPLAY
// =========================================================

function getVehicleTitle(vehicle) {

  const manufacturer =
    vehicle?.manufacturer || '';

  const model =
    vehicle?.model || '';

  const combined =
    `${manufacturer} ${model}`.trim();

  return combined ||
    vehicle?.vehicleType ||
    'Vehicle';
}


function getVehicleSubtitle(vehicle) {

  if (
    vehicle?.registrationNumber
  ) {
    return vehicle.registrationNumber;
  }

  return vehicle?.vehicleType ||
    'Vehicle details';
}


// =========================================================
// SCREEN
// =========================================================

export default function RequestAssistanceScreen() {

  const router =
    useRouter();


  // =======================================================
  // STATE
  // =======================================================

  const [
    vehicles,
    setVehicles,
  ] = useState([]);

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState(null);

  const [
    selectedService,
    setSelectedService,
  ] = useState(null);

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    loadingVehicles,
    setLoadingVehicles,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(null);


  // =======================================================
  // LOAD VEHICLES
  // =======================================================

  const loadVehicles =
    useCallback(
      async () => {

        try {

          setLoadingVehicles(true);

          setError(null);

          const response =
            await getMyVehicles();

          console.log(
            '[Truck Assist] My vehicles:',
            response
          );

          const list =
            Array.isArray(response)
              ? response
              : [];

          setVehicles(list);


          // Select primary vehicle automatically
          const primaryVehicle =
            list.find(
              (vehicle) =>
                vehicle?.primary === true &&
                vehicle?.status !== 'INACTIVE'
            );


          if (primaryVehicle) {

            setSelectedVehicle(
              primaryVehicle
            );

          } else if (list.length > 0) {

            // Otherwise select first active vehicle
            const activeVehicle =
              list.find(
                (vehicle) =>
                  vehicle?.status !== 'INACTIVE'
              );

            setSelectedVehicle(
              activeVehicle ||
              list[0]
            );
          }

        } catch (err) {

          console.error(
            'Unable to load vehicles:',
            err
          );

          setError(
            err?.message ||
            'Unable to load your vehicles'
          );

        } finally {

          setLoadingVehicles(false);
        }

      },
      []
    );


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadVehicles();

  }, [
    loadVehicles,
  ]);


  // =======================================================
  // SELECT VEHICLE
  // =======================================================

  const handleVehicleSelect =
    (vehicle) => {

      setSelectedVehicle(
        vehicle
      );
    };


  // =======================================================
  // SELECT SERVICE
  // =======================================================

  const handleServiceSelect =
    (service) => {

      setSelectedService(
        service
      );
    };


  // =======================================================
  // SUBMIT REQUEST
  // =======================================================

  const handleSubmit =
    async () => {

      if (submitting) {
        return;
      }


      // -----------------------------------------------------
      // VALIDATE VEHICLE
      // -----------------------------------------------------

      if (!selectedVehicle?.id) {

        Alert.alert(
          'Vehicle Required',
          'Please select a vehicle before requesting assistance.'
        );

        return;
      }


      // -----------------------------------------------------
      // VALIDATE SERVICE
      // -----------------------------------------------------

      if (!selectedService) {

        Alert.alert(
          'Service Required',
          'Please select the type of assistance you need.'
        );

        return;
      }


      try {

        setSubmitting(true);

        setError(null);


        // ---------------------------------------------------
        // REQUEST PAYLOAD
        // ---------------------------------------------------

        const payload = {
          vehicleId:
            selectedVehicle.id,

          category:
            selectedService.key,

          description:
            description.trim() ||
            null,

          // Location will be added
          // once we integrate
          // expo-location.
          latitude:
            null,

          longitude:
            null,

          address:
            null,
        };


        console.log(
          '[Truck Assist] Creating service request:',
          payload
        );


        // ---------------------------------------------------
        // CREATE
        // ---------------------------------------------------

        const response =
          await createRequest(
            payload
          );


        console.log(
          '[Truck Assist] Service request created:',
          response
        );


        // ---------------------------------------------------
        // OPEN REQUEST DETAILS
        // ---------------------------------------------------

        if (response?.id) {

          router.replace(
            `/requests/${response.id}`
          );

          return;
        }


        // ---------------------------------------------------
        // FALLBACK
        // ---------------------------------------------------

        Alert.alert(
          'Request Created',
          'Your assistance request has been created.'
        );

        router.replace(
          '/requests'
        );

      } catch (err) {

        console.error(
          'Unable to create service request:',
          err
        );

        const message =
          err?.message ||
          'Unable to create your service request. Please try again.';

        setError(
          message
        );

        Alert.alert(
          'Request Failed',
          message
        );

      } finally {

        setSubmitting(false);
      }
    };


  // =======================================================
  // LOADING VEHICLES
  // =======================================================

  if (loadingVehicles) {

    return (

      <View
        style={styles.container}
      >

        <Header
          router={router}
        />

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
            Loading your vehicles...
          </Text>

        </View>

      </View>
    );
  }


  // =======================================================
  // NO VEHICLES
  // =======================================================

  if (
    !loadingVehicles &&
    vehicles.length === 0
  ) {

    return (

      <View
        style={styles.container}
      >

        <Header
          router={router}
        />


        <View
          style={styles.emptyContainer}
        >

          <View
            style={styles.emptyIcon}
          >

            <Ionicons
              name="car-outline"
              size={38}
              color={colors.accent}
            />

          </View>


          <Text
            style={styles.emptyTitle}
          >
            Add a vehicle first
          </Text>


          <Text
            style={styles.emptyText}
          >
            You need to add at least one vehicle before requesting roadside assistance.
          </Text>


          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push(
                '/(tabs)/vehicle'
              )
            }
          >

            <Ionicons
              name="add-circle-outline"
              size={19}
              color={colors.white}
            />

            <Text
              style={styles.primaryButtonText}
            >
              ADD VEHICLE
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    );
  }


  // =======================================================
  // MAIN SCREEN
  // =======================================================

  return (

    <View
      style={styles.container}
    >

      <Header
        router={router}
      />


      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.content
          }
        >

          {/* =================================================
              INTRO
              ================================================= */}

          <View
            style={styles.intro}
          >

            <View
              style={styles.introIcon}
            >

              <Ionicons
                name="construct-outline"
                size={26}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.introInfo}
            >

              <Text
                style={styles.introTitle}
              >
                Request Assistance
              </Text>


              <Text
                style={styles.introSubtitle}
              >
                Tell us what is wrong and we will help you.
              </Text>

            </View>

          </View>


          {/* =================================================
              VEHICLE
              ================================================= */}

          <Text
            style={styles.sectionLabel}
          >
            YOUR VEHICLE
          </Text>


          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              styles.vehicleList
            }
          >

            {vehicles.map(
              (vehicle) => {

                const isSelected =
                  selectedVehicle?.id ===
                  vehicle?.id;

                return (

                  <TouchableOpacity
                    key={
                      vehicle.id
                    }
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


                    <View
                      style={styles.vehicleInfo}
                    >

                      <Text
                        style={styles.vehicleTitle}
                        numberOfLines={1}
                      >
                        {getVehicleTitle(
                          vehicle
                        )}
                      </Text>


                      <Text
                        style={styles.vehicleSubtitle}
                        numberOfLines={1}
                      >
                        {getVehicleSubtitle(
                          vehicle
                        )}
                      </Text>


                      {vehicle?.primary && (

                        <View
                          style={styles.primaryBadge}
                        >

                          <Text
                            style={styles.primaryBadgeText}
                          >
                            PRIMARY
                          </Text>

                        </View>

                      )}

                    </View>


                    {isSelected && (

                      <View
                        style={styles.selectedCheck}
                      >

                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.accent}
                        />

                      </View>

                    )}

                  </TouchableOpacity>

                );
              }
            )}

          </ScrollView>


          {/* =================================================
              SERVICE TYPE
              ================================================= */}

          <Text
            style={styles.sectionLabel}
          >
            WHAT DO YOU NEED HELP WITH?
          </Text>


          <View
            style={styles.serviceGrid}
          >

            {SERVICES.map(
              (service) => {

                const isSelected =
                  selectedService?.key ===
                  service.key;

                return (

                  <TouchableOpacity
                    key={
                      service.key
                    }
                    activeOpacity={0.85}
                    style={[
                      styles.serviceCard,
                      isSelected &&
                        styles.serviceCardSelected,
                      isSelected && {
                        borderColor:
                          service.color,
                      },
                    ]}
                    onPress={() =>
                      handleServiceSelect(
                        service
                      )
                    }
                  >

                    <View
                      style={[
                        styles.serviceIcon,
                        {
                          backgroundColor:
                            service.background,
                        },
                        isSelected && {
                          backgroundColor:
                            service.color,
                        },
                      ]}
                    >

                      <Ionicons
                        name={
                          service.icon
                        }
                        size={23}
                        color={
                          isSelected
                            ? colors.white
                            : service.color
                        }
                      />

                    </View>


                    <Text
                      style={styles.serviceTitle}
                    >
                      {service.title}
                    </Text>


                    <Text
                      style={styles.serviceSubtitle}
                      numberOfLines={1}
                    >
                      {service.subtitle}
                    </Text>


                    {isSelected && (

                      <View
                        style={styles.serviceCheck}
                      >

                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={colors.white}
                        />

                      </View>

                    )}

                  </TouchableOpacity>

                );
              }
            )}

          </View>


          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <Text
            style={styles.sectionLabel}
          >
            DESCRIBE THE PROBLEM
          </Text>


          <View
            style={styles.descriptionCard}
          >

            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.accent}
              style={styles.descriptionIcon}
            />


            <TextInput
              style={styles.descriptionInput}
              placeholder="Tell us what happened..."
              placeholderTextColor={
                colors.textLight
              }
              value={description}
              onChangeText={
                setDescription
              }
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

          </View>


          <Text
            style={styles.characterCount}
          >
            {description.length}/500
          </Text>


          {/* =================================================
              LOCATION
              ================================================= */}

          <Text
            style={styles.sectionLabel}
          >
            YOUR LOCATION
          </Text>


          <View
            style={styles.locationCard}
          >

            <View
              style={styles.locationIcon}
            >

              <Ionicons
                name="location-outline"
                size={22}
                color={colors.accent}
              />

            </View>


            <View
              style={styles.locationInfo}
            >

              <Text
                style={styles.locationTitle}
              >
                Location will be captured next
              </Text>


              <Text
                style={styles.locationSubtitle}
              >
                Your request can be created now. We will integrate live GPS location in the next step.
              </Text>

            </View>

          </View>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <View
              style={styles.errorCard}
            >

              <Ionicons
                name="alert-circle-outline"
                size={19}
                color={colors.danger}
              />

              <Text
                style={styles.errorText}
              >
                {error}
              </Text>

            </View>

          )}


          {/* =================================================
              SUBMIT
              ================================================= */}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={submitting}
            style={[
              styles.submitButton,
              submitting &&
                styles.submitButtonDisabled,
            ]}
            onPress={
              handleSubmit
            }
          >

            {submitting ? (

              <ActivityIndicator
                size="small"
                color={colors.white}
              />

            ) : (

              <Ionicons
                name="navigate-outline"
                size={20}
                color={colors.white}
              />

            )}


            <Text
              style={styles.submitButtonText}
            >
              {submitting
                ? 'CREATING REQUEST...'
                : 'REQUEST ASSISTANCE'}
            </Text>

          </TouchableOpacity>


          <Text
            style={styles.footerText}
          >
            A nearby mechanic will be assigned based on availability.
          </Text>


          <View
            style={styles.bottomSpace}
          />

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
}


// =========================================================
// HEADER
// =========================================================

function Header({
  router,
}) {

  return (

    <View
      style={styles.header}
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
          size={21}
          color={colors.text}
        />

      </TouchableOpacity>


      <View
        style={styles.headerInfo}
      >

        <Text
          style={styles.headerTitle}
        >
          Roadside Assistance
        </Text>


        <Text
          style={styles.headerSubtitle}
        >
          Get help when you need it
        </Text>

      </View>


      <View
        style={styles.headerIcon}
      >

        <Ionicons
          name="shield-checkmark-outline"
          size={20}
          color={colors.accent}
        />

      </View>

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


  keyboardContainer: {
    flex: 1,
  },


  // =======================================================
  // HEADER
  // =======================================================

  header: {
    minHeight: 76,

    paddingHorizontal: 20,

    paddingTop: 16,

    paddingBottom: 12,

    backgroundColor:
      colors.white,

    borderBottomWidth: 1,

    borderBottomColor:
      colors.borderLight,

    flexDirection: 'row',

    alignItems: 'center',
  },

  backButton: {
    width: 43,

    height: 43,

    borderRadius: 14,

    backgroundColor:
      colors.background,

    borderWidth: 1,

    borderColor:
      colors.border,

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

    color:
      colors.text,
  },

  headerSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 10,

    color:
      colors.textMuted,

    marginTop: 3,
  },

  headerIcon: {
    width: 40,

    height: 40,

    borderRadius: 13,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',
  },


  // =======================================================
  // CONTENT
  // =======================================================

  content: {
    padding: 20,

    paddingBottom: 40,
  },


  // =======================================================
  // INTRO
  // =======================================================

  intro: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 4,

    marginBottom: 22,
  },

  introIcon: {
    width: 52,

    height: 52,

    borderRadius: 17,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 12,
  },

  introInfo: {
    flex: 1,
  },

  introTitle: {
    fontFamily: 'InterExtraBold',

    fontSize: 20,

    color:
      colors.text,
  },

  introSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 11,

    color:
      colors.textSecondary,

    marginTop: 4,

    lineHeight: 17,
  },


  // =======================================================
  // SECTION LABEL
  // =======================================================

  sectionLabel: {
    fontFamily: 'InterBold',

    fontSize: 10,

    letterSpacing: 0.8,

    color:
      colors.textMuted,

    marginTop: 4,

    marginBottom: 9,
  },


  // =======================================================
  // VEHICLES
  // =======================================================

  vehicleList: {
    paddingBottom: 4,

    paddingRight: 5,
  },

  vehicleCard: {
    width: 245,

    minHeight: 92,

    backgroundColor:
      colors.white,

    borderRadius: 18,

    borderWidth: 1,

    borderColor:
      colors.borderLight,

    padding: 13,

    flexDirection: 'row',

    alignItems: 'center',

    marginRight: 10,

    position: 'relative',
  },

  vehicleCardSelected: {
    borderColor:
      colors.accent,

    backgroundColor:
      colors.accentLight,
  },

  vehicleIcon: {
    width: 48,

    height: 48,

    borderRadius: 15,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,
  },

  vehicleIconSelected: {
    backgroundColor:
      colors.accent,
  },

  vehicleInfo: {
    flex: 1,

    minWidth: 0,
  },

  vehicleTitle: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color:
      colors.text,
  },

  vehicleSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 10,

    color:
      colors.textMuted,

    marginTop: 4,
  },

  primaryBadge: {
    alignSelf: 'flex-start',

    backgroundColor:
      colors.successLight,

    borderRadius: 6,

    paddingHorizontal: 6,

    paddingVertical: 3,

    marginTop: 5,
  },

  primaryBadgeText: {
    fontFamily: 'InterBold',

    fontSize: 7,

    color:
      colors.success,

    letterSpacing: 0.4,
  },

  selectedCheck: {
    position: 'absolute',

    top: 9,

    right: 9,
  },


  // =======================================================
  // SERVICES
  // =======================================================

  serviceGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent:
      'space-between',

    marginBottom: 4,
  },

  serviceCard: {
    width: '31.5%',

    minHeight: 116,

    backgroundColor:
      colors.white,

    borderRadius: 16,

    borderWidth: 1,

    borderColor:
      colors.borderLight,

    padding: 10,

    marginBottom: 10,

    alignItems: 'center',

    justifyContent: 'center',

    position: 'relative',
  },

  serviceCardSelected: {
    backgroundColor:
      colors.white,

    borderWidth: 1.5,
  },

  serviceIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 8,
  },

  serviceTitle: {
    fontFamily: 'InterBold',

    fontSize: 11,

    color:
      colors.text,

    textAlign: 'center',
  },

  serviceSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 8,

    color:
      colors.textMuted,

    textAlign: 'center',

    marginTop: 3,
  },

  serviceCheck: {
    position: 'absolute',

    top: 7,

    right: 7,

    width: 18,

    height: 18,

    borderRadius: 9,

    backgroundColor:
      colors.accent,

    alignItems: 'center',

    justifyContent: 'center',
  },


  // =======================================================
  // DESCRIPTION
  // =======================================================

  descriptionCard: {
    minHeight: 115,

    backgroundColor:
      colors.white,

    borderRadius: 17,

    borderWidth: 1,

    borderColor:
      colors.border,

    padding: 13,

    flexDirection: 'row',

    alignItems: 'flex-start',
  },

  descriptionIcon: {
    marginTop: 2,

    marginRight: 9,
  },

  descriptionInput: {
    flex: 1,

    minHeight: 88,

    padding: 0,

    fontFamily: 'InterRegular',

    fontSize: 12,

    lineHeight: 19,

    color:
      colors.text,
  },

  characterCount: {
    fontFamily: 'InterRegular',

    fontSize: 9,

    color:
      colors.textLight,

    textAlign: 'right',

    marginTop: 5,

    marginBottom: 4,
  },


  // =======================================================
  // LOCATION
  // =======================================================

  locationCard: {
    backgroundColor:
      colors.white,

    borderRadius: 17,

    borderWidth: 1,

    borderColor:
      colors.borderLight,

    padding: 14,

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 6,
  },

  locationIcon: {
    width: 44,

    height: 44,

    borderRadius: 14,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 11,
  },

  locationInfo: {
    flex: 1,
  },

  locationTitle: {
    fontFamily: 'InterSemiBold',

    fontSize: 12,

    color:
      colors.text,
  },

  locationSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 9,

    color:
      colors.textMuted,

    lineHeight: 15,

    marginTop: 3,
  },


  // =======================================================
  // ERROR
  // =======================================================

  errorCard: {
    backgroundColor:
      colors.dangerLight,

    borderRadius: 13,

    padding: 12,

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 13,
  },

  errorText: {
    flex: 1,

    fontFamily: 'InterRegular',

    fontSize: 10,

    color:
      colors.danger,

    lineHeight: 16,

    marginLeft: 8,
  },


  // =======================================================
  // SUBMIT
  // =======================================================

  submitButton: {
    height: 53,

    borderRadius: 15,

    backgroundColor:
      colors.accent,

    marginTop: 18,

    alignItems: 'center',

    justifyContent: 'center',

    flexDirection: 'row',

    gap: 9,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitButtonText: {
    fontFamily: 'InterBold',

    fontSize: 11,

    color:
      colors.white,

    letterSpacing: 0.4,
  },

  footerText: {
    fontFamily: 'InterRegular',

    fontSize: 9,

    lineHeight: 14,

    color:
      colors.textMuted,

    textAlign: 'center',

    marginTop: 9,

    paddingHorizontal: 20,
  },


  // =======================================================
  // LOADING
  // =======================================================

  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingBottom: 80,
  },

  loadingText: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    marginTop: 11,
  },


  // =======================================================
  // EMPTY
  // =======================================================

  emptyContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 28,

    paddingBottom: 80,
  },

  emptyIcon: {
    width: 78,

    height: 78,

    borderRadius: 26,

    backgroundColor:
      colors.accentLight,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 18,
  },

  emptyTitle: {
    fontFamily: 'InterExtraBold',

    fontSize: 20,

    color:
      colors.text,

    textAlign: 'center',
  },

  emptyText: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color:
      colors.textMuted,

    lineHeight: 19,

    textAlign: 'center',

    marginTop: 8,

    maxWidth: 310,
  },

  primaryButton: {
    height: 50,

    paddingHorizontal: 22,

    borderRadius: 15,

    backgroundColor:
      colors.accent,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 8,

    marginTop: 22,
  },

  primaryButtonText: {
    fontFamily: 'InterBold',

    fontSize: 10,

    color:
      colors.white,

    letterSpacing: 0.4,
  },


  // =======================================================
  // BOTTOM
  // =======================================================

  bottomSpace: {
    height: 30,
  },

});
