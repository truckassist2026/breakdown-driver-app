import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
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

import {
  cancelServiceRequest,
  getServiceRequestById,
} from '../../../services/requestService';

export default function SearchingScreen() {

  const router = useRouter();

  const params =
    useLocalSearchParams();

  const [
    requestStatus,
    setRequestStatus,
  ] = useState('SEARCHING');

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const pollingRef =
    useRef(null);

  const mountedRef =
    useRef(true);


  // =====================================================
  // REQUEST ID
  // =====================================================

  const requestId =
    Array.isArray(params.requestId)
      ? params.requestId[0]
      : params.requestId || '';


  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {

    return () => {

      mountedRef.current =
        false;

      if (pollingRef.current) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current =
          null;
      }
    };

  }, []);


  // =====================================================
  // CHECK REQUEST
  // =====================================================

  const checkRequestStatus =
    async () => {

      if (!requestId) {

        if (mountedRef.current) {

          setErrorMessage(
            'Service request ID is missing.'
          );
        }

        return;
      }

      try {

        const request =
          await getServiceRequestById(
            requestId
          );

        if (
          !mountedRef.current
        ) {
          return;
        }

        console.log(
          '[Driver Request] Current request:',
          request
        );

        const status =
          request?.status || 'SEARCHING';

        setRequestStatus(
          status
        );


        // ===============================================
        // MECHANIC ASSIGNED
        // ===============================================

        if (
          status === 'ASSIGNED'
        ) {

          if (
            pollingRef.current
          ) {

            clearInterval(
              pollingRef.current
            );

            pollingRef.current =
              null;
          }

          router.replace({
            pathname:
              '/breakdown/found',

            params: {

              requestId:
                request.id,

              type:
                Array.isArray(
                  params.type
                )
                  ? params.type[0]
                  : params.type || '',

              apiCategory:
                Array.isArray(
                  params.apiCategory
                )
                  ? params.apiCategory[0]
                  : params.apiCategory || '',

              vehicleId:
                Array.isArray(
                  params.vehicleId
                )
                  ? params.vehicleId[0]
                  : params.vehicleId || '',

              vehicleNumber:
                Array.isArray(
                  params.vehicleNumber
                )
                  ? params.vehicleNumber[0]
                  : params.vehicleNumber || '',

              description:
                Array.isArray(
                  params.description
                )
                  ? params.description[0]
                  : params.description || '',

              assignedMechanicId:
                request.assignedMechanicId
                  || '',
            },
          });

          return;
        }


        // ===============================================
        // CANCELLED
        // ===============================================

        if (
          status === 'CANCELLED'
        ) {

          if (
            pollingRef.current
          ) {

            clearInterval(
              pollingRef.current
            );

            pollingRef.current =
              null;
          }

          router.replace(
            '/(tabs)/requests'
          );

          return;
        }


        // ===============================================
        // ERROR / TERMINAL STATES
        // ===============================================

        if (
          status === 'COMPLETED' ||
          status === 'PAID' ||
          status === 'RATED'
        ) {

          if (
            pollingRef.current
          ) {

            clearInterval(
              pollingRef.current
            );

            pollingRef.current =
              null;
          }

          router.replace(
            '/(tabs)/requests'
          );
        }

      } catch (error) {

        console.error(
          '[Driver Request] Status check failed:',
          error
        );

        if (
          mountedRef.current
        ) {

          setErrorMessage(
            error?.message ||
            'Unable to check request status.'
          );
        }
      }
    };


  // =====================================================
  // START POLLING
  // =====================================================

  useEffect(() => {

    if (!requestId) {

      setErrorMessage(
        'Service request ID is missing.'
      );

      return;
    }


    // Check immediately
    checkRequestStatus();


    // Then every 3 seconds
    pollingRef.current =
      setInterval(
        checkRequestStatus,
        3000
      );


    return () => {

      if (
        pollingRef.current
      ) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current =
          null;
      }
    };

  }, [requestId]);


  // =====================================================
  // CANCEL REQUEST
  // =====================================================

  const handleCancel =
    async () => {

      if (
        !requestId ||
        cancelling
      ) {
        return;
      }

      setCancelling(true);
      setErrorMessage('');


      try {

        await cancelServiceRequest(
          requestId
        );

        if (
          pollingRef.current
        ) {

          clearInterval(
            pollingRef.current
          );

          pollingRef.current =
            null;
        }

        router.replace(
          '/(tabs)/requests'
        );

      } catch (error) {

        console.error(
          '[Driver Request] Cancel failed:',
          error
        );

        setErrorMessage(
          error?.message ||
          'Unable to cancel the request.'
        );

        setCancelling(false);
      }
    };


  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.container}>

      {/* =================================================
          TOP
          ================================================= */}

      <View style={styles.top}>

        <View style={styles.logo}>

          <Ionicons
            name="construct"
            size={28}
            color={colors.white}
          />

        </View>


        <Text style={styles.title}>
          Finding a mechanic
        </Text>


        <Text style={styles.subtitle}>
          We're looking for the nearest available
          mechanic for you.
        </Text>

      </View>


      {/* =================================================
          SEARCH ANIMATION
          ================================================= */}

      <View style={styles.searchArea}>

        <View style={styles.outerCircle}>

          <View style={styles.middleCircle}>

            <View style={styles.innerCircle}>

              <Ionicons
                name="search"
                size={34}
                color={colors.white}
              />

            </View>

          </View>

        </View>


        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={styles.loader}
        />

      </View>


      {/* =================================================
          STATUS
          ================================================= */}

      <View style={styles.statusCard}>

        <Status
          icon="location-outline"
          title="Location confirmed"
          active
        />


        <View style={styles.line} />


        <Status
          icon="search-outline"
          title="Searching nearby mechanics"
          active={
            requestStatus ===
              'SEARCHING' ||
            requestStatus ===
              'CREATED'
          }
        />


        <View style={styles.line} />


        <Status
          icon="construct-outline"
          title="Assigning a mechanic"
          active={
            requestStatus ===
              'ASSIGNED'
          }
        />

      </View>


      {/* =================================================
          REQUEST STATUS
          ================================================= */}

      <Text style={styles.footer}>

        {requestStatus ===
        'ASSIGNED'
          ? 'Mechanic assigned.'
          : 'This usually takes less than a minute.'}

      </Text>


      {/* =================================================
          ERROR
          ================================================= */}

      {errorMessage ? (

        <View style={styles.errorCard}>

          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={colors.danger}
          />

          <Text style={styles.errorText}>
            {errorMessage}
          </Text>

        </View>

      ) : null}


      {/* =================================================
          CANCEL
          ================================================= */}

      <TouchableOpacity
        style={[
          styles.cancelButton,
          cancelling &&
            styles.cancelButtonDisabled,
        ]}
        onPress={handleCancel}
        disabled={cancelling}
      >

        {cancelling ? (

          <ActivityIndicator
            size="small"
            color={colors.danger}
          />

        ) : (

          <Text style={styles.cancelText}>
            CANCEL REQUEST
          </Text>

        )}

      </TouchableOpacity>

    </View>
  );
}


