import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

interface MagnifyingGlassCircleIconProps extends SvgProps {
  size?: number;
}

function MagnifyingGlassCircleIcon({ color = 'currentColor', size = 24, ...props }: MagnifyingGlassCircleIconProps) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      width={size}
      height={size}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </Svg>
  );
}

export { MagnifyingGlassCircleIcon };
