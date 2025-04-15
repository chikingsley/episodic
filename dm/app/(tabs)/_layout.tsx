import { Tabs } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { Home, Target, Map, User } from '~/lib/icons'; // Import from barrel file
import { ThemeToggle } from '~/components/ThemeToggle'; // Import ThemeToggle
import { NAV_THEME } from '~/lib/constants'; // Import NAV_THEME
import { useColorScheme } from '~/lib/useColorScheme'; // Import useColorScheme

export default function TabsLayout() {
  const { colorScheme } = useColorScheme(); // Get current color scheme
  const colors = NAV_THEME[colorScheme]; // Select the correct theme object

  return (
    <Tabs
      initialRouteName="hq"
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // Use primary accent (Crimson Red)
        tabBarInactiveTintColor: colors.gray, // Changed back to border, as ring might not be ideal visually
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
          headerRight: () => <ThemeToggle />, // Add ThemeToggle to headerRight
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
