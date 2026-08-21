import {
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import colors from '../constants/colors';


export default function RealLocationMap({
  location,
  mechanicLocation,
  mechanicName,
}) {

  if (!location) {
    return null;
  }


  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colors.mapBackground,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'relative',
      }}
    >

      {/* DRIVER */}

      <View
        style={{
          width: 62,
          height: 62,
          borderRadius: 31,
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
            backgroundColor:
              colors.accent,

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


      {/* MECHANIC */}

      {mechanicLocation && (

        <View
          style={{
            position: 'absolute',
            top: '42%',
            right: '30%',
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#16A34A25',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor:
                colors.success,

              alignItems: 'center',
              justifyContent: 'center',
            }}
          >

            <Ionicons
              name="construct"
              size={19}
              color={colors.white}
            />

          </View>

        </View>

      )}


      {/* CURRENT GPS */}

      <View
        style={{
          position: 'absolute',
          right: 14,
          bottom: 14,
          backgroundColor:
            colors.white,

          borderRadius: 11,

          paddingHorizontal: 10,
          paddingVertical: 8,

          borderWidth: 1,
          borderColor: colors.border,
        }}
      >

        <Text
          style={{
            fontFamily: 'InterBold',
            fontSize: 8,
            letterSpacing: 0.7,
            color: colors.textMuted,
          }}
        >
          CURRENT GPS
        </Text>


        <Text
          style={{
            fontFamily: 'InterSemiBold',
            fontSize: 10,
            color: colors.text,
            marginTop: 2,
          }}
        >
          {Number(location.latitude).toFixed(6)},
          {' '}
          {Number(location.longitude).toFixed(6)}
        </Text>


        {mechanicLocation && (

          <Text
            style={{
              fontFamily: 'InterRegular',
              fontSize: 9,
              color: colors.textSecondary,
              marginTop: 5,
            }}
          >
            🔧 {mechanicName || 'Mechanic'}
          </Text>

        )}

      </View>

    </View>
  );
}