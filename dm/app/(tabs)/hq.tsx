import { View } from 'react-native';
import React, { useState } from 'react';
import { Text } from '~/components/ui/text'; // Import your custom Text
import { Button } from '~/components/ui/button';
import { ScrollView } from 'react-native'; // Correct import for ScrollView
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'; // Import Card components
import { Input } from '~/components/ui/input'; // Import Input component
import { Progress } from '~/components/ui/progress'; // Import ProgressBar component
import { Switch } from '~/components/ui/switch'; // Import Switch component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '~/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import AlertCircle from '~/lib/icons/AlertCircle';
import { TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';
import { Tooltip } from '~/components/ui/tooltip';
import { Header } from '~/components/Header';
import { StatusIndicator } from '~/components/ui/status-indicator';
import { ThemedLoadingScreen } from '~/components/ThemedLoadingScreen';
import { DarkMallardLoadingScreen } from '~/components/DarkMallardLoadingScreen';


export default function HQScreen() {
  const [isSwitchOn, setIsSwitchOn] = useState(false); // Or true if you want it initially on
  // State for loading screens visibility
  const [showThemedLoading, setShowThemedLoading] = useState(false);
  const [showDarkMallardLoading, setShowDarkMallardLoading] = useState(false); // New state

  // Handler for the themed loading button
  const handleShowThemedLoading = () => {
    setShowThemedLoading(true);
  };

  // Handler for the Dark Mallard loading button
  const handleShowDarkMallardLoading = () => {
    setShowDarkMallardLoading(true);
  };

  // Handler for when the themed loading animation completes
  const handleThemedLoadingComplete = () => {
    setShowThemedLoading(false);
    alert('Themed loading finished!');
  };

  // Handler for when the Dark Mallard loading animation completes
  const handleDarkMallardLoadingComplete = () => {
    setShowDarkMallardLoading(false);
    alert('Dark Mallard loading finished!');
  };

  return (
    <>
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Header>Loading Screen Tests</Header>

      {/* Loading Screen Test Buttons */}
      <Button onPress={handleShowThemedLoading} className="mb-4 w-full">
        <Text>Show Simple Loading</Text>
      </Button>
      
      <Button onPress={handleShowDarkMallardLoading} className="mb-4 w-full" variant="destructive">
        <Text className="text-destructive-foreground">Show Dark Mallard Loading</Text>
      </Button>
      
      <Header>Button Variants</Header>

      {/* Default Variants */}
      <Button onPress={() => alert('Default pressed')} className="mb-4 w-full">
        <Text>Default Button</Text>
      </Button>
      <Button variant="secondary" onPress={() => alert('Secondary pressed')} className="mb-4 w-full">
        <Text>Secondary Button</Text>
      </Button>
      <Button variant="destructive" onPress={() => alert('Destructive pressed')} className="mb-4 w-full">
        <Text>Destructive Button</Text>
      </Button>
      <Button variant="outline" onPress={() => alert('Outline pressed')} className="mb-4 w-full">
        <Text>Outline Button</Text>
      </Button>
      <Button variant="ghost" onPress={() => alert('Ghost pressed')} className="mb-4 w-full">
        <Text>Ghost Button</Text>
      </Button>
      <Button variant="link" onPress={() => alert('Link pressed')} className="mb-4 w-full">
        <Text>Link Button</Text>
      </Button>
      <Button variant="inProgress" onPress={() => alert('In Progress pressed')} className="mb-4 w-full">
        <Text>In Progress Button</Text>
      </Button>
      <Button variant="completed" onPress={() => alert('Completed pressed')} className="mb-4 w-full">
        <Text>Completed Button</Text>
      </Button>
      <Button variant="locked" onPress={() => alert('Locked pressed')} className="mb-4 w-full">
        <Text>Locked Button</Text>
      </Button>
      <Button variant="clearance" onPress={() => alert('Clearance pressed')} className="mb-4 w-full">
        <Text>Clearance Button</Text>
      </Button>
      <Button variant="electric" onPress={() => alert('Electric pressed')} className="mb-4 w-full">
        <Text>Electric Button</Text>
      </Button>

      {/* Sizes */}
      <Header>Button Sizes</Header>
      <Button size="sm" onPress={() => alert('Small pressed')} className="mb-4 w-full">
        <Text>Small Button</Text>
      </Button>
      <Button size="default" onPress={() => alert('Default Size pressed')} className="mb-4 w-full">
        <Text>Default Size Button</Text>
      </Button>
      <Button size="lg" onPress={() => alert('Large pressed')} className="mb-4 w-full">
        <Text>Large Button</Text>
      </Button>
      {/* Disabled State */}
      <Header>Disabled State</Header>
      <Button disabled onPress={() => alert('Disabled pressed')} className="mb-4 w-full">
        <Text>Disabled Button</Text>
      </Button>

      {/* Card Example */}
      <Header>Card Example</Header>
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Mission Dossier</CardTitle>
          <CardDescription>Operation: Silent Echo</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Agent, your next objective involves infiltrating the Crimson Citadel. Proceed with caution.</Text>
        </CardContent>
        <CardFooter>
          <Text className="text-sm text-muted-foreground">Classification: Top Secret</Text>
        </CardFooter>
      </Card>

      {/* Input Example */}
      <Header>Input Example</Header>
      <Input
        placeholder="Enter agent codename..."
        className="w-full mb-4"
      />
      <Input
        placeholder="Disabled Input"
        editable={false}
        className="w-full mb-4"
      />

      {/* Input Example */}
      <Header>Progress Bar Example</Header>
      <Progress value={50} />

      {/* Switch Example */}
      <Header>Switch Example</Header>
      <Switch checked={isSwitchOn} onCheckedChange={() => setIsSwitchOn(!isSwitchOn)} />

      {/* Text Example */}
      <Header>Text Example</Header>
      <Text>Hello World</Text>

      {/* Dialog Example */}
      <Header>Dialog Example</Header>
      <Dialog>
        <DialogTrigger asChild>
          <Button><Text>Open Dialog</Text></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CONFIRMATION REQUIRED</DialogTitle>
            <DialogDescription>
              Agent, confirm authorization for Operation Chimera. Proceeding without confirmation may compromise mission integrity.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">
                <Text className="text-secondary-foreground">CANCEL</Text>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>
                <Text className="text-primary-foreground">CONFIRM</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Example */}
      <Header>Alert Example</Header>
      <Alert className="w-full" icon={AlertCircle}>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert Description</AlertDescription>
      </Alert>

      {/* Tooltip Example */}
      <Header>Tooltip Example</Header>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button><Text>Open Tooltip</Text></Button>
        </TooltipTrigger>
        <TooltipContent>
          <Text>Secure Channel: Encrypted</Text>
        </TooltipContent>
      </Tooltip>

      {/* Added Status Indicator Examples */}
      <Header>Status Indicator Examples</Header>
      <View className="flex-row flex-wrap justify-center gap-2 mb-4">
        <StatusIndicator status="active">ACTIVE</StatusIndicator>
        <StatusIndicator status="completed">COMPLETED</StatusIndicator>
        <StatusIndicator status="inProgress">IN PROGRESS</StatusIndicator>
        <StatusIndicator status="locked">LOCKED</StatusIndicator>
        <StatusIndicator status="level">LVL.07</StatusIndicator>
        <StatusIndicator status="priority">PRIORITY</StatusIndicator>
        <StatusIndicator status="destructive">ERROR</StatusIndicator>
      </View>
      
    </ScrollView>
    
    {/* Render ThemedLoadingScreen conditionally */}
    <ThemedLoadingScreen 
        isLoading={showThemedLoading} 
        onLoadingComplete={handleThemedLoadingComplete} 
    />
    
    {/* Render DarkMallardLoadingScreen conditionally */}
    <DarkMallardLoadingScreen 
        isLoading={showDarkMallardLoading} 
        onLoadingComplete={handleDarkMallardLoadingComplete}
        duration={6000} // Make it a bit longer to see all animations
    />
    </>
  );
}
