import { useEffect } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import colors from '../../constants/colors';

export default function SearchingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/breakdown/found',
        params: {
          type: params.type || 'battery',
          vehicleNumber: params.vehicleNumber || '',
        },
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

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
          active
        />

        <View style={styles.line} />

        <Status
          icon="construct-outline"
          title="Assigning a mechanic"
        />

      </View>


      <Text style={styles.footer}>
        This usually takes less than a minute.
      </Text>


      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.replace('/')}
      >

        <Text style={styles.cancelText}>
          CANCEL REQUEST
        </Text>

      </TouchableOpacity>

    </View>
  );
}

function Status({ icon, title, active }) {
  return (
    <View style={styles.statusRow}>

      <View
        style={[
          styles.statusIcon,
          active && styles.statusIconActive,
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
          active && styles.statusTextActive,
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

  cancelText: {
    fontFamily: 'InterBold',
    fontSize: 11,
    color: colors.danger,
  },
});