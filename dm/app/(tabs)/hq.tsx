import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HQScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text className="text-white">HQ Screen Content Area</Text>
      {/* Your HQ screen specific content goes here */}
    </View>
  );
}
