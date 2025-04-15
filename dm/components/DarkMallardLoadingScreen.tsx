import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
  interpolateColor,
  useDerivedValue,
  useAnimatedProps,
  cancelAnimation,
} from 'react-native-reanimated';
import { Svg, Path } from 'react-native-svg';
import { Text } from './ui/text';
import { cn } from '~/lib/utils';

// Create animated versions of components
const AnimatedText = Animated.createAnimatedComponent(Text);

interface DarkMallardLoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  duration?: number;
  className?: string;
}

export const DarkMallardLoadingScreen: React.FC<DarkMallardLoadingScreenProps> = ({
  isLoading,
  onLoadingComplete,
  duration = 4000,
  className,
}) => {
  // Animation shared values
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);
  const logoScale = useSharedValue(0.95);
  const terminalIndex = useSharedValue(0);
  
  // Terminal text animation values
  const terminalTexts = [
    'INITIALIZING SYSTEMS...',
    'ESTABLISHING CONNECTION...',
    'LOADING LANGUAGE MODULES...',
    'ACCESSING INTEL DATABASE...',
    'AUTHENTICATING USER CREDENTIALS...',
    'PREPARING MISSION BRIEFING...',
  ];
  
  // Reset and start animations when isLoading changes
  useEffect(() => {
    if (isLoading) {
      // Reset values
      progress.value = 0;
      opacity.value = 1;
      logoScale.value = 0.95;
      terminalIndex.value = 0;
      
      // Start scale pulsing animation
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Repeat indefinitely
        true // Reverse sequence automatically
      );
      
      // Start loading progress
      progress.value = withTiming(
        100,
        { duration: duration, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) {
            // When loading is complete
            if (onLoadingComplete) {
              opacity.value = withDelay(
                500,
                withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }, () => {
                  runOnJS(onLoadingComplete)();
                })
              );
            } else {
              opacity.value = withDelay(
                500,
                withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
              );
            }
          }
        }
      );
      
      // Terminal text cycling animation
      const textAnimationDuration = duration / (terminalTexts.length + 1);
      for (let i = 0; i < terminalTexts.length; i++) {
        terminalIndex.value = withDelay(
          i * textAnimationDuration,
          withTiming(i, { duration: 300, easing: Easing.inOut(Easing.ease) })
        );
      }
    } else {
      // Reset and stop animations
      cancelAnimation(logoScale);
      cancelAnimation(progress);
      cancelAnimation(terminalIndex);
      
      opacity.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
    
    return () => {
      // Clean up animations
      cancelAnimation(logoScale);
      cancelAnimation(progress);
      cancelAnimation(terminalIndex);
    };
  }, [isLoading, duration, onLoadingComplete]);
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
  
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));
  
  const progressTextAnimatedProps = useAnimatedProps(() => ({
    text: progress.value >= 100 ? 'CONNECTION SECURE' : `${Math.floor(progress.value)}%`,
  } as any));
  
  const terminalTextAnimatedProps = useAnimatedProps(() => ({
    text: terminalTexts[Math.min(Math.floor(terminalIndex.value), terminalTexts.length - 1)],
  } as any));
  
  // Pre-define all indicator styles
  const encryptionStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value >= 25 ? '#065f46' : '#991b1b',
    opacity: progress.value >= 25 ? 1 : 0.5,
  }));
  
  const assetsStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value >= 50 ? '#065f46' : '#991b1b',
    opacity: progress.value >= 50 ? 1 : 0.5,
  }));
  
  const intelStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value >= 75 ? '#065f46' : '#991b1b',
    opacity: progress.value >= 75 ? 1 : 0.5,
  }));
  
  const uplinkStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value >= 95 ? '#065f46' : '#991b1b',
    opacity: progress.value >= 95 ? 1 : 0.5,
  }));
  
  // Render function that doesn't create hooks
  const renderStatusIndicator = (threshold: number, label: string, style: any) => {
    return (
      <View className="flex-row items-center mb-2">
        <Animated.View
          style={style}
          className="w-3 h-3 rounded-full mr-2"
        />
        <Text className="text-gray-300 font-mono text-xs">
          {label}: {progress.value >= threshold ? 'ACTIVE' : 'PENDING'}
        </Text>
      </View>
    );
  };

  // Only return null after all hooks are defined
  if (!isLoading && opacity.value === 0) {
    return null;
  }
  
  // Generate an access code just once per render
  const accessCode = Math.floor(Math.random() * 900000) + 100000;
  
  return (
    <Animated.View
      style={[styles.overlay, containerStyle]}
      className={cn('bg-background', className)}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* DEBUG BORDER - Comment out when fixed */}
        <View style={styles.debugBorder} className="flex-1 justify-between p-4">
          
          {/* Top Section - Logo */}
          <View className="items-center mt-4">
            <Animated.View style={logoStyle}>
              <Text className="text-destructive font-bold text-xl tracking-widest">DARK MALLARD</Text>
              <Text className="text-gray-500 text-xs tracking-wider mt-1 text-center">LANGUAGE ACQUISITION DIVISION</Text>
            </Animated.View>
          </View>
          
          {/* Middle Section - Main Content */}
          <View className="flex-1 justify-center items-center px-4">
            {/* Terminal Text */}
            <View className="h-6 mb-6 items-center justify-center">
              <AnimatedText
                animatedProps={terminalTextAnimatedProps}
                className="text-gray-300 font-mono text-sm"
              />
            </View>
            
            {/* Progress Bar */}
            <View className="w-full mb-8">
              <View className="w-full h-3 bg-gray-900 border border-gray-700 rounded-full overflow-hidden">
                <Animated.View
                  style={progressBarStyle}
                  className="h-full bg-destructive rounded-full"
                />
              </View>
              <View className="mt-2 items-center">
                <AnimatedText
                  animatedProps={progressTextAnimatedProps}
                  className="text-gray-300 font-mono text-xs"
                />
              </View>
            </View>
            
            {/* Status Indicators */}
            <View className="w-full">
              <View className="flex-row flex-wrap justify-between">
                <View className="w-1/2 mb-3">
                  {renderStatusIndicator(25, 'ENCRYPTION', encryptionStyle)}
                </View>
                <View className="w-1/2 mb-3">
                  {renderStatusIndicator(50, 'ASSETS', assetsStyle)}
                </View>
                <View className="w-1/2 mb-3">
                  {renderStatusIndicator(75, 'INTEL', intelStyle)}
                </View>
                <View className="w-1/2 mb-3">
                  {renderStatusIndicator(95, 'UPLINK', uplinkStyle)}
                </View>
              </View>
            </View>
          </View>
          
          {/* Bottom Section - Footer */}
          <View className="items-center mb-4">
            <Text className="text-gray-400 font-mono text-xs">
              ACCESS CODE: {accessCode}
            </Text>
          </View>
          
          {/* Classified Overlay - Absolute Position */}
          <View style={styles.classifiedBadge}>
            <View className="border-2 border-destructive/40 px-3 py-1">
              <Text className="text-destructive/40 font-bold text-xs">CLASSIFIED</Text>
            </View>
          </View>
          
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  debugBorder: {
    // Uncomment to see layout boundaries
    // borderWidth: 1,
    // borderColor: 'red',
  },
  classifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    transform: [{ rotate: '12deg' }],
  },
}); 