// =========================================================
// STATUS COMPONENT
// =========================================================

function Status({
  icon,
  title,
  active,
}) {

  return (
    <View style={styles.statusRow}>

      <View
        style={[
          styles.statusIcon,
          active &&
            styles.statusIconActive,
        ]}
      >

        <Ionicons
          name={icon}
          size={17}
          color={
            active
              ? colors.accent
              : colors.textLight
          }
        />

      </View>


      <Text
        style={[
          styles.statusText,
          active &&
            styles.statusTextActive,
        ]}
      >
        {title}
      </Text>


      {active && (

        <Ionicons
          name="checkmark-circle"
          size={17}
          color={colors.success}
        />

      )}

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
    padding: 20,
    justifyContent: 'space-between',
  },

  top: {
    alignItems: 'center',
    marginTop: 45,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 25,
    color: colors.text,
    marginTop: 20,
  },

  subtitle: {
    fontFamily: 'InterRegular',
    fontSize: 12,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 310,
    marginTop: 6,
  },

  searchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },

  outerCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#2563EB10',
    alignItems: 'center',
    justifyContent: 'center',
  },

  middleCircle: {
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor: '#2563EB18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader: {
    position: 'absolute',
    bottom: 15,
  },

  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 19,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  statusRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  statusIconActive: {
    backgroundColor: colors.accentLight,
  },

  statusText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 11,
    color: colors.textLight,
  },

  statusTextActive: {
    fontFamily: 'InterSemiBold',
    color: colors.text,
  },

  line: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 17,
  },

  footer: {
    fontFamily: 'InterRegular',
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },

  errorCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontFamily: 'InterRegular',
    fontSize: 10,
    lineHeight: 15,
    color: colors.danger,
  },

  cancelButton: {
    height: 49,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  cancelButtonDisabled: {
    opacity: 0.6,
  },

  cancelText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.danger,
  },

});