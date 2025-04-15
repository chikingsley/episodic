import React from 'react';
import Svg, { SvgProps, Path } from "react-native-svg"

interface HomeIconProps extends SvgProps {
  selected?: boolean;
}

const HomeIcon = ({ selected = false, ...props }: HomeIconProps) => {
  if (selected) {
    return (
      <Svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className="size-6"
        {...props}
      >
        <Path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
        <Path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
      </Svg>
    );
  }

  return (
    <Svg
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-6"
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </Svg>
  );
};

export default HomeIcon;
