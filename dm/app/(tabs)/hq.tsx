import { View } from 'react-native';
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

export default function HQScreen() {
  return (
    // Use ScrollView in case content overflows
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text className="text-xl font-heading mb-4 text-foreground">Button Variants</Text>

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

      {/* Sizes */}
      <Text className="text-xl font-heading mt-6 mb-4 text-foreground">Button Sizes</Text>
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
      <Text className="text-xl font-heading mt-6 mb-4 text-foreground">Disabled State</Text>
      <Button disabled onPress={() => alert('Disabled pressed')} className="mb-4 w-full">
        <Text>Disabled Button</Text>
      </Button>

      {/* Card Example */}
      <Text className="text-xl font-heading mt-6 mb-4 text-foreground">Card Example</Text>
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
      <Text className="text-xl font-heading mt-6 mb-4 text-foreground">Input Example</Text>
      <Input
        placeholder="Enter agent codename..."
        className="w-full mb-4"
      />
      <Input
        placeholder="Disabled Input"
        editable={false}
        className="w-full mb-4"
      />

    </ScrollView>
  );
}
