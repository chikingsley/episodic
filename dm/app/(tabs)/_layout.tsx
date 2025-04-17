import { Tabs } from 'expo-router';
import { Home, Target, Map, User } from '~/lib/icons'; 
import { ThemeToggle } from '~/components/ThemeToggle'; 
import { NAV_THEME } from '~/lib/constants'; 
import { useColorScheme } from '~/lib/useColorScheme'; 
import { ScreenHeader } from '~/components/common/ScreenHeader'; 
import { Cog6ToothIcon } from '~/components/icons'; 
import React from 'react'; 
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
          const { options } = props;
          const title = options.title ?? route.name;
          const RightIconComponent = (options as any).rightIconComponent as React.ComponentType<any> | undefined;
          const rightIconProps = (options as any).rightIconProps as any | undefined;
          const headerRightContent = options.headerRight ? options.headerRight({ 
            tintColor: colors.text, 
            canGoBack: props.navigation.canGoBack() 
          }) : undefined;

          return (
            <ScreenHeader 
              title={title}
              RightIconComponent={RightIconComponent}
              rightIconProps={rightIconProps} 
              headerRightContent={headerRightContent}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name='hq'
        options={{
          title: 'HEADQUARTERS',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          rightIconComponent: Cog6ToothIcon,
          rightIconProps: { color: colors.text, width: 24, height: 24 }, 
          headerRight: () => <ThemeToggle />, 
        } as BottomTabNavigationOptions & { rightIconComponent?: any; rightIconProps?: any } }
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
        }}
      />
    </Tabs>
  );
}
