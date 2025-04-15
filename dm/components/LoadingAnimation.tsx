import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface LoadingAnimationProps {
  isActive?: boolean; // Controls if the animation is running
  containerHeight?: number; // Optional: Height of the area to scan within
  lineColor?: string; // Optional: Class name for line color, default destructive
  speed?: number; // Optional: Duration of one scan cycle in ms, default 1500
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isActive = true,
  containerHeight, // If not provided, defaults to screen height
  lineColor = 'bg-destructive', // Default red line
  speed = 1500, // Default speed 1.5 seconds per cycle
}) => {
  const { height: screenHeight } = Dimensions.get('window');
  const scanAreaHeight = containerHeight ?? screenHeight;

  // Shared value for the vertical position of the line (0 = top, scanAreaHeight = bottom)
  const translateY = useSharedValue(0);

  // Define the animation sequence
  useEffect(() => {
    if (isActive) {
      translateY.value = withRepeat(
        withSequence(
          // Scan down
          withTiming(scanAreaHeight, { duration: speed / 2, easing: Easing.linear }),
          // Scan up
          withTiming(0, { duration: speed / 2, easing: Easing.linear })
        ),
        -1, // Repeat indefinitely
        false // Don't reverse sequence automatically
      );
    } else {
      // Stop the animation if isActive becomes false
      cancelAnimation(translateY);
      translateY.value = 0; // Reset position
    }

    // Cleanup function to cancel animation on unmount
    return () => cancelAnimation(translateY);
  }, [isActive, scanAreaHeight, speed, translateY]);

  // Define the animated style for the line
  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Only render if active
  if (!isActive) {
    return null;
  }

  return (
    // Container View - Takes up space or overlays based on usage
    // Added overflow-hidden to contain the line
    <View style={{ height: scanAreaHeight }} className="relative w-full overflow-hidden bg-transparent">
      {/* The Scanning Line */}
      <Animated.View
        style={animatedLineStyle}
        // Added absolute positioning to allow translate Y control within the container
        className={cn('h-px w-full absolute top-0 left-0', lineColor)}
      />
      {/* Add more lines here later if desired */}
    </View>
  );
};

LoadingAnimation.displayName = 'LoadingAnimation';

export { LoadingAnimation }; 