
import MapView, {
    Marker,
    PROVIDER_GOOGLE,
} from 'react-native-maps';

import {
    View,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

import colors from '../constants/colors';

export default function RealLocationMap({
  location,
  locationAddress,
  mapRef,
}) {

  if (!location) {
    return null;
  }

  return (
    <MapView
      ref={mapRef}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
      }}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      }}
      showsUserLocation
      showsMyLocationButton
      showsCompass
      loadingEnabled
      toolbarEnabled
      rotateEnabled
      pitchEnabled
      zoomEnabled
    >

      <Marker
        coordinate={{
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        }}
        title="Your location"
        description={
          locationAddress ||
          'Current GPS location'
        }
      >

        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#2563EB25',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

            <Ionicons
              name="location"
              size={24}
              color={colors.white}
            />

          </View>

        </View>

      </Marker>

    </MapView>
  );
}