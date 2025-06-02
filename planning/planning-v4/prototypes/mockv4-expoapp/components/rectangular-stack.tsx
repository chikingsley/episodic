import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cn } from '~/lib/utils';

// Path data from provided SVGs
const outlineD = "M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122";
const solidD = "M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.683 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z";

interface RectangularStackIconProps extends ViewProps {
  variant?: 'outline' | 'solid';
  size?: number;
  color?: string;
  strokeWidth?: number; // Only used for outline
  className?: string;
  style?: ViewStyle;
}

const RectangularStackIcon: React.FC<RectangularStackIconProps> = ({
  variant = 'outline',
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  style,
  ...viewProps
}) => {
  // Define common SvgProps here to pass down
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
          {...svgProps} // Spread common props
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        >
          <Path strokeLinecap="round" strokeLinejoin="round" d={outlineD} />
        </Svg>
      )}
      {variant === 'solid' && (
        <Svg
          {...svgProps} // Spread common props
          fill={color} // Solid uses fill, not stroke
        >
          <Path d={solidD} />
        </Svg>
      )}
    </View>
  );
};

export default RectangularStackIcon; 