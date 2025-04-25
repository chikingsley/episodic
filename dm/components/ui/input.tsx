// dm/components/ui/input.tsx
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';
import { tailwindColorToHex } from '~/lib/colorUtils';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps & { placeholderClassName?: string }>(
  ({ className, placeholderClassName, ...props }, ref) => {
    // Combine default with provided placeholder class name
    const combinedPlaceholderClass = cn('text-gray-600', placeholderClassName);
    
    // Extract the color from the combined classes
    const placeholderColor = tailwindColorToHex(combinedPlaceholderClass) || '#9ca3af';

    return (
      // IMPORTANT: React Native requires direct color values for placeholderTextColor
      // We must manually convert Tailwind classes to hex colors using tailwindColorToHex
      <TextInput
        ref={ref}
        className={cn(
          'flex h-10 native:h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2',
          'font-jetbrains-mono text-md text-foreground',
          'focus-visible:border-gray-400 dark:focus-visible:border-gray-700',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className
        )}
        placeholderTextColor={placeholderColor}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
