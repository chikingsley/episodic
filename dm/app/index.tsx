import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { DarkMallardLoadingScreen } from '~/components/DarkMallardLoadingScreen';

export default function Index() {
  return (
    <>
      <AuthLoading>
        <View className="flex-1 bg-black justify-center items-center">
          <ActivityIndicator color="#991B1B" size="large" />
          <Text className="mt-4 text-dm-crimson font-mono">ESTABLISHING SECURE CONNECTION...</Text>
        </View>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToAuth />
      </Unauthenticated>
      <Authenticated>
        <RedirectToApp />
      </Authenticated>
    </>
  );
}

function RedirectToAuth() {
  return <Redirect href="/(auth)/SignIn" />;
}

function RedirectToApp() {
  return <Redirect href="/(tabs)/hq" />;
}
