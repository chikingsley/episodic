import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useColorScheme } from 'nativewind';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  Easing,
  interpolate,
  withSequence
} from 'react-native-reanimated';


interface HQHeaderProps {
  agentCodename?: string;
  isConnected?: boolean;
}

export const HQHeader: React.FC<HQHeaderProps> = ({ 
  agentCodename = "DARK MALLARD",
  isConnected = true 
}) => {
  const { colorScheme } = useColorScheme();
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('day');
  
  // Scan line animation
  const scanLinePosition = useSharedValue(0);
  
  // Connection status animation
  const connectionPulse = useSharedValue(1);
  
  useEffect(() => {
    // Set time of day based on current hour
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? 'day' : 'night');
    
    // Start scan line animation
    scanLinePosition.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }), 
      -1, // Infinite repeat
      false // Don't reverse
    );
    
    // Start connection pulse animation if connected
    if (isConnected) {
      connectionPulse.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        false // Don't reverse
      );
    }
  }, [isConnected]);
  
  // Animated styles for scan line
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      top: `${interpolate(scanLinePosition.value, [0, 1], [0, 100])}%`,
    };
  });
  
  // Animated styles for connection status
  const connectionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: connectionPulse.value }],
      opacity: interpolate(connectionPulse.value, [1, 1.3], [1, 0.7]),
    };
  });
  
  return (
    <View className="relative mb-4">
      {/* Background with classified stamp overlay */}
      <View className="absolute -top-2 -right-2 rotate-12 opacity-10">
        <Text className="text-destructive font-jetbrains-mono-bold text-lg">CLASSIFIED</Text>
      </View>
      
      {/* Main header content */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* Logo/Icon */}
          <View className="w-8 h-8 bg-background border border-destructive rounded-md mr-2 items-center justify-center">
            <Text className="text-destructive font-jetbrains-mono-bold">DM</Text>
          </View>
          
          {/* Title with scan line effect container */}
          <View className="overflow-hidden">
            <Text className="font-jetbrains-mono-bold text-xl text-foreground tracking-tight">
              HEADQUARTERS
            </Text>
            
            {/* Animated scan line */}
            <Animated.View 
              className="absolute left-0 right-0 h-0.5 bg-destructive opacity-30"
              style={[scanLineStyle, { 
                shadowColor: '#dc2626',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
              }]}
            />
          </View>
        </View>
        
        <View className="flex-row items-center space-x-2">
          {/* Day/Night Cycle Indicator */}
          <View className="px-2 py-1 bg-destructive/10 border border-destructive rounded-md">
            <Text className="text-xs text-destructive font-jetbrains-mono">
              {timeOfDay === 'day' ? 'DAY' : 'NIGHT'} OPS
            </Text>
          </View>
          
          {/* Connection Status Indicator */}
          <Animated.View 
            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
              isConnected 
                ? 'bg-background border-destructive' 
                : 'bg-background border-muted-foreground'
            }`}
            style={isConnected ? connectionStyle : {}}
          >
            <View className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-destructive' : 'bg-muted-foreground'
            }`} />
          </Animated.View>
        </View>
      </View>
      
      {/* Agent Codename */}
      <View className="mt-2">
        <Text className="text-xs text-muted-foreground font-jetbrains-mono">AGENT CODENAME</Text>
        <Text className="font-jetbrains-mono-bold text-foreground">{agentCodename}</Text>
      </View>
    </View>
  );
};

export default HQHeader;
