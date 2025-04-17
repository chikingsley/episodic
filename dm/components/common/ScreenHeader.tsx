import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

interface ScreenHeaderProps {
  title: string;
  extras?: React.ReactNode;
  RightIconComponent?: React.ComponentType<SvgProps>;
  rightIconProps?: SvgProps;
  headerRightContent?: React.ReactNode;
}

const HEADER_HEIGHT = 44;

export function ScreenHeader({ title, extras, RightIconComponent, rightIconProps, headerRightContent }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { top } = insets;

  return (
    <View
      className="bg-black border-b border-border/50"
      style={{ paddingTop: top }}
    >
      <View 
        className="flex-row items-center justify-between"
        style={{ height: HEADER_HEIGHT }}
      >
        <View className="flex-row items-center flex-1">
          <Text 
            className="text-foreground font-jetbrains-mono text-lg font-bold"
          >
            {title}
          </Text>
          {extras && <View className="ml-3 flex-shrink">{extras}</View>}
        </View>

        <View className="flex-row items-center">
          {RightIconComponent && (
            <View>
              <RightIconComponent {...rightIconProps} />
            </View>
          )}
          {headerRightContent && 
            <View>{headerRightContent}</View>
          }
        </View>
      </View>
    </View>
  );
}
