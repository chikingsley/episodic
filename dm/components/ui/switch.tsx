import * as SwitchPrimitives from '@rn-primitives/switch';
import * as React from 'react';
import { Platform } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

// Style resembling security switches: Red (destructive) for ON, Gray (secondary) for OFF

const SwitchWeb = React.forwardRef<SwitchPrimitives.RootRef, SwitchPrimitives.RootProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        'peer flex-row h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-100 dark:border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed',
        // Use destructive (red) when checked, secondary (gray) when unchecked
        props.checked ? 'bg-destructive' : 'bg-secondary',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5 ring-0 transition-transform',
          props.checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  )
);

SwitchWeb.displayName = 'SwitchWeb';

// Approximate RGB values for destructive and secondary colors from theme
// These should ideally match your global.css variables accurately
const RGB_COLORS = {
  light: {
    destructive: 'rgb(239, 68, 68)',     // approx red-500
    secondary: 'rgb(241, 242, 245)',   // approx gray-100/200
  },
  dark: {
    destructive: 'rgb(220, 60, 60)',     // approx red-600/700
    secondary: 'rgb(38, 38, 41)',       // approx gray-800
  },
} as const;

const SwitchNative = React.forwardRef<SwitchPrimitives.RootRef, SwitchPrimitives.RootProps>(
  ({ className, ...props }, ref) => {
    const { colorScheme } = useColorScheme();
    const translateX = useDerivedValue(() => (props.checked ? 18 : 0));
    const animatedRootStyle = useAnimatedStyle(() => {
      // Interpolate between secondary (off) and destructive (on)
      return {
        backgroundColor: interpolateColor(
          translateX.value,
          [0, 18],
          [RGB_COLORS[colorScheme].secondary, RGB_COLORS[colorScheme].destructive]
        ),
      };
    });
    const animatedThumbStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(translateX.value, { duration: 200 }) }],
    }));
    return (
      <Animated.View
        style={animatedRootStyle}
        className={cn('h-8 w-[46px] rounded-full', props.disabled && 'opacity-50')}
      >
        <SwitchPrimitives.Root
          className={cn(
            'flex-row h-8 w-[46px] shrink-0 items-center rounded-full border-2 border-gray-300 dark:border-transparent',
             // These classes might not be strictly necessary due to Animated.View styling, but kept for potential fallback/web consistency
            props.checked ? 'bg-destructive' : 'bg-secondary',
            className
          )}
          {...props}
          ref={ref}
        >
          <Animated.View style={animatedThumbStyle}>
            <SwitchPrimitives.Thumb
              className={'h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0'}
            />
          </Animated.View>
        </SwitchPrimitives.Root>
      </Animated.View>
    );
  }
);
SwitchNative.displayName = 'SwitchNative';

const Switch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
});

export { Switch };
