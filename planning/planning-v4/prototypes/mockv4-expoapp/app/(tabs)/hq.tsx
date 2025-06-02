import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HQScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <Text className="text-foreground text-2xl font-bold mb-4">Headquarters</Text>
      
        
        <Text className="text-foreground mt-4">HQ Screen Content Area</Text>
      </View>
    </SafeAreaView>
  );
}
