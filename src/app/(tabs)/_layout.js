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
          fontSize: 10,
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
              name="clipboard-outline"
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