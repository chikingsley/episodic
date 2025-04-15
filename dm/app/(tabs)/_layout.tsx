import { Tabs } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Home, Target, Map, User } from '~/lib/icons'; // Import from barrel file

export default function TabsLayout() {
  const { colors } = useTheme(); // Use theme colors defined in root layout

  return (
    <Tabs
      initialRouteName="hq"
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // Use primary accent (Crimson Red)
        tabBarInactiveTintColor: colors.border, // Use border color for inactive (maps to muted)
        tabBarStyle: {
          backgroundColor: colors.card, // Use card background for tab bar
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.card, // Use card background for header
        },
        headerTintColor: colors.text, // Use default text color for header title
        headerTitleStyle: {
          fontFamily: 'JetBrains Mono', // Apply mono font
        },
      }}
    >
      <Tabs.Screen
        name='hq'
        options={{
          title: 'HQ',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='intel'
        options={{
          title: 'Intel',
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='mission-control'
        options={{
          title: 'Mission Control',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='agent-profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          // Potential location for Settings later
        }}
      />
      {/* Example: Settings could be a nested screen or a separate modal */}
    </Tabs>
  );
}
