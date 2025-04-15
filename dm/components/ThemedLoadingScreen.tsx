import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';
import { Progress } from './ui/progress'; // Import your styled Progress component
import { Text } from './ui/text'; // Import your styled Text component

// Create animated versions of components
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedProgress = Animated.createAnimatedComponent(Progress); // Added

interface ThemedLoadingScreenProps {
  isLoading: boolean; // Controls visibility and animation start
  onLoadingComplete?: () => void; // Optional callback when animation finishes
  duration?: number; // Animation duration in ms
}

const ThemedLoadingScreen: React.FC<ThemedLoadingScreenProps> = ({
  isLoading,
  onLoadingComplete,
  duration = 4000, // Default duration 4 seconds
}) => {
  const progress = useSharedValue(0); // 0 to 100
  const opacity = useSharedValue(1); // For fade-out

  useEffect(() => {
    if (isLoading) {
      // Reset progress and opacity if isLoading becomes true again
      progress.value = 0; 
      opacity.value = 1;
      // Start the loading animation
      progress.value = withTiming(
        100, 
        { duration: duration, easing: Easing.linear }, 
        (finished) => {
          if (finished && onLoadingComplete) {
            // Optionally fade out when complete before calling callback
            opacity.value = withTiming(0, { duration: 300 }, () => {
              // Run callback on JS thread after fade-out
              runOnJS(onLoadingComplete)();
            });
          } else if (finished) {
             opacity.value = withTiming(0, { duration: 300 }); // Fade out even without callback
          }
        }
      );
    } else {
       // If isLoading is false initially or becomes false, ensure it's hidden
       progress.value = 0;
       opacity.value = 0;
    }
  }, [isLoading, duration, onLoadingComplete, progress, opacity]);

  // Animated style for the main container (for fade-out)
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Derived value for the formatted progress text
  const animatedText = useDerivedValue(() => {
    return `LOADING... ${Math.round(progress.value)}%`;
  });

  // Animated props for the Text component
  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: animatedText.value,
    } as any; // Cast to any for simplicity with text prop
  });

  // Animated props for the Progress component (NEW)
  const animatedProgressProps = useAnimatedProps(() => {
    return {
      value: progress.value, // Read value inside the hook
    } as any; // Cast necessary for non-style props
  });

  // Render null if not loading and opacity is 0 (avoids flicker)
  if (!isLoading && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[StyleSheet.absoluteFill, containerAnimatedStyle]} 
      className="flex items-center justify-center bg-background"
    >
      {/* Placeholder for layout - We will add elements here */}
      <View className="w-64 items-center">
        {/* Progress Bar */}
        <View className="w-full h-4 bg-gray-900 border border-gray-700 relative overflow-hidden rounded-full mb-4">
           {/* Replaced Progress with AnimatedProgress */}
           <AnimatedProgress 
              animatedProps={animatedProgressProps} 
              className="h-full rounded-full" 
            />
        </View>
        
        {/* Replaced Text with AnimatedText */}
        <AnimatedText 
          animatedProps={animatedTextProps} 
          className="text-gray-300 font-mono"
        />
      </View>
    </Animated.View>
  );
};

export { ThemedLoadingScreen }; 