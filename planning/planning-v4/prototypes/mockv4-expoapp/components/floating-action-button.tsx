import React from 'react';
import { SafeAreaView, View, Pressable, Text } from 'react-native';
import Animated, {
  withDelay,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

interface FloatingActionButtonProps {
  isExpanded: SharedValue<boolean>;
  index: number;
  buttonLetter: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ isExpanded, index, buttonLetter }) => {
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;
    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });

  return (
    <AnimatedPressable 
      style={animatedStyles}
      className={cn(
        'absolute h-10 w-10 aspect-square rounded-full items-center justify-center flex-row z-[-2]',
        'bg-secondary shadow-md'
      )}
    >
      <AnimatedText className="text-secondary-foreground font-medium">
        {buttonLetter}
      </AnimatedText>
    </AnimatedPressable>
  );
};

export function TryFloatingActionButton() {
  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  return (
    <SafeAreaView className="flex-1">
      <View className="relative h-[260px] w-full flex justify-end items-center">
        <View className="absolute flex flex-col items-center">
          <AnimatedPressable
            onPress={handlePress}
            className={cn(
              'h-14 w-14 aspect-square rounded-full z-10 flex justify-center items-center shadow-lg',
              'bg-primary'
            )}
          >
            <AnimatedText style={plusIconStyle} className="text-primary-foreground text-2xl">
              +
            </AnimatedText>
          </AnimatedPressable>
          <FloatingActionButton
            isExpanded={isExpanded}
            index={1}
            buttonLetter={'M'}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={2}
            buttonLetter={'W'}
          />
          <FloatingActionButton
            isExpanded={isExpanded}
            index={3}
            buttonLetter={'S'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
