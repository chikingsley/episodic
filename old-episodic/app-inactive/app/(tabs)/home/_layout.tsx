import React from 'react';
import { View, Pressable, Text, Animated, useWindowDimensions } from 'react-native';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FrFlag, FlameIcon } from '~/components/icons';

// --- 4pt System Values ---
const spacing = {
  xs: 4,  // space-x-1, p-1
  sm: 8,  // space-x-2, p-2
  md: 12, // space-x-3, p-3
  lg: 16, // space-x-4, p-4, gap-4
  xl: 20, // space-x-5, p-5
  '2xl': 24, // space-x-6, p-6
  '3xl': 32, // space-x-8, p-8
};
const sizes = {
  iconH: 20,  // h-5
  flagW: 32,  // w-8
  flameW: 20, // w-5
  tabBarH: 48, // h-[48px]
  indicatorH: 4, // h-[4px]
};
// --- End Values ---

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

interface CustomTabBarProps extends MaterialTopTabBarProps {
  streakCount: number;
}

function CustomTabBar({ state, descriptors, navigation, position, streakCount }: CustomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  const layout = useWindowDimensions();

  // Estimate widths for calculation (even with flex layout)
  // Width = Icon Width + Padding*2
  const estimatedFlagWidth = sizes.flagW + (spacing.sm * 2); // w-8 + p-2 * 2 
  // More complex estimation for streak: icon + space + text(?) + padding -> approx 60 seems reasonable to start
  const estimatedStreakWidth = 60; 
  const outerPadding = spacing.lg; // px-4 = 16
  const gap = spacing.lg; // gap-x-4 = 16

  const tabsContainerWidth = layout.width - (outerPadding * 2) - (gap * 2) - estimatedFlagWidth - estimatedStreakWidth;
  // Ensure tabsContainerWidth is not negative (can happen on very small screens)
  const safeTabsContainerWidth = Math.max(0, tabsContainerWidth);
  const tabWidth = safeTabsContainerWidth / state.routes.length; // Width of each tab's flex area

  const indicatorWidth = tabWidth * 0.6; // Indicator 60% of tab width
  const indicatorOffset = (tabWidth - indicatorWidth) / 2; // Centering offset

  return (
    <View> 
      <View 
        className="flex-row items-center bg-background" 
        style={{ height: sizes.tabBarH, paddingHorizontal: outerPadding, gap: gap }}
      >
        {/* Left: Flag Button */}
        <Pressable
          onPress={() => alert('Flag pressed!')}
          className="p-2 items-center justify-center" 
        >
          {/* Use inline style for size */}
          <FrFlag style={{ height: sizes.iconH, width: sizes.flagW }} /> 
        </Pressable>

        {/* Middle: Tabs Container */}
        <View className="flex-1 flex-row" style={{ height: sizes.tabBarH }}> 
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label: string = options.title ?? route.name;
            const isFocused = state.index === index;

            const onPress = () => {
               const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
               if (!isFocused && !event.defaultPrevented) {
                 navigation.navigate(route.name, route.params);
               }
            };
            const onLongPress = () => {
               navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                // Each tab takes equal space in the flex-1 container
                // Internal padding controls text spacing
                className="flex-1 items-center justify-center px-6" // px-6 = 24pt padding
                style={{ height: sizes.tabBarH }}
              >
                <Text
                  style={{
                    color: isFocused ? theme.purple : theme.inactive,
                    fontWeight: 'bold',
                    fontSize: 14, // Base (16pt) might be better? text-base
                    textTransform: 'capitalize',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Right: Streaks Button */}
        <Pressable
          onPress={() => alert('Streak pressed!')}
          // Use gap on parent, add padding here
          className="flex-row items-center justify-center p-2 space-x-1" // p-2=8pt, space-x-1=4pt
        >
          {/* Use inline style for size */}
          <FlameIcon style={{ height: sizes.iconH, width: sizes.flameW }} className="text-orange-500" />
          <Text className="font-bold text-foreground text-sm">{streakCount}</Text>
        </Pressable>
      </View>

      {/* Custom Indicator */}
      <Animated.View
        style={{
          height: sizes.indicatorH,
          width: indicatorWidth,
          backgroundColor: theme.purple,
          position: 'absolute',
          bottom: 0,
          // Left = outerPad + flagWidth + gap + indicatorOffset
          left: outerPadding + estimatedFlagWidth + gap + indicatorOffset, 
          transform: [
            {
              translateX: position.interpolate({
                inputRange: state.routes.map((_, i) => i),
                // Output range is 0 to (numTabs - 1) * tabWidth
                outputRange: state.routes.map((_, i) => i * tabWidth),
              }),
            },
          ],
        }}
      />
    </View>
  );
}

export default function HomeTabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  const streakCount = 7; // Example streak count

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <MaterialTopTabs
        tabBar={(props) => <CustomTabBar {...props} streakCount={streakCount} />}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{ title: 'Home' }} 
        />
        <MaterialTopTabs.Screen
          name="discover"
          options={{ title: 'Discover' }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
} 