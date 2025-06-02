// DuckLogo.js - Optimized SVG component for React Native
import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

// Create animated components
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

const DuckLogo = ({ size = 80, color = '#991b1b' }) => {
  // Shared values for animations
  const scanLinePosition = useSharedValue(0);
  const logoGlow = useSharedValue(0);
  
  // Start animations
  React.useEffect(() => {
    // Scan line animation
    scanLinePosition.value = withRepeat(
      withTiming(100, { 
        duration: 2000, 
        easing: Easing.linear 
      }),
      -1, // Infinite repetitions
      false // Don't reverse the animation
    );
    
    // Glow effect animation
    logoGlow.value = withRepeat(
      withTiming(1, { 
        duration: 1500,
        easing: Easing.inOut(Easing.ease)
      }),
      -1,
      true // Reverse the animation
    );
  }, []);
  
  // Animated style for scan line
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: 'rgba(220, 38, 38, 0.7)',
      top: `${scanLinePosition.value}%`,
      // Note: shadowColor on Android requires elevation
      shadowColor: '#dc2626',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5
    };
  });
  
  // Animated props for the duck path
  const animatedPathProps = useAnimatedProps(() => {
    return {
      fill: color,
      fillOpacity: 0.8 + (logoGlow.value * 0.2)
    };
  });

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Simplified and optimized path for mobile */}
        <AnimatedPath
          animatedProps={animatedPathProps}
          d="M100,20C60,20,40,50,40,90c0,20,10,40,30,50l-10,40,20-20,20,20,20-20,20,20-10-40c20-10,30-30,30-50C160,50,140,20,100,20z M80,70c5,0,10,5,10,10s-5,10-10,10s-10-5-10-10S75,70,80,70z"
        />
      </Svg>
      <AnimatedView style={scanLineStyle} />
    </View>
  );
};

export default DuckLogo;