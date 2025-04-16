import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
// Font Loading
import {
  useFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  Redacted_400Regular,
} from '@expo-google-fonts/redacted';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'JetBrains Mono': JetBrainsMono_400Regular, // Map to the base name used in Tailwind
    'JetBrains Mono_400Regular': JetBrainsMono_400Regular,
    'JetBrains Mono_500Medium': JetBrainsMono_500Medium,
    'JetBrains Mono_600SemiBold': JetBrainsMono_600SemiBold,
    'JetBrains Mono_700Bold': JetBrainsMono_700Bold,
    'Flow Block Redacted': Redacted_400Regular, // Map to the base name used in Tailwind, using corrected import
    'Redacted_400Regular': Redacted_400Regular,
    // You might need to adjust the keys above based on the exact font family names
    // required by React Native on different platforms or how Tailwind resolves them.
    // The 'JetBrains Mono' and 'Flow Block Redacted' keys are added to match the Tailwind config.
  });

  useIsomorphicLayoutEffect(() => {
    // This check is now within useIsomorphicLayoutEffect
    if (!hasMounted.current) {
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      setAndroidNavigationBar(colorScheme);
      setIsColorSchemeLoaded(true);
      hasMounted.current = true;
    }
  }, [colorScheme]); // Added colorScheme dependency

  // Hide splash screen once fonts are loaded or an error occurs
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until color scheme and fonts are loaded
  if (!isColorSchemeLoaded || (!fontsLoaded && !fontError)) {
    return null;
  }

  // Log font loading errors
  if (fontError) {
    console.error('Font loading error:', fontError);
    // Optionally render an error state
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
