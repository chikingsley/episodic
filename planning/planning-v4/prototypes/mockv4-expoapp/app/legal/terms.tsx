import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

// TODO: Complete terms of service content with actual legal text and additional sections

export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-4">
        <ScrollView className="flex-1">
          <Text className="text-red-500 text-2xl mb-6">DARK MALLARD TERMS OF SERVICE</Text>
          
          <Text className="text-gray-300 mb-4">
            Last Updated: April 17, 2025
          </Text>
          
          <Text className="text-gray-400 mb-6">
            Welcome to Dark Mallard, the immersive language learning platform where you take on the role of an undercover agent. 
            These Terms of Service ("Terms") govern your access to and use of the Dark Mallard application.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">1. ACCEPTANCE OF TERMS</Text>
          <Text className="text-gray-400 mb-6">
            By accessing or using Dark Mallard, you agree to be bound by these Terms. If you do not agree to these Terms, 
            you may not access or use the Service.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">2. PRIVACY POLICY</Text>
          <Text className="text-gray-400 mb-6">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Dark Mallard, 
            to understand our practices.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">3. USER ACCOUNTS</Text>
          <Text className="text-gray-400 mb-6">
            When you create an account with us, you must provide accurate and complete information. You are responsible for 
            safeguarding your password and for all activities that occur under your account.
          </Text>
          
          <Button 
            onPress={() => router.back()} 
            className="mt-6 border-2 border-red-800 bg-black"
          >
            <Text className="text-red-600">RETURN TO PREVIOUS SCREEN</Text>
          </Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
