import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text } from '~/components/ui/text'; 
import { Button } from '~/components/ui/button';
import { ScrollView } from 'react-native'; 
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'; 
import { SafeAreaView } from 'react-native-safe-area-context';

// Import custom HQ components
import HQHeader from '~/components/hq/HQHeader';
import AgentStatusPanel from '~/components/hq/AgentStatusPanel';
import MissionCard, { MissionStatus } from '~/components/hq/MissionCard';

// Mock data for missions
const MOCK_MISSIONS = [
  {
    id: 'm1',
    title: 'Hotel Check-in',
    description: 'Establish your cover identity at the Grand Palais Hotel in Cannes. You must convince the front desk staff of your identity as a Canadian film industry professional.',
    status: 'inProgress' as MissionStatus,
    difficulty: 2 as const,
    xpReward: 120,
    estimatedTime: '15 min',
    progress: 60
  },
  {
    id: 'm2',
    title: 'Room Service Request',
    description: 'Establish presence in hotel and build initial staff rapport. Practice food vocabulary and courtesy phrases.',
    status: 'available' as MissionStatus,
    difficulty: 1 as const,
    xpReward: 100,
    estimatedTime: '10 min',
    progress: 0
  },
  {
    id: 'm3',
    title: 'Café Reconnaissance',
    description: 'Identify potential asset at local café. Practice ordering and conversation skills in a casual setting.',
    status: 'locked' as MissionStatus,
    difficulty: 3 as const,
    xpReward: 150,
    estimatedTime: '20 min',
    progress: 0
  }
];

// Mock data for agent stats
const MOCK_AGENT_STATS = {
  codename: "DARK MALLARD",
  level: 7,
  xp: 1250,
  xpTarget: 2000,
  coverIntegrity: 87,
  streak: 3,
  streakTarget: 7,
  status: 'active' as const
};

export default function HQScreen() {
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const [missions, setMissions] = useState(MOCK_MISSIONS);
  const [agentStats, setAgentStats] = useState(MOCK_AGENT_STATS);
  
  // Handle mission card press
  const handleMissionPress = (missionId: string) => {
    setExpandedMission(prev => prev === missionId ? null : missionId);
  };
  
  // Handle mission action button press
  const handleMissionAction = (missionId: string) => {
    // In a real app, this would navigate to the mission screen or start the mission
    console.log(`Starting mission: ${missionId}`);
  };

  return (
    <SafeAreaView edges={['right', 'left']} className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* HQ Header with agent codename and status */}
        <HQHeader agentCodename={agentStats.codename} isConnected={true} />
        
        {/* Agent Status Panel */}
        <AgentStatusPanel stats={agentStats} />
        
        {/* Missions Section */}
        <View className="mb-6">
          <Text className="text-xs font-jetbrains-mono text-muted-foreground mb-3">ACTIVE MISSIONS</Text>
          
          {/* Mission Cards */}
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              status={mission.status}
              difficulty={mission.difficulty}
              xpReward={mission.xpReward}
              estimatedTime={mission.estimatedTime}
              progress={mission.progress}
              expanded={expandedMission === mission.id}
              onPress={() => handleMissionPress(mission.id)}
            />
          ))}
        </View>
        
        {/* Quick Actions Section */}
        <View className="mb-6">
          <Text className="text-xs font-jetbrains-mono text-muted-foreground mb-3">TACTICAL OPERATIONS</Text>
          
          <View className="flex-row space-x-2 mb-4">
            <Button 
              className="flex-1 border border-destructive/30 bg-background"
              onPress={() => console.log('Tactical Drills')}
            >
              <View className="items-center">
                <Text className="text-lg mb-1">🎯</Text>
                <Text className="font-jetbrains-mono-bold text-xs">TACTICAL DRILLS</Text>
              </View>
            </Button>
            
            <Button 
              className="flex-1 border border-destructive/30 bg-background"
              onPress={() => console.log('Field Communications')}
            >
              <View className="items-center">
                <Text className="text-lg mb-1">🗣️</Text>
                <Text className="font-jetbrains-mono-bold text-xs">FIELD COMMS</Text>
              </View>
            </Button>
          </View>
          
          <Button 
            variant="destructive"
            className="w-full"
            onPress={() => console.log('Resume Mission')}
          >
            <Text className="text-destructive-foreground">RESUME ACTIVE MISSION</Text>
          </Button>
        </View>
        
        {/* Intelligence Briefing Section */}
        <View className="mb-6">
          <Text className="text-xs font-jetbrains-mono text-muted-foreground mb-3">INTELLIGENCE UPDATES</Text>
          
          <Card className="w-full mb-4 border-destructive/30 bg-background/80">
            <CardHeader className="pb-2">
              <View className="flex-row justify-between items-center">
                <CardTitle className="font-jetbrains-mono-bold text-sm">New Asset Available</CardTitle>
                <View className="px-2 py-0.5 bg-destructive/10 rounded">
                  <Text className="text-xs text-destructive font-jetbrains-mono">HIGH PRIORITY</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="text-xs text-muted-foreground mb-2">
                Hotel concierge appears receptive to recruitment. Build rapport to unlock specialized vocabulary.
              </Text>
              <Text className="text-xs text-muted-foreground/60">07:42</Text>
            </CardContent>
          </Card>
          
          <Card className="w-full mb-4 border-yellow-600/30 bg-background/80">
            <CardHeader className="pb-2">
              <View className="flex-row justify-between items-center">
                <CardTitle className="font-jetbrains-mono-bold text-sm">Cover Warning</CardTitle>
                <View className="px-2 py-0.5 bg-yellow-900/30 rounded">
                  <Text className="text-xs text-yellow-500 font-jetbrains-mono">MEDIUM PRIORITY</Text>
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="text-xs text-muted-foreground mb-2">
                Security presence increased at hotel. Maintain professional demeanor and avoid drawing attention.
              </Text>
              <Text className="text-xs text-muted-foreground/60">06:15</Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
