import React from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import { FlameIcon, FrFlag } from '~/components/icons';

interface TopNavBarProps {
  streakCount: number;
  // activeTab and onTabChange are no longer needed here
}

export function TopNavBar({ streakCount }: TopNavBarProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-background shadow-sm">
      {/* Left: Flag */}
      <View className="flex-shrink-0">
        <FrFlag className="h-6 w-8" />
      </View>

      {/* Middle: Tabs (Removed) */}
      {/* <View className="flex-row space-x-6"> ... </View> */}
      {/* We might add a title here later if needed */}
      <View className="flex-1" /> {/* Add a flexible spacer */}

      {/* Right: Streaks */}
      <View className="flex-row items-center space-x-2 bg-muted px-3 py-1 rounded-full">
        <FlameIcon className="text-orange-500 h-5 w-5" />
        <Text className="font-bold">{streakCount}</Text>
      </View>
    </View>
  );
} 