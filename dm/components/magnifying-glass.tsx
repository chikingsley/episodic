import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cn } from '~/lib/utils'; // Optional: if you plan to use NativeWind

interface MagnifyingGlassIconProps extends PressableProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string; // For Pressable container styling
  style?: ViewStyle; // For Pressable container styling
}

const MagnifyingGlassIcon: React.FC<MagnifyingGlassIconProps> = ({
  size = 24,
  color = 'currentColor', // Default to inherit color like web
  strokeWidth = 1.5,
  className,
  style,
  ...pressableProps
}) => {
  return (
    <Pressable
      className={cn(
        'items-center justify-center', // Basic centering
        className // Allow external classes
      )}
      style={[{ width: size, height: size }, style]} // Apply size and external styles
      {...pressableProps} // Pass down other Pressable props like onPress
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color} // Use the color prop for the stroke
        strokeWidth={strokeWidth}
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </Svg>
    </Pressable>
  );
};

export default MagnifyingGlassIcon; 