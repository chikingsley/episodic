import type { TextRef, ViewRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';
import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

const Card = React.forwardRef<ViewRef, ViewProps>(({ className, children, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card shadow-sm shadow-foreground/10 overflow-hidden relative',
      className
    )}
    {...props}
  >
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.03)']}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', zIndex: 0 }}
      pointerEvents="none"
    />
    <View style={{ zIndex: 1 }}>{children}</View>
  </View>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-col space-y-1.5 p-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<TextRef, React.ComponentPropsWithoutRef<typeof Text>>(
  ({ className, ...props }, ref) => (
    <Text
      role='heading'
      aria-level={3}
      ref={ref}
      className={cn(
        'text-base text-card-foreground font-mono font-medium leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<TextRef, TextProps>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn('font-mono text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <TextClassContext.Provider value='text-card-foreground font-mono text-base'>
    <View ref={ref} className={cn('p-4 pt-0', className)} {...props} />
  </TextClassContext.Provider>
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<ViewRef, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-row items-center p-4 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
