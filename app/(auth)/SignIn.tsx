// dm/app/(auth)/SignIn.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Linking } from 'react-native';
import { useAuthActions } from "@convex-dev/auth/react";
import { z } from 'zod';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { StatusIndicator } from '~/components/ui/status-indicator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '~/components/ui/dialog';
import { router } from 'expo-router';

export default function AgentAuthScreen() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState("signIn"); // "signIn" or "signUp"
  const [scanPosition, setScanPosition] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [codename, setCodename] = useState('');

  // Scanning animation - simulated with state changes
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);

  // Zod schemas for form validation
  const signInSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
  });

  const signUpSchema = signInSchema.extend({
    confirmPassword: z.string(),
    codename: z.string().optional()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

  // Validate form using Zod
  const validateForm = () => {
    try {
      if (step === "signIn") {
        signInSchema.parse({ email, password });
      } else {
        signUpSchema.parse({ email, password, confirmPassword, codename });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Get the first error message
        const firstError = error.errors[0];
        setErrorMessage(firstError.message);
        setShowError(true);
      } else {
        setErrorMessage('An error occurred during validation');
        setShowError(true);
      }
      return false;
    }
  };

  // Handle auth process
  const handleAuth = async () => {
    if (!validateForm()) return;

    try {
      setIsAuthenticating(true);

      // Use Convex Auth to handle sign-in/sign-up
      const result = await signIn("password", {
        email,
        password,
        flow: step,
      });

      setIsAuthenticating(false);

      if (result.signingIn) {
        setAuthComplete(true);
        // Add a slight delay before redirecting to show success state
        setTimeout(() => {
          // Navigate to the main app route using the imported router
          // The _layout.tsx will handle redirecting authenticated users
          router.replace('/');
        }, 1500);
      } else {
        // Handle non-immediate sign-in (e.g., email verification needed)
        setErrorMessage('VERIFICATION REQUIRED. CHECK YOUR COMMUNICATION CHANNEL.');
        setShowError(true);
      }
    } catch (error) {
      setIsAuthenticating(false);
      // Type guard to safely access error.message
      const errorMessage = 
        error instanceof Error ? error.message : 'AUTHENTICATION PROTOCOL FAILURE';
      setErrorMessage(errorMessage);
      setShowError(true);
    }
  };

  const toggleMode = () => {
    setStep(step === "signIn" ? "signUp" : "signIn");
    setErrorMessage('');
    setShowError(false);
    setAuthComplete(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-black"
      >
      {/* Background grid - we'll use a View for this */}
      <View className="absolute inset-0 opacity-15">
        {/* This would be better with an actual grid image, but simulating with styling */}
        <View className="absolute inset-0 border-t border-l border-red-500/10" />
      </View>

      {/* Scan line effect - simulated with a View positioned based on state */}
      <View
        className="absolute left-0 right-0 h-0.5 bg-red-500/30"
        style={{ top: `${scanPosition}%` }}
      />

      {/* Header */}
      <View className="z-10 items-center mt-12 mb-8">
        <Text className="text-red-600 text-xl font-jetbrains-mono-bold mb-2 tracking-wide text-center">
          {step === "signIn"
            ? "SECURE CHANNEL VERIFICATION"
            : "ESTABLISH SECURE COMMUNICATION"}
        </Text>
        <Text className="text-gray-400 text-sm text-center px-4 mx-auto max-w-xs">
          {step === "signIn"
            ? "ACCESS CONTROL PROTOCOL ENGAGED"
            : "ENCRYPTION KEY CREATION REQUIRED"}
        </Text>
      </View>

      {/* Main content */}
      <View className="z-10 w-full px-6">
        <Card className="border-2 bg-black">
          <CardHeader>
            <CardTitle className="text-red-500">
              {step === "signIn" ? "AGENT SIGN IN" : "AGENT SIGN UP"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {step === "signIn" ? "CLEARANCE LEVEL: CLASSIFIED" : "INFORMATION CLASSIFICATION: CONFIDENTIAL"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Alternative auth methods */}
            <View className="space-y-2 mb-2">
              {/* Google and Apple auth temporarily disabled until configured */}
              {/* <Button
                variant="outline"
                onPress={() => signIn("google", {})}
                className="mb-2 border-gray-700 bg-black"
              >
                <Text className="text-gray-300">
                  {step === "signIn" ? "LOGIN WITH GOOGLE" : "SIGN UP WITH GOOGLE"}
                </Text>
              </Button>

              <Button
                variant="outline"
                onPress={() => signIn("apple", {})}
                className="border-gray-700 bg-black"
              >
                <Text className="text-gray-300">
                  {step === "signIn" ? "LOGIN WITH APPLE" : "SIGN UP WITH APPLE"}
                </Text>
              </Button> */}

              {/* Anonymous sign-in for testing */}
              <Button
                variant="outline"
                onPress={() => signIn("anonymous", {})}
                className="border-gray-700 bg-black"
              >
                <Text className="text-gray-300">
                  CONTINUE AS GUEST (TEST MODE)
                </Text>
              </Button>
            </View>
            <View className="relative items-center my-4">
              <View className="absolute top-1/2 left-0 right-0 h-px bg-gray-700" />
              <Text className="relative px-2 bg-black text-gray-500 text-xs font-jetbrains-mono-regular">
                OR CONTINUE WITH EMAIL
              </Text>
            </View>

            {/* Email field */}
            <Text className="text-gray-400 text-sm mb-2">
              EMAIL
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="agent@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="mb-4 border-gray-700 bg-black text-gray-300"
            />

            {/* Password field */}
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400 text-sm">
                PASSWORD
              </Text>
              <View className="flex-1 items-end">
                {step === "signIn" && (
                  <Button
                    variant="link"
                    onPress={() => signIn("password", { email, flow: "reset" })}
                    className="p-0 m-0"
                  >
                    <Text className="!font-jetbrains-mono-regular text-red-500 !text-sm underline">
                      Forgot password?
                    </Text>
                  </Button>
                )}
              </View>
            </View>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              secureTextEntry
              className="mb-2 border-gray-700 bg-black text-gray-300"
            />
            <Text className="text-gray-600 text-xs mb-4">
              MINIMUM 8 CHARACTERS, ALPHANUMERIC WITH SPECIAL CHARACTERS
            </Text>

            {/* Confirm Password field - only for sign up */}
            {step === "signUp" && (
              <>
                <Text className="text-gray-400 text-sm mb-2">
                  VERIFY ACCESS PROTOCOL
                </Text>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••••••"
                  secureTextEntry
                  className="mb-4 border-gray-700 bg-black text-gray-300"
                />

                {/* Codename field (optional) - only for sign up */}
                <Text className="text-gray-400 text-sm mb-2">
                  FIELD OPERATIVE DESIGNATION (OPTIONAL)
                </Text>
                <Input
                  value={codename}
                  onChangeText={setCodename}
                  placeholder="Agent codename"
                  className="mb-6 border-gray-700 bg-black text-gray-300"
                />
              </>
            )}

            {/* Auth options */}
            <View className="items-center mb-6">
              <Button
                variant={isAuthenticating ? "inProgress" : "destructive"}
                onPress={handleAuth}
                disabled={isAuthenticating || authComplete}
                className="border-2 border-red-800 bg-black w-64 mb-4"
              >
                <Text className={isAuthenticating ? "text-yellow-500" : "text-red-600"}>
                  {isAuthenticating && "AUTHENTICATING..."}
                  {!isAuthenticating && !authComplete && (step === "signIn" ? "INITIATE SECURE LOGIN" : "SECURE AUTHENTICATION")}
                  {!isAuthenticating && authComplete && "AUTHENTICATION SUCCESSFUL"}
                </Text>
              </Button>

              <Button
                variant="ghost"
                onPress={toggleMode}
                disabled={isAuthenticating || authComplete}
                className="bg-transparent"
              >
                <Text className="text-gray-400">
                  {step === "signIn" ? (
                    <>
                      New Agent? <Text className="underline text-red-500">Sign up</Text> Here
                    </>
                  ) : (
                    <>
                      EXISTING OPERATIVE? <Text className="underline text-red-500">Sign in</Text> Here
                    </>
                  )}
                </Text>
              </Button>
            </View>

            {/* Terms - only for sign up */}
            {step === "signUp" && (
              <Text className="text-gray-500 text-xs text-center mb-4">
                By proceeding, you acknowledge acceptance of our operational protocols and data handling practices as outlined in the Network Security Directive.
              </Text>
            )}

            {/* Terms and Privacy Policy for both sign in and sign up */}
            <Text className="text-gray-500 text-xs text-center mb-4">
              By signing in to DarkMallard, you agree to our <Text className="text-blue-500" onPress={() => { router.push('/legal/terms'); }}>Terms</Text> and <Text className="text-blue-500" onPress={() => { router.push('/legal/privacy'); }}>Privacy Policy</Text>.
              This site is protected by reCAPTCHA Enterprise and the Google Privacy Policy and <Text className="text-blue-500" onPress={() => { Linking.openURL('https://policies.google.com/terms'); }}>Terms of Service</Text> apply.
            </Text>
          </CardContent>

          <CardFooter className="flex-col">

            {/* Confirmation message */}
            {authComplete && (
              <View className="mt-6">
                <Text className="text-green-500 text-center">
                  {step === "signIn"
                    ? "IDENTITY VERIFIED. INITIALIZING MISSION CONTROL..."
                    : "AGENT CREDENTIALS SECURED. PREPARING MISSION CONTROL..."}
                </Text>
              </View>
            )}
          </CardFooter>
        </Card>

        {/* Error Dialog */}
        <Dialog open={showError}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AUTHENTICATION ERROR</DialogTitle>
              <DialogDescription>
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button onPress={() => setShowError(false)}>
                  <Text>ACKNOWLEDGE</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>

      {/* Decorative corner elements */}
      <View className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <View className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <View className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <View className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />

      {/* File classification stamp */}
      {/* <View className="absolute top-5 right-5 z-20" style={{ transform: [{ rotate: '12deg' }] }}>
        <View className="border-2 border-red-700 px-6 py-2">
          <Text className="text-red-700 font-mono text-lg font-bold">
            {step === "signIn" ? "CLASSIFIED" : "CONFIDENTIAL"}
          </Text>
        </View>
      </View> */}

      {/* Footer - Removed absolute positioning to make it part of the normal document flow */}
      <View className="w-full items-center mt-6 mb-6">
        <Text className="font-mono text-gray-600 text-xs">
          {step === "signIn" ? "NETWORK: SECURED" : "ENCRYPTION: AES-256-GCM"}
        </Text>
        <Text className="mt-1 text-gray-500 text-xs">
          {step === "signIn" ? "SESSION TIMEOUT: 15:00" : "SECURE CHANNEL: ESTABLISHED"}
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}