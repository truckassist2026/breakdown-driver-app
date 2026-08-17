import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import colors from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          colors.accent,

        tabBarInactiveTintColor:
          colors.textMuted,

        tabBarStyle: {
          height: 72,

          paddingTop: 8,
          paddingBottom: 10,

          backgroundColor:
            colors.white,

          borderTopWidth: 1,

          borderTopColor:
            colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >

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

    </Tabs>
  );
}