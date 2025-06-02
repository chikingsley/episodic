import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

interface ScreenHeaderProps {
  title: string | React.ReactNode;
  extras?: React.ReactNode;
  RightIconComponent?: React.ComponentType<SvgProps>;
  rightIconSize?: number;
  rightIconColor?: string;
  headerRightContent?: React.ReactNode;
}

const HEADER_HEIGHT = 44;

export function ScreenHeader({ 
  title, 
  extras, 
  RightIconComponent, 
  rightIconSize = 28, 
  rightIconColor, 
  headerRightContent 
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { top } = insets;

  return (
    <View className="bg-background border-b border-border/50 px-4" style={{ paddingTop: top }}>
      <View className="flex-row items-center justify-between" style={{ height: HEADER_HEIGHT }}>
        <View className="flex-row items-center flex-1">
          <Text className="text-3xl font-bold text-foreground">
            {title}
          </Text>
          {extras && <View className="ml-3 flex-shrink">{extras}</View>}
        </View>

        <View className="flex-row items-center gap-2">
          {RightIconComponent && (
            <View>
              <RightIconComponent 
                width={rightIconSize} 
                height={rightIconSize} 
                color={rightIconColor} 
              />
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
