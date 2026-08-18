import {
  Tabs,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

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
          height: 72,

          paddingTop: 8,

          paddingBottom: 10,

          backgroundColor:
            colors.white,

          borderTopWidth: 1,

          borderTopColor:
            colors.borderLight,

          elevation: 8,

          shadowOpacity: 0.08,

          shadowRadius: 10,

          shadowOffset: {
            width: 0,
            height: -3,
          },
        },

        tabBarLabelStyle: {
          fontFamily:
            'InterSemiBold',

          fontSize: 9,

          marginTop: 2,
        },

        tabBarIconStyle: {
          marginBottom: -1,
        },
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',

          tabBarIcon: ({
            color,
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'home'
                  : 'home-outline'
              }
              size={22}
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
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'document-text'
                  : 'document-text-outline'
              }
              size={22}
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
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'car-sport'
                  : 'car-sport-outline'
              }
              size={23}
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
            focused,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'person'
                  : 'person-outline'
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}