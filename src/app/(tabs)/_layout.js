import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import colors from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          colors.accent,

        tabBarInactiveTintColor:
          colors.textMuted,

        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
        },

        tabBarLabelStyle: {
          fontFamily: 'InterMedium',
          fontSize: 10,
        },
      }}
    >

      {/* =====================================================
          HOME
          ===================================================== */}

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =====================================================
          REQUESTS
          ===================================================== */}

      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="document-text-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =====================================================
          VEHICLE
          ===================================================== */}

      <Tabs.Screen
        name="vehicle"
        options={{
          title: 'Vehicle',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="car-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =====================================================
          PROFILE
          ===================================================== */}

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',

          tabBarIcon: ({
            color,
            size,
          }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />


      {/* =====================================================
          BREAKDOWN FLOW
          
          Internal navigation only.
          DO NOT SHOW IN BOTTOM NAVIGATION.
          ===================================================== */}

      <Tabs.Screen
        name="breakdown"
        options={{
          href: null,
        }}
      />

    </Tabs>
  );
}