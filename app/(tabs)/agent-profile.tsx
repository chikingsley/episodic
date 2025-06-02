import { Text, View, ScrollView } from 'react-native';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { Header } from '~/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export default function AgentProfileScreen() {
  // Navigation function to the component showcase
  const navigateToComponentShowcase = () => {
    router.push('/showcase');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Header>Agent Profile</Header>
      
      {/* Agent Stats Card */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Agent Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="mb-4">Codename: Shadow Linguist</Text>
          <Text className="mb-4">Clearance Level: 3</Text>
          <Text className="mb-4">Field Experience: 1250 XP</Text>
        </CardContent>
      </Card>
      
      {/* Settings Card */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Agent Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="mb-4">Configure your operational parameters.</Text>
          <Button variant="secondary" className="mb-2 w-full">
            <Text>Settings</Text>
          </Button>
        </CardContent>
      </Card>
      
      {/* Developer Tools Card */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Developer Access</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="mb-4">Restricted tools for authorized personnel only.</Text>
          <Button variant="ghost" onPress={navigateToComponentShowcase} className="mb-2 w-full">
            <Text>Component Showcase</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}