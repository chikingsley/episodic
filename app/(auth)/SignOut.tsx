// dm/app/(auth)/SignOut.tsx
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useAuthActions } from "@convex-dev/auth/react";
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { StatusIndicator } from '~/components/ui/status-indicator';

export default function AgentSignOut() {
  const { signOut } = useAuthActions();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-6 justify-center items-center">
        <Card className="border-2 border-red-800/30 bg-black/70">
          <CardHeader>
            <CardTitle>MISSION TERMINATION</CardTitle>
            <CardDescription>SECURE NETWORK DEPARTURE</CardDescription>
          </CardHeader>
          
          <CardContent>
            <View className="items-center justify-center py-2">
              <StatusIndicator status="priority">ACTIVE SESSION</StatusIndicator>
              
              <Text className="text-gray-400 text-sm text-center my-4">
                WARNING: DISCONNECTING FROM SECURE NETWORK WILL TERMINATE ALL ACTIVE MISSION PARAMETERS
              </Text>
              
              <Button 
                variant="destructive" 
                onPress={handleSignOut}
                className="w-64 border-2 border-red-800 bg-black"
              >
                <Text className="text-red-600">TERMINATE SESSION</Text>
              </Button>
            </View>
          </CardContent>
          
          <CardFooter>
            <Text className="text-gray-500 text-xs text-center w-full">
              ALL ACTIVITY LOGS WILL BE RECORDED UPON DEPARTURE
            </Text>
          </CardFooter>
        </Card>
      </View>
      
      {/* Decorative corner elements */}
      <View className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <View className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <View className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <View className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
    </SafeAreaView>
  );
}