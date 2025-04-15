import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Text } from '~/components/ui/text'; // Import base Text
import { cn } from '~/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define variants for the indicator container using CVA
const statusIndicatorVariants = cva(
  // Base styles from mock: small padding, rounded, border
  'inline-flex items-center justify-center px-2 py-0.5 rounded-sm border',
  {
    variants: {
      status: {
        // Colors based on mock styles & button variants
        active: 'border-green-700 bg-green-400/30',
        completed: 'border-green-700 bg-green-500/30',
        inProgress: 'border-yellow-700 bg-yellow-500/20',
        locked: 'border-gray-700 bg-muted',
        level: 'border-red-800 bg-red-100', // For things like LVL.07
        priority: 'border-red-600 bg-red-900', // For the "PRIORITY" tag
        destructive: 'border-destructive bg-destructive/30', // Generic destructive/error
      },
    },
    defaultVariants: {
      status: 'locked', // Default to locked/neutral appearance
    },
  }
);

// Define variants for the text inside the indicator
const statusIndicatorTextVariants = cva(
  // Base text style: small, mono
  'text-xs font-jetbrains-mono-bold uppercase',
  {
    variants: {
      status: {
        active: 'text-green-500',
        completed: 'text-green-700',
        inProgress: 'text-yellow-600',
        locked: 'text-muted-foreground',
        level: 'text-red-500',
        priority: 'text-white', // Priority tag had white text
        destructive: 'text-destructive',
      },
    },
    defaultVariants: {
      status: 'locked',
    },
  }
);

// Define the props for the component
interface StatusIndicatorProps
  extends ViewProps, // Allow passing standard View props (like style, className)
    VariantProps<typeof statusIndicatorVariants> { // Include variants from CVA
  // Status is required
  status: NonNullable<VariantProps<typeof statusIndicatorVariants>['status']>;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  className,
  status,
  children,
  ...props
}) => {
  return (
    <View
      className={cn(statusIndicatorVariants({ status }), className)} // Apply container styles
      {...props}
    >
      <Text className={cn(statusIndicatorTextVariants({ status }))}> {/* Apply text styles */}
        {children} {/* Display the text passed in */}
      </Text>
    </View>
  );
};

StatusIndicator.displayName = 'StatusIndicator';

export { StatusIndicator, statusIndicatorVariants }; // Export component and variants 