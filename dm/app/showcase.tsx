import React from 'react';
import { View } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ComponentShowcase from '~/components/showcase/ComponentShowcase';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

export default function ShowcaseScreen() {
  const handleClose = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen 
        options={{ 
          title: "Component Showcase",
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          // Enable swipe back gesture
          animation: 'slide_from_right',
          gestureEnabled: true,
          // Add a close button
          headerRight: () => (
            <Button 
              variant="ghost" 
              onPress={handleClose} 
              className="px-2"
            >
              <Text className="text-primary-foreground">Close</Text>
            </Button>
          ),
        }} 
      />
      <SafeAreaView className="flex-1">
        <ComponentShowcase />
        
        {/* Floating close button at the bottom */}
        <View className="absolute bottom-0 left-0 right-0 items-center pb-6">
          <Button 
            variant="secondary" 
            onPress={handleClose} 
            className="px-8"
          >
            <Text>Return to HQ</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
