import { Tabs } from 'expo-router';
import { Home, Target, Map, User } from '~/lib/icons'; 
import { ThemeToggle } from '~/components/ThemeToggle'; 
import { NAV_THEME } from '~/lib/constants'; 
import { useColorScheme } from '~/lib/useColorScheme'; 
import { ScreenHeader } from '~/components/common/ScreenHeader'; 
import { Cog6ToothIcon } from '~/components/icons'; 
import { PencilSquareIcon } from '~/components/icons/PencilSquareIcon'; 
import { MagnifyingGlassCircleIcon } from '~/components/icons/MagnifyingGlassCircleIcon'; 
import React from 'react'; 
import { View } from 'react-native'; 
import { BottomTabBarProps, BottomTabHeaderProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'; 

export default function TabsLayout() {
  const { colorScheme } = useColorScheme(); 
  const colors = NAV_THEME[colorScheme]; 

  return (
    <Tabs
      initialRouteName="hq"
      screenOptions={({ route }) => ({ 
        headerShown: true, 
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.gray, 
        tabBarStyle: {
          backgroundColor: colors.card, 
          borderTopColor: colors.border,
        },
        header: (props: BottomTabHeaderProps) => { 
          const { options, route } = props;
          let title: string | undefined;
          if (typeof options.headerTitle === 'string') {
            title = options.headerTitle;
          } else {
            title = typeof options.title === 'string' ? options.title : route.name;
          }
          const RightIconComponent = (options as any).rightIconComponent as React.ComponentType<any> | undefined;
          const rightIconSize = (options as any).rightIconSize as number | undefined;
          const rightIconColor = (options as any).rightIconColor as string | undefined;

          const headerRightContent = options.headerRight ? options.headerRight({ 
            tintColor: colors.text, 
            canGoBack: props.navigation.canGoBack() 
          }) : undefined;

          return (
            <ScreenHeader 
              title={title}
              RightIconComponent={RightIconComponent}
              rightIconSize={rightIconSize} 
              rightIconColor={rightIconColor}
              headerRightContent={headerRightContent}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name='hq'
        options={{
          headerTitle: 'HEADQUARTERS', 
          tabBarLabel: 'HQ', 
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerRight: () => (
            <View className="flex-row items-center gap-2"> 
              <ThemeToggle size={28} />
              <Cog6ToothIcon color={colors.text} width={28} height={28} />
            </View>
          ), 
        } as BottomTabNavigationOptions }
      />
      <Tabs.Screen
        name='intel'
        options={{
          headerTitle: 'Intel',
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
          rightIconComponent: MagnifyingGlassCircleIcon, 
          rightIconColor: colors.text, 
        } as BottomTabNavigationOptions & { rightIconComponent?: any; rightIconSize?: number; rightIconColor?: string } }
      />
      <Tabs.Screen
        name='mission-control'
        options={{
          headerTitle: 'Mission Control',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='agent-profile'
        options={{
          headerTitle: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          rightIconComponent: PencilSquareIcon, 
          rightIconColor: colors.text, 
        } as BottomTabNavigationOptions & { rightIconComponent?: any; rightIconSize?: number; rightIconColor?: string } }
      />
    </Tabs>
  );
}
