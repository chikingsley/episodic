import React from 'react';
import Svg, { SvgProps, Path } from "react-native-svg"

interface UserCircleIconProps extends SvgProps {
  selected?: boolean;
}

const UserCircleIcon = ({ selected = false, ...props }: UserCircleIconProps) => {
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
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
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
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </Svg>
  );
};

export default UserCircleIcon; 