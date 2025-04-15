import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import Svg, { Circle, G } from 'react-native-svg';

// 4pt system values
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

// Custom SVG component for the Iron Tier badge
const IronBadge = ({ size = 120 }: { size?: number }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="55" fill="#D8BFB0" />
      <Circle cx="60" cy="60" r="45" fill="#C6A99A" />
      <Circle cx="60" cy="60" r="25" fill="#A38678" />
    </Svg>
  );
};

const TIER_DATA = [
  { letter: 'A', name: 'Alex J.', xp: 1240, isUser: false },
  { letter: 'S', name: 'Sarah P.', xp: 980, isUser: false },
  { letter: 'R', name: 'Ryan M.', xp: 750, isUser: true },
  { letter: 'G', name: 'Grace L.', xp: 620, isUser: false },
  { letter: 'P', name: 'Patrick H.', xp: 450, isUser: false },
];

export default function Leagues() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing['3xl'] }} 
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: spacing.lg }}>
        {/* Current Tier */}
        <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'] }}>
          <View style={{ marginBottom: spacing.lg }}>
            <IronBadge />
          </View>
          <Text 
            style={{ 
              fontSize: 36, 
              fontWeight: 'bold', 
              color: theme.text,
              marginBottom: spacing['2xl'] 
            }}
          >
            Iron Tier
          </Text>
        </View>
        
        {/* League Rankings */}
        <View style={{ 
          backgroundColor: theme.card, 
          borderRadius: 12, 
          padding: spacing.lg,
          marginBottom: spacing.xl,
        }}>
          {TIER_DATA.map((player, index) => (
            <View 
              key={player.letter} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                paddingVertical: spacing.md,
                borderBottomWidth: index < TIER_DATA.length - 1 ? 1 : 0,
                borderBottomColor: theme.border,
              }}
            >
              {/* Rank Letter */}
              <View style={{ 
                height: 48,
                width: 48, 
                borderRadius: 24, 
                backgroundColor: player.isUser ? theme.purple : theme.border,
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: spacing.lg,
              }}>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  color: player.isUser ? '#ffffff' : theme.text
                }}>
                  {player.letter}
                </Text>
              </View>
              
              {/* Player Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  fontWeight: player.isUser ? 'bold' : 'normal',
                  color: theme.text,
                  fontSize: 16,
                }}>
                  {player.name}
                </Text>
                <Text style={{ 
                  color: theme.inactive, 
                  fontSize: 14,
                  marginTop: spacing.xs
                }}>
                  {player.xp} XP
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View 
                style={{ 
                  flex: 1.5, 
                  height: spacing.sm, 
                  backgroundColor: 'rgba(0,0,0,0.05)', 
                  borderRadius: spacing.xs 
                }}
              >
                <View 
                  style={{ 
                    height: '100%', 
                    width: `${(player.xp / 1500) * 100}%`, 
                    backgroundColor: player.isUser ? theme.purple : theme.border,  
                    borderRadius: spacing.xs 
                  }} 
                />
              </View>
            </View>
          ))}
        </View>
        
        {/* Join Button */}
        <View style={{ 
          alignItems: 'center', 
          marginTop: 'auto', 
          paddingBottom: spacing.xl 
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: theme.text,
            marginBottom: spacing.sm
          }}>
            Join the competition
          </Text>
          <Text style={{ 
            color: theme.inactive,
            marginBottom: spacing.xl,
            textAlign: 'center'
          }}>
            Complete a lesson to join this week's Leagues
          </Text>
          
          <Pressable 
            style={{ 
              backgroundColor: theme.purple,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xl,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Start a Lesson
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
