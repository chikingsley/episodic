import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, BoltIcon, UserCircleIcon, PuzzlePieceIcon } from '~/components/icons';
import { useColorScheme } from 'react-native';
import { NAV_THEME } from '~/lib/constants'; 

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.purple, 
        tabBarInactiveTintColor: theme.inactive,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.inactive, 
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => <HomeIcon color={color} selected={focused} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, size, focused }) => <PuzzlePieceIcon color={color} selected={focused} />,
        }}
      />
      <Tabs.Screen
        name="challenge"
        options={{
          title: 'Challenge',
          tabBarIcon: ({ color, size, focused }) => <BoltIcon color={color} selected={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <UserCircleIcon color={color} selected={focused} />,
        }}
      />
    </Tabs>
  );
}
