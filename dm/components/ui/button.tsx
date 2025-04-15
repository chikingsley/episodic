import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'group flex items-center justify-center rounded-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive text-destructive-foreground web:hover:opacity-90 active:opacity-90',
        outline:
          'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground web:hover:opacity-80 active:opacity-80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'text-primary web:underline-offset-4 web:hover:underline web:focus:underline',
        crimson: 'bg-dm-crimson text-primary-foreground border-2 border-dm-crimson web:hover:opacity-90 active:opacity-90',
        'crimson-outline': 'border-2 border-dm-crimson text-dm-crimson bg-transparent web:hover:bg-dm-crimson/10 active:bg-dm-crimson/20',
      },
      size: {
        default: 'h-auto px-4 py-3 native:px-5',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-8 native:h-14',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-sm font-medium web:transition-colors font-mono',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-accent-foreground group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'text-accent-foreground group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
        crimson: 'text-primary-foreground',
        'crimson-outline': 'text-dm-crimson group-active:text-dm-crimson',
      },
      size: {
        default: 'native:text-base',
        sm: 'native:text-sm',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const textClass = cn(
      props.disabled && 'web:pointer-events-none',
      buttonTextVariants({ variant, size })
    );

    return (
      <TextClassContext.Provider value={textClass}>
        <Pressable
          className={cn(
            props.disabled && 'opacity-50 web:pointer-events-none',
            buttonVariants({ variant, size, className })
          )}
          ref={ref}
          role='button'
          {...props}
        />
      </TextClassContext.Provider>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
