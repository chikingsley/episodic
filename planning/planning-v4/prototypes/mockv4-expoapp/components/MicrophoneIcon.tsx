import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cn } from '~/lib/utils';

// SVG path data
const outlineD = "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z";
const solidD = "M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5ZM6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z";

interface MicrophoneIconProps extends ViewProps { // Changed SvgProps to ViewProps for container
  variant?: 'outline' | 'solid';
  size?: number;
  color?: string;
  strokeWidth?: number; // Only used for outline
  className?: string;
  style?: ViewStyle;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({
  variant = 'outline',
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  style,
  ...viewProps
}) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
  };

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={[{ width: size, height: size }, style]}
      {...viewProps}
    >
      {variant === 'outline' && (
        <Svg
          {...svgProps}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        >
          <Path strokeLinecap="round" strokeLinejoin="round" d={outlineD} />
        </Svg>
      )}
      {variant === 'solid' && (
        <Svg
          {...svgProps}
          fill={color}
        >
          <Path d={solidD} />
        </Svg>
      )}
    </View>
  );
};

export default MicrophoneIcon; 