import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all auth screens
        animation: 'fade', // Use fade animation for transitions
        contentStyle: { backgroundColor: 'black' }, // Match your dark theme
      }}
    />
  );
}
