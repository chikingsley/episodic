import React from 'react';
import { Tabs } from 'expo-router';
import { Home, MessageSquareText, Trophy, User } from 'lucide-react-native'; // Example Icons
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants'; // Assuming constants are still here for now

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const colors = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.card, // Use card color for tab bar background
          borderTopColor: colors.border, // Use border color for the top border
        },
        headerShown: false, // We'll handle headers in nested stacks or screens
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          // Consider renaming this later to 'Practice' if needed
          tabBarIcon: ({ color, size }) => <MessageSquareText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
