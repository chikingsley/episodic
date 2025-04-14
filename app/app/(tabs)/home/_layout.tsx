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
import { FrFlag } from '~/components/icons';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

function CustomTabBar({ state, descriptors, navigation, position }: MaterialTopTabBarProps) {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  const layout = useWindowDimensions();

  const flagWidth = 60;
  const tabWidth = (layout.width - flagWidth) / state.routes.length;

  return (
    <View>
      <View className="flex-row items-center bg-background h-[50px]">
        <Pressable
          onPress={() => alert('Flag pressed!')}
          className="p-3 items-center justify-center h-full"
          style={{ width: flagWidth }}
        >
          <FrFlag className="h-5 w-7" />
        </Pressable>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

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
              className="flex-1 items-center justify-center h-full"
              style={{ width: tabWidth }}
            >
              <Text
                style={{
                  color: isFocused ? theme.purple : theme.inactive,
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View
        style={{
          height: 3,
          width: tabWidth,
          backgroundColor: theme.purple,
          transform: [
            {
              translateX: Animated.add(
                position.interpolate({
                  inputRange: state.routes.map((_, i) => i),
                  outputRange: state.routes.map((_, i) => i * tabWidth),
                }),
                flagWidth
              ),
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <MaterialTopTabs
        tabBar={(props) => <CustomTabBar {...props} />}
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