import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, Dimensions, TextInputProps, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

// Import your icons (assuming default exports)
import MagnifyingGlassIcon from './magnifying-glass';
import RectangularStackIcon from './rectangular-stack';

// --- Configuration --- 
const ANIMATION_DURATION = 350; // ms
const COLLAPSED_SIZE_CLASS = 'h-14 w-14'; // Use tailwind size class (adjust if needed, e.g., h-12 w-12)
const COLLAPSED_SIZE_NUM = 56; // Numeric value corresponding to the class above
const EXPANDED_HORIZONTAL_PADDING_CLASS = 'px-4'; // p-4 -> 16px
const EXPANDED_HORIZONTAL_PADDING_NUM = 16;
const ICON_SIZE = 24;

interface AnimatedSearchBarProps {
  onSearchSubmit?: (text: string) => void;
}

const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  onSearchSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animationProgress = useSharedValue(0); // 0 = collapsed, 1 = expanded
  const inputRef = useRef<TextInput>(null);
  const { width: windowWidth } = Dimensions.get('window');

  // Calculate expanded width 
  const expandedWidth = windowWidth - (EXPANDED_HORIZONTAL_PADDING_NUM * 2);

  // Trigger animation 
  useEffect(() => {
    animationProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.33, 1, 0.68, 1), 
    });

    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), ANIMATION_DURATION * 0.5);
    } else {
      inputRef.current?.blur();
    }
  }, [isExpanded, animationProgress]);

  // Handler to EXPAND
  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  // Handler to COLLAPSE (for the close button)
  const handleCollapse = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  // --- Animated Styles --- 

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [COLLAPSED_SIZE_NUM, expandedWidth]
    );
    return {
      width: width,
      borderRadius: interpolate(animationProgress.value, [0, 1], [COLLAPSED_SIZE_NUM / 2, 28]), 
    };
  });

  // Moves the Magnifying Glass Icon from right to left
  const movingIconContainerAnimatedStyle = useAnimatedStyle(() => {
    const iconTranslateX = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -(expandedWidth - COLLAPSED_SIZE_NUM)]
    );
    return {
      transform: [{ translateX: iconTranslateX }],
    };
  });

  // Fades in the TextInput
  const inputContainerAnimatedStyle = useAnimatedStyle(() => ({ 
    opacity: interpolate(animationProgress.value, [0.5, 1], [0, 1]),
  }));
  
  // Fades/scales the Close Button (Rectangular Stack)
  const closeButtonAnimatedStyle = useAnimatedStyle(() => ({ 
    opacity: interpolate(animationProgress.value, [0.5, 1], [0, 1]), 
    transform: [{ scale: interpolate(animationProgress.value, [0.5, 1], [0.7, 1]) }],
  }));

  // Style for the initial magnifying glass button (fading OUT)
  const searchButtonAnimatedStyle = useAnimatedStyle(() => ({ 
    opacity: interpolate(animationProgress.value, [0, 0.5], [1, 0]), // Fade out faster
    transform: [{ scale: interpolate(animationProgress.value, [0, 0.5], [1, 0.7]) }], // Scale out faster
  }));

  return (
    // This outer View acts as the positioning anchor set by the parent (hq.tsx)
    // It contains the two absolutely positioned animated elements.
    <View className={COLLAPSED_SIZE_CLASS}> 
      
      {/* 1. Expanding Search Bar Area */}
      {/* This part animates width/radius and contains input + moving icon */}
      {/* Its pointerEvents control interaction with the bar itself */}
      <Animated.View
        style={containerAnimatedStyle} 
        className={cn(
          'absolute right-0 top-0', // Positioned top-right within the anchor
          COLLAPSED_SIZE_CLASS, 
          'bg-muted overflow-hidden justify-center'
        )}
        // Disable direct interaction with this view, use pressables inside/below
        pointerEvents="none" 
      >
        {/* Input field container */}
        <Animated.View 
          style={inputContainerAnimatedStyle} 
          className={cn(
            'absolute top-0 bottom-0 justify-center',
            `left-[${COLLAPSED_SIZE_NUM + EXPANDED_HORIZONTAL_PADDING_NUM}px] right-[${EXPANDED_HORIZONTAL_PADDING_NUM}px]` 
          )}
        >
          <TextInput
            ref={inputRef}
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            onSubmitEditing={(e) => onSearchSubmit?.(e.nativeEvent.text)}
            className="text-foreground text-base flex-1 h-full"
            textAlignVertical="center" 
          />
        </Animated.View>

        {/* Moving Magnifying Glass Icon Container */}
        <Animated.View 
          style={movingIconContainerAnimatedStyle} 
          className={cn(
            'absolute right-0 top-0 bottom-0 items-center justify-center', 
            COLLAPSED_SIZE_CLASS 
          )}
        >
          <View style={{position: 'absolute'}}>
            <MagnifyingGlassIcon size={ICON_SIZE} color="#e5e7eb" /> 
          </View>
        </Animated.View>
      </Animated.View>
      
      {/* 2. Initial Search Button (Magnifying Glass) */}
      {/* This fades/scales OUT and triggers EXPANSION */}
      <Animated.View
          style={[{ position: 'absolute', right: 0, top: 0 }, searchButtonAnimatedStyle]}
          pointerEvents={!isExpanded ? 'auto' : 'none'} // Only interactive when collapsed
      >
          <Pressable 
              onPress={handleExpand} 
              disabled={isExpanded}
              className={cn(
                  COLLAPSED_SIZE_CLASS,
                  'items-center justify-center rounded-full bg-primary' // Original button style
               )}
           >
              <MagnifyingGlassIcon size={ICON_SIZE} color="#e5e7eb" />
          </Pressable>
      </Animated.View>

      {/* 3. Separate Close Button (Rectangular Stack) */}
      {/* This fades/scales IN and triggers COLLAPSE */}
      <Animated.View 
          style={[{ position: 'absolute', right: 0, top: 0 }, closeButtonAnimatedStyle]}
          pointerEvents={isExpanded ? 'auto' : 'none'} // Only interactive when expanded
      >
          <Pressable 
              onPress={handleCollapse} 
              disabled={!isExpanded}
              className={cn(
                  COLLAPSED_SIZE_CLASS,
                  'items-center justify-center rounded-full bg-card' // Style for the close button
               )}
           >
              <RectangularStackIcon variant="outline" size={ICON_SIZE} color="#e5e7eb" /> 
          </Pressable>
      </Animated.View>
    </View>
  );
};

export default AnimatedSearchBar; 