import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import colors from '../constants/colors';


export default function RealLocationMap({
  location,
  locationAddress,
  mechanicLocation,
  mechanicName,
  mapRef,
}) {

  if (!location) {
    return null;
  }


  const driverLatitude =
    Number(location.latitude);

  const driverLongitude =
    Number(location.longitude);


  const hasMechanicLocation =
    mechanicLocation &&
    Number.isFinite(
      Number(mechanicLocation.latitude)
    ) &&
    Number.isFinite(
      Number(mechanicLocation.longitude)
    );


  const mechanicLatitude =
    hasMechanicLocation
      ? Number(mechanicLocation.latitude)
      : null;


  const mechanicLongitude =
    hasMechanicLocation
      ? Number(mechanicLocation.longitude)
      : null;


  return (
    <MapView

      ref={mapRef}

      style={styles.map}

      provider={PROVIDER_GOOGLE}

      initialRegion={{
        latitude:
          driverLatitude,

        longitude:
          driverLongitude,

        latitudeDelta:
          0.008,

        longitudeDelta:
          0.008,
      }}

      showsUserLocation={false}

      showsMyLocationButton

      showsCompass

      loadingEnabled

      toolbarEnabled

      rotateEnabled

      pitchEnabled

      zoomEnabled
    >

      {/* =================================================
          DRIVER LOCATION
      ================================================= */}

      <Marker

        coordinate={{
          latitude:
            driverLatitude,

          longitude:
            driverLongitude,
        }}

        title="Your location"

        description={
          locationAddress ||
          'Current GPS location'
        }
      >

        <View
          style={styles.driverMarkerOuter}
        >

          <View
            style={styles.driverMarker}
          >

            <Ionicons
              name="location"
              size={24}
              color={colors.white}
            />

          </View>

        </View>

      </Marker>


      {/* =================================================
          MECHANIC LOCATION
      ================================================= */}

      {hasMechanicLocation && (

        <Marker

          coordinate={{
            latitude:
              mechanicLatitude,

            longitude:
              mechanicLongitude,
          }}

          title={
            mechanicName ||
            'Assigned Mechanic'
          }

          description="Your mechanic"
        >

          <View
            style={styles.mechanicMarkerOuter}
          >

            <View
              style={styles.mechanicMarker}
            >

              <Ionicons
                name="construct"
                size={21}
                color={colors.white}
              />

            </View>

          </View>

        </Marker>

      )}

    </MapView>
  );
}


const styles = StyleSheet.create({

  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


  // =====================================================
  // DRIVER MARKER
  // =====================================================

  driverMarkerOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB25',
    alignItems: 'center',
    justifyContent: 'center',
  },


  driverMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // =====================================================
  // MECHANIC MARKER
  // =====================================================

  mechanicMarkerOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16A34A25',
    alignItems: 'center',
    justifyContent: 'center',
  },


  mechanicMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },

});