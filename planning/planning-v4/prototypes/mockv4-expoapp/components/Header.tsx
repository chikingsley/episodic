import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '~/components/ui/text'; // Import your custom Text
import { cn } from '~/lib/utils';
// Import the correct prop type
import type { SlottableTextProps } from '@rn-primitives/types'; 

// Adjusted interface to extend SlottableTextProps instead of ViewProps 
// as we are primarily styling the Text component itself.
interface HeaderProps extends SlottableTextProps {
  // No need for textProps, as we extend the Text props directly.
}

// Removed ViewProps from React.FC type, extend SlottableTextProps
const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  return (
    <Text
      role="heading" // Accessibility: Indicate it's a heading
      aria-level={2}  // Accessibility: Assuming level 2, adjust as needed
      className={cn(
        'font-jetbrains-mono-bold text-xl text-foreground mt-6 mb-4',
        className // Allow overriding styles
      )}
      {...props} // Pass down Text props
    >
      {children}
    </Text>
  );
};

Header.displayName = 'Header';

export { Header }; 