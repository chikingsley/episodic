import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'flex h-10 native:h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2',
          'font-jetbrains-mono text-md text-foreground placeholder:text-muted-foreground',
          'focus-visible:border-gray-400 dark:focus-visible:border-gray-700',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
