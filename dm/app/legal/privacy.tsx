import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

// TODO: Complete privacy policy content with actual legal text and additional sections

export default function PrivacyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 p-4">
        <ScrollView className="flex-1">
          <Text className="text-red-500 text-2xl mb-6">DARK MALLARD PRIVACY POLICY</Text>
          
          <Text className="text-gray-300 mb-4">
            Last Updated: April 17, 2025
          </Text>
          
          <Text className="text-gray-400 mb-6">
            Dark Mallard is committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
            and disclose information about you when you use our language learning application.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">1. INFORMATION WE COLLECT</Text>
          <Text className="text-gray-400 mb-6">
            We collect information you provide directly to us, such as when you create an account, update your profile, 
            use interactive features, participate in contests, or communicate with us. This may include your name, email address, 
            password, language preferences, and learning progress.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">2. HOW WE USE YOUR INFORMATION</Text>
          <Text className="text-gray-400 mb-6">
            We use the information we collect to provide, maintain, and improve our Services, including to track your progress, 
            personalize your learning experience, and adapt our content to your skill level and interests.
          </Text>
          
          <Text className="text-red-500 text-xl mb-4">3. DATA SECURITY</Text>
          <Text className="text-gray-400 mb-6">
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
            storage is 100% secure.
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
