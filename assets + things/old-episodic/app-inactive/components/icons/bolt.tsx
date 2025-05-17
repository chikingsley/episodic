import React from 'react';
import Svg, { SvgProps, Path } from "react-native-svg"

interface BoltIconProps extends SvgProps {
  selected?: boolean;
}

const BoltIcon = ({ selected = false, ...props }: BoltIconProps) => {
  if (selected) {
    return (
      <Svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className="size-6"
        {...props}
      >
        <Path
          fillRule="evenodd"
          d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
          clipRule="evenodd"
        />
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
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    </Svg>
  );
};

export default BoltIcon; 