import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  useAnimatedRef,
  interpolate,
  scrollTo,
  Extrapolation,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Stack } from 'expo-router';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import Svg, { Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;

// 4pt system values
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

// Trophy icon for Leagues tab
const TrophyIcon = ({ size = 24, color = "#808080" }: { size?: number, color: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.21 16.83v1.17C8.21 19.1 9.16 20 10.26 20h3.48c1.1 0 2.05-.9 2.05-2v-1.17"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16c-3.97 0-7.19-3.22-7.19-7.19V4c0-.55.45-1 1-1h12.38c.55 0 1 .45 1 1v4.81c0 3.97-3.22 7.19-7.19 7.19ZM4.81 9c-.67 0-1.21-.54-1.21-1.21V4.21C3.6 3.54 4.14 3 4.81 3M19.19 9c.67 0 1.21-.54 1.21-1.21V4.21c0-.67-.54-1.21-1.21-1.21"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Target icon for Challenges tab
const TargetIcon = ({ size = 24, color = "#808080" }: { size?: number, color: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Define tab interface
interface TabItem {
  name: string;
  route: string;
  icon: (color: string) => React.ReactNode;
}

const tabs: TabItem[] = [
  { 
    name: 'Leagues', 
    route: 'leagues',
    icon: (color: string) => <TrophyIcon color={color} />
  },
  { 
    name: 'Challenges', 
    route: 'index',
    icon: (color: string) => <TargetIcon color={color} />
  }
];

// Tab component to handle measurement
interface TabTextProps {
  item: TabItem;
  index: number;
  activeIndex: number;
  viewTranslatePoints: number[];
  setViewTranslatePoints: React.Dispatch<React.SetStateAction<number[]>>;
  tabWidths: number[];
  setTabWidths: React.Dispatch<React.SetStateAction<number[]>>;
  scrollRef: React.RefObject<Animated.ScrollView>;
  activeColor: string;
  inactiveColor: string;
  onPress: (index: number) => void;
}

const TabText = ({
  item,
  index,
  activeIndex,
  viewTranslatePoints,
  setViewTranslatePoints,
  tabWidths,
  setTabWidths,
  scrollRef,
  activeColor,
  inactiveColor,
  onPress
}: TabTextProps) => {
  const isActive = activeIndex === index;
  const color = isActive ? activeColor : inactiveColor;
  
  const handleViewLayout = (event: any) => {
    const { x, width } = event.nativeEvent.layout;
    const currentPoints = [...viewTranslatePoints];
    currentPoints[index] = x;
    setViewTranslatePoints(currentPoints);
    
    const currentTabWidths = [...tabWidths];
    currentTabWidths[index] = width;
    setTabWidths(currentTabWidths);
  };

  return (
    <Pressable 
      onPress={() => onPress(index)}
      onLayout={handleViewLayout}
      style={{ 
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      }}
    >
      <View className="flex-row items-center justify-center">
        <View style={{ marginRight: spacing.sm }}>
          {item.icon(color)}
        </View>
        <Text
          className="text-xl font-bold"
          style={{ color }}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
};

// Tabs bar with indicator
interface TabsProps {
  scrollXValue: Animated.SharedValue<number>;
  scrollRef: React.RefObject<Animated.ScrollView>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TabsBar = ({ scrollXValue, scrollRef, activeIndex, setActiveIndex }: TabsProps) => {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  
  const [viewTranslatePoints, setViewTranslatePoints] = useState<number[]>([]);
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  
  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };
  
  const indicatorStyle = useAnimatedStyle(() => {
    if (tabWidths.length !== tabs.length || viewTranslatePoints.length !== tabs.length) {
      return {
        width: 0,
        transform: [{ translateX: 0 }],
        opacity: 0,
      };
    }
    
    return {
      width: interpolate(
        scrollXValue.value,
        tabs.map((_, i) => i * SCREEN_WIDTH),
        tabWidths,
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateX: interpolate(
            scrollXValue.value,
            tabs.map((_, i) => i * SCREEN_WIDTH),
            viewTranslatePoints,
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: 1,
    };
  });
  
  return (
    <View 
      style={{ 
        width: '100%', 
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        position: 'relative',
        zIndex: 20,
      }}
    >
      <View 
        style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: spacing.md,
        }}
      >
        {tabs.map((tab, index) => (
          <TabText
            key={tab.name}
            item={tab}
            index={index}
            activeIndex={activeIndex}
            viewTranslatePoints={viewTranslatePoints}
            setViewTranslatePoints={setViewTranslatePoints}
            tabWidths={tabWidths}
            setTabWidths={setTabWidths}
            scrollRef={scrollRef}
            activeColor={theme.purple}
            inactiveColor={theme.inactive}
            onPress={handleTabPress}
          />
        ))}
      </View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            height: 4,
            backgroundColor: theme.purple,
            borderRadius: 2,
            bottom: 0,
            left: 0,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
};

// Actual page router content components
const PageComponents: Record<string, () => JSX.Element> = {
  leagues: () => require('./leagues').default(),
  index: () => require('./index').default(),
};

// Function to update active index based on scroll position
const updateActiveIndex = (
  value: number, 
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const index = Math.round(value / SCREEN_WIDTH);
  setActiveIndex(index);
};

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  const [activeIndex, setActiveIndex] = useState(0);
  
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  
  // Scroll handler with JS callback to update active index
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(updateActiveIndex)(event.contentOffset.x, setActiveIndex);
    },
  });
  
  // Handle momentum end for better snapping
  const scrollMomentumEndHandler = useAnimatedScrollHandler({
    onMomentumEnd: (event) => {
      const scrollDiff = event.contentOffset.x % SCREEN_WIDTH;
      if (scrollDiff > SCREEN_WIDTH / 2) {
        const scrollMultiplier = Math.ceil(
          event.contentOffset.x / SCREEN_WIDTH,
        );
        scrollTo(scrollRef, scrollMultiplier * SCREEN_WIDTH, 0, true);
      } else {
        const scrollMultiplier = Math.floor(
          event.contentOffset.x / SCREEN_WIDTH,
        );
        scrollTo(scrollRef, scrollMultiplier * SCREEN_WIDTH, 0, true);
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Dynamic Tabs */}
      <TabsBar 
        scrollXValue={scrollX} 
        scrollRef={scrollRef} 
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      
      {/* Content */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={scrollMomentumEndHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {tabs.map((tab) => (
          <View 
            key={tab.route} 
            style={{ width: SCREEN_WIDTH, height: '100%' }}
          >
            {PageComponents[tab.route]()}
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
