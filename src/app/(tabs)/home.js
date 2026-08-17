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

export default function HomeScreen() {
  const router = useRouter();

  const breakdownTypes = [
    {
      title: 'Tyre',
      icon: 'speedometer-outline',
    },
    {
      title: 'Battery',
      icon: 'battery-half-outline',
    },
    {
      title: 'Fuel',
      icon: 'flame-outline',
    },
    {
      title: 'Mechanical',
      icon: 'construct-outline',
    },
    {
      title: 'Electrical',
      icon: 'flash-outline',
    },
    {
      title: 'Towing',
      icon: 'car-outline',
    },
  ];

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* =====================================================
            HEADER
            ===================================================== */}

        <View style={styles.header}>

          <View>

            <Text style={styles.greeting}>
              Good evening 👋
            </Text>

            <Text style={styles.name}>
              Welcome, Driver
            </Text>

          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.8}
          >

            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />

            <View style={styles.notificationDot} />

          </TouchableOpacity>

        </View>


        {/* =====================================================
            PRIMARY VEHICLE
            ===================================================== */}

        <TouchableOpacity
          style={styles.vehicleCard}
          activeOpacity={0.85}
        >

          <View style={styles.vehicleIcon}>

            <Ionicons
              name="car-sport"
              size={28}
              color={colors.accent}
            />

          </View>

          <View style={styles.vehicleInfo}>

            <Text style={styles.vehicleLabel}>
              PRIMARY VEHICLE
            </Text>

            <Text style={styles.vehicleNumber}>
              TN 01 AB 1234
            </Text>

            <Text style={styles.vehicleName}>
              Tata 1612
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={colors.textMuted}
          />

        </TouchableOpacity>


        {/* =====================================================
            BREAKDOWN / ASSISTANCE CARD
            ===================================================== */}

        <View style={styles.assistanceCard}>

          <View style={styles.assistanceIconContainer}>

            <Ionicons
              name="construct"
              size={34}
              color={colors.white}
            />

          </View>

          <Text style={styles.assistanceTitle}>
            Vehicle breakdown?
          </Text>

          <Text style={styles.assistanceDescription}>
            Get roadside assistance from a nearby mechanic.
          </Text>

          <TouchableOpacity
            style={styles.requestButton}
            activeOpacity={0.85}
            onPress={() =>
              router.push('/breakdown/category')
            }
          >

            <Text style={styles.requestButtonText}>
              REQUEST ASSISTANCE
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color={colors.white}
            />

          </TouchableOpacity>

        </View>


        {/* =====================================================
            QUICK ASSISTANCE HEADER
            ===================================================== */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Quick Assistance
          </Text>

          <Text style={styles.sectionSubtitle}>
            Select your problem
          </Text>

        </View>


        {/* =====================================================
            QUICK ASSISTANCE GRID
            ===================================================== */}

        <View style={styles.grid}>

          {breakdownTypes.map((item) => (

            <TouchableOpacity
              key={item.title}
              style={styles.breakdownItem}
              activeOpacity={0.85}
              onPress={() =>
                router.push('/breakdown/category')
              }
            >

              <View style={styles.breakdownIcon}>

                <Ionicons
                  name={item.icon}
                  size={23}
                  color={colors.accent}
                />

              </View>

              <Text style={styles.breakdownText}>
                {item.title}
              </Text>

            </TouchableOpacity>

          ))}

        </View>


        {/* =====================================================
            RECENT SERVICE
            ===================================================== */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Recent Service
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              router.push('/(tabs)/requests')
            }
          >

            <Text style={styles.viewAll}>
              View all
            </Text>

          </TouchableOpacity>

        </View>


        <View style={styles.historyCard}>

          <View style={styles.historyIcon}>

            <Ionicons
              name="battery-half-outline"
              size={23}
              color={colors.info}
            />

          </View>

          <View style={styles.historyInfo}>

            <Text style={styles.historyTitle}>
              Battery Assistance
            </Text>

            <Text style={styles.historyId}>
              #BRK-10021 • 08 Aug 2026
            </Text>

          </View>

          <View style={styles.completedBadge}>

            <Text style={styles.completedText}>
              Completed
            </Text>

          </View>

        </View>


        {/* =====================================================
            BOTTOM SPACE
            ===================================================== */}

        <View style={styles.bottomSpace} />

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  // =========================================================
  // CONTAINER
  // =========================================================

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,

    // Space for Expo Router bottom tabs
    paddingBottom: 90,
  },


  // =========================================================
  // HEADER
  // =========================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  greeting: {
    fontFamily: 'InterRegular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  name: {
    fontFamily: 'InterBold',
    fontSize: 23,
    color: colors.text,
    letterSpacing: -0.3,
  },


  // =========================================================
  // NOTIFICATION
  // =========================================================

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 15,

    backgroundColor: colors.white,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.border,
  },

  notificationDot: {
    position: 'absolute',

    top: 10,
    right: 11,

    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: colors.danger,

    borderWidth: 1.5,
    borderColor: colors.white,
  },


  // =========================================================
  // VEHICLE CARD
  // =========================================================

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.white,

    borderRadius: 18,

    padding: 16,

    borderWidth: 1,
    borderColor: colors.border,

    marginBottom: 18,
  },

  vehicleIcon: {
    width: 52,
    height: 52,

    borderRadius: 16,

    backgroundColor: '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  vehicleInfo: {
    flex: 1,
  },

  vehicleLabel: {
    fontFamily: 'InterBold',
    fontSize: 10,

    color: colors.textMuted,

    letterSpacing: 0.8,

    marginBottom: 3,
  },

  vehicleNumber: {
    fontFamily: 'InterBold',
    fontSize: 17,

    color: colors.text,

    letterSpacing: -0.2,
  },

  vehicleName: {
    fontFamily: 'InterRegular',
    fontSize: 13,

    color: colors.textSecondary,

    marginTop: 2,
  },


  // =========================================================
  // ASSISTANCE CARD
  // =========================================================

  assistanceCard: {
    backgroundColor: colors.primary,

    borderRadius: 24,

    padding: 22,

    marginBottom: 26,

    overflow: 'hidden',
  },

  assistanceIconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor: colors.accent,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 17,
  },

  assistanceTitle: {
    fontFamily: 'InterBold',

    color: colors.white,

    fontSize: 24,

    letterSpacing: -0.4,
  },

  assistanceDescription: {
    fontFamily: 'InterRegular',

    color: '#CBD5E1',

    fontSize: 14,

    lineHeight: 21,

    marginTop: 7,

    maxWidth: 290,
  },


  // =========================================================
  // REQUEST BUTTON
  // =========================================================

  requestButton: {
    height: 52,

    borderRadius: 15,

    backgroundColor: colors.accent,

    marginTop: 20,

    paddingHorizontal: 18,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    gap: 10,
  },

  requestButtonText: {
    fontFamily: 'InterBold',

    color: colors.white,

    fontSize: 13,

    letterSpacing: 0.4,
  },


  // =========================================================
  // SECTION HEADER
  // =========================================================

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    justifyContent: 'space-between',

    marginBottom: 13,
  },

  sectionTitle: {
    fontFamily: 'InterBold',

    fontSize: 18,

    color: colors.text,

    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontFamily: 'InterRegular',

    fontSize: 12,

    color: colors.textMuted,
  },

  viewAll: {
    fontFamily: 'InterBold',

    fontSize: 13,

    color: colors.accent,
  },


  // =========================================================
  // QUICK ASSISTANCE GRID
  // =========================================================

  grid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 27,
  },

  breakdownItem: {
    width: '31.5%',

    backgroundColor: colors.white,

    borderRadius: 17,

    paddingVertical: 15,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.border,

    marginBottom: 10,
  },

  breakdownIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    backgroundColor: '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 8,
  },

  breakdownText: {
    fontFamily: 'InterBold',

    fontSize: 12,

    color: colors.text,
  },


  // =========================================================
  // RECENT SERVICE
  // =========================================================

  historyCard: {
    backgroundColor: colors.white,

    borderRadius: 18,

    padding: 15,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.border,
  },

  historyIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: colors.infoLight,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  historyInfo: {
    flex: 1,
  },

  historyTitle: {
    fontFamily: 'InterBold',

    fontSize: 14,

    color: colors.text,
  },

  historyId: {
    fontFamily: 'InterRegular',

    fontSize: 11,

    color: colors.textMuted,

    marginTop: 4,
  },

  completedBadge: {
    backgroundColor: colors.successLight,

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 9,
  },

  completedText: {
    fontFamily: 'InterBold',

    color: colors.success,

    fontSize: 10,
  },


  // =========================================================
  // BOTTOM SPACE
  // =========================================================

  bottomSpace: {
    height: 20,
  },

});