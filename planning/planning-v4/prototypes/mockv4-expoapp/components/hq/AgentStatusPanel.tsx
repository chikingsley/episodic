import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { StatusIndicator } from '~/components/ui/status-indicator';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  Easing,
  interpolateColor
} from 'react-native-reanimated';

interface AgentStats {
  codename?: string;
  level?: number;
  xp?: number;
  xpTarget?: number;
  coverIntegrity?: number;
  streak?: number;
  streakTarget?: number;
  status?: 'active' | 'compromised' | 'standby';
}

interface AgentStatusPanelProps {
  stats?: AgentStats;
  onPress?: () => void;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ 
  stats = {
    codename: "DARK MALLARD",
    level: 7,
    xp: 1250,
    xpTarget: 2000,
    coverIntegrity: 87,
    streak: 3,
    streakTarget: 7,
    status: 'active'
  },
  onPress
}) => {
  // Animation for the glow effect
  const glowIntensity = useSharedValue(0);
  const backgroundShift = useSharedValue(0);
  
  // Calculate percentage values with null checks
  const xpPercentage = Math.min(100, Math.round(((stats.xp ?? 0) / (stats.xpTarget ?? 1)) * 100)) || 0;
  const coverPercentage = stats.coverIntegrity ?? 0;
  const streakPercentage = Math.min(100, Math.round(((stats.streak ?? 0) / (stats.streakTarget ?? 1)) * 100)) || 0;
  
  useEffect(() => {
    // Start glow animation
    glowIntensity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repeat
      true // Reverse
    );
    
    // Start background shift animation based on mission status
    if (stats.status === 'active') {
      backgroundShift.value = withRepeat(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        -1, // Infinite repeat
        true // Reverse
      );
    } else if (stats.status === 'compromised') {
      backgroundShift.value = withRepeat(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1, // Infinite repeat
        true // Reverse
      );
    }
  }, [stats.status]);
  
  // Animated styles for the glow effect
  const glowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: 0.3 + (glowIntensity.value * 0.5),
    };
  });
  
  // Animated styles for the background shift
  const backgroundStyle = useAnimatedStyle(() => {
    // Use a simpler approach without color interpolation for now
    const opacity = 0.9;
    
    // Set a fixed background color based on status
    let bgColor;
    if (stats.status === 'active') {
      bgColor = 'rgb(20, 20, 20)';
    } else if (stats.status === 'compromised') {
      bgColor = 'rgb(40, 10, 10)';
    } else {
      bgColor = 'rgb(20, 20, 20)';
    }
    
    return {
      backgroundColor: bgColor,
      opacity: opacity,
    };
  });
  
  return (
    <Pressable onPress={onPress}>
      <Animated.View 
        className="rounded-lg border border-destructive/30 p-4 mb-6"
        style={[backgroundStyle, {
          shadowColor: '#dc2626',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        }]}
      >
        <View className="flex-row justify-between items-start mb-4">
          {/* Agent Info */}
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-background border-2 border-destructive flex items-center justify-center overflow-hidden mr-3">
              <Text className="font-jetbrains-mono-bold text-destructive">DM</Text>
            </View>
            <View>
              <Text className="text-xs font-jetbrains-mono text-destructive">AGENT STATUS</Text>
              <Text className="font-jetbrains-mono-bold text-foreground">{stats.codename}</Text>
              <View className="flex-row mt-1 space-x-2">
                <StatusIndicator status={stats.status === 'active' ? 'active' : stats.status === 'compromised' ? 'destructive' : 'locked'}>
                  {stats.status?.toUpperCase()}
                </StatusIndicator>
                <StatusIndicator status="level">LVL.{stats.level}</StatusIndicator>
              </View>
            </View>
          </View>
          
          {/* Operational Readiness */}
          <View className="items-end">
            <Text className="text-xs font-jetbrains-mono text-muted-foreground mb-1">OPERATIONAL READINESS</Text>
            <Animated.View 
              className="w-16 h-16 rounded-full bg-background border-4 border-destructive/50 flex items-center justify-center"
              style={glowStyle}
            >
              <Text className="font-jetbrains-mono-bold text-foreground text-lg">{coverPercentage}%</Text>
            </Animated.View>
          </View>
        </View>
        
        {/* Tactical Gauges */}
        <View className="space-y-4">
          {/* Cover Integrity Gauge */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">COVER INTEGRITY</Text>
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">{coverPercentage}%</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View 
                className={`h-full rounded-full ${
                  coverPercentage > 70 ? 'bg-green-600' : 
                  coverPercentage > 40 ? 'bg-yellow-600' : 
                  'bg-destructive'
                }`}
                style={{ width: `${coverPercentage}%` }}
              />
            </View>
          </View>
          
          {/* XP Progress Gauge */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">FIELD EXPERIENCE</Text>
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">{stats.xp}/{stats.xpTarget} XP</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              />
            </View>
          </View>
          
          {/* Streak Gauge */}
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">DAILY OPERATIONS</Text>
              <Text className="text-xs font-jetbrains-mono text-muted-foreground">{stats.streak}/{stats.streakTarget} DAYS</Text>
            </View>
            <View className="h-2 bg-background rounded-full overflow-hidden">
              <View 
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${streakPercentage}%` }}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default AgentStatusPanel;
