import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { StatusIndicator } from '~/components/ui/status-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  Easing,
  interpolate,
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';

export type MissionStatus = 'locked' | 'inProgress' | 'completed' | 'available';

export interface MissionCardProps {
  title: string;
  description: string;
  status: MissionStatus;
  difficulty?: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  xpReward?: number;
  estimatedTime?: string; // e.g. "10 min"
  progress?: number; // 0-100
  onPress?: () => void;
  expanded?: boolean;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  status,
  difficulty = 1,
  xpReward = 100,
  estimatedTime = "10 min",
  progress = 0,
  onPress,
  expanded = false
}) => {
  // Animation values
  const cardHeight = useSharedValue(expanded ? 1 : 0);
  const cardRotation = useSharedValue(0);
  const watermarkOpacity = useSharedValue(status === 'locked' ? 0.7 : 0.1);
  
  // Get status display text and color
  const getStatusConfig = (status: MissionStatus) => {
    switch (status) {
      case 'locked':
        return { text: 'LOCKED', variant: 'locked' as const };
      case 'inProgress':
        return { text: 'IN PROGRESS', variant: 'inProgress' as const };
      case 'completed':
        return { text: 'COMPLETED', variant: 'completed' as const };
      case 'available':
        return { text: 'AVAILABLE', variant: 'active' as const };
      default:
        return { text: 'UNKNOWN', variant: 'locked' as const };
    }
  };
  
  // Get difficulty text
  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return 'ROUTINE';
      case 2: return 'STANDARD';
      case 3: return 'ENHANCED';
      case 4: return 'HIGH-RISK';
      case 5: return 'CRITICAL';
      default: return 'UNKNOWN';
    }
  };
  
  // Update animations when expanded state changes
  useEffect(() => {
    cardHeight.value = withTiming(expanded ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease)
    });
    
    // Add a small rotation animation when expanding/collapsing
    cardRotation.value = withSequence(
      withTiming(expanded ? 0.5 : -0.5, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    
    // Fade watermark when card is activated
    if (status !== 'locked') {
      watermarkOpacity.value = withTiming(expanded ? 0 : 0.1, { duration: 300 });
    }
  }, [expanded, status]);
  
  // Card expansion animation style
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${interpolate(cardRotation.value, [-1, 1], [-2, 2])}deg` },
        { translateY: interpolate(cardRotation.value, [-1, 1], [-2, 2]) }
      ]
    };
  });
  
  // Content expansion animation style
  const contentStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(cardHeight.value, [0, 1], [0, 150]),
      opacity: cardHeight.value,
      overflow: 'hidden'
    };
  });
  
  // Watermark animation style
  const watermarkStyle = useAnimatedStyle(() => {
    return {
      opacity: watermarkOpacity.value
    };
  });
  
  // Status config
  const statusConfig = getStatusConfig(status);
  
  return (
    <Animated.View style={cardStyle}>
      <Pressable onPress={onPress} disabled={status === 'locked'}>
        <Card className={`mb-4 overflow-hidden ${status === 'locked' ? 'opacity-60' : ''}`}>
          {/* Classified watermark overlay */}
          <Animated.View 
            className="absolute inset-0 items-center justify-center rotate-12 z-10"
            style={watermarkStyle}
          >
            <Text className="text-destructive font-jetbrains-mono-bold text-xl">
              {status === 'locked' ? 'CLASSIFIED' : 'MISSION DOSSIER'}
            </Text>
          </Animated.View>
          
          <CardHeader className="pb-2 border-b border-border">
            <View className="flex-row justify-between items-center">
              <CardTitle className="font-jetbrains-mono-bold text-foreground">
                {title}
              </CardTitle>
              <StatusIndicator status={statusConfig.variant}>
                {statusConfig.text}
              </StatusIndicator>
            </View>
          </CardHeader>
          
          <CardContent className="pt-3">
            <Text className="text-sm text-foreground mb-3">{description}</Text>
            
            {/* Mission metadata row */}
            <View className="flex-row justify-between mb-3">
              <View className="items-center">
                <Text className="text-xs text-muted-foreground mb-1">DIFFICULTY</Text>
                <StatusIndicator 
                  status={
                    difficulty >= 4 ? 'destructive' : 
                    difficulty >= 3 ? 'priority' : 
                    'active'
                  }
                >
                  {getDifficultyText(difficulty)}
                </StatusIndicator>
              </View>
              
              <View className="items-center">
                <Text className="text-xs text-muted-foreground mb-1">REWARD</Text>
                <Text className="text-sm font-jetbrains-mono text-foreground">{xpReward} XP</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-xs text-muted-foreground mb-1">DURATION</Text>
                <Text className="text-sm font-jetbrains-mono text-foreground">{estimatedTime}</Text>
              </View>
            </View>
            
            {/* Progress bar for in-progress missions */}
            {status === 'inProgress' && (
              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs font-jetbrains-mono text-muted-foreground">PROGRESS</Text>
                  <Text className="text-xs font-jetbrains-mono text-muted-foreground">{progress}%</Text>
                </View>
                <View className="h-1 bg-background rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>
            )}
            
            {/* Expanded content */}
            <Animated.View style={contentStyle}>
              <View className="pt-2 border-t border-border mt-2">
                <Text className="text-xs font-jetbrains-mono-bold text-foreground mb-2">MISSION OBJECTIVES</Text>
                <View className="space-y-1">
                  <Text className="text-xs text-muted-foreground">• Establish cover identity</Text>
                  <Text className="text-xs text-muted-foreground">• Gather intelligence from target location</Text>
                  <Text className="text-xs text-muted-foreground">• Make contact with local asset</Text>
                </View>
              </View>
            </Animated.View>
          </CardContent>
        </Card>
      </Pressable>
    </Animated.View>
  );
};

export default MissionCard;
