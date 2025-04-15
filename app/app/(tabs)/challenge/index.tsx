import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { FlameIcon } from '~/components/icons';
import Svg, { Circle, Path } from 'react-native-svg';

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

// Custom Trophy icon component
const TrophyIcon = ({ size = 24, color = "#FFD700" }: { size?: number, color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.21 16.83v1.17C8.21 19.1 9.16 20 10.26 20h3.48c1.1 0 2.05-.9 2.05-2v-1.17"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16c-3.97 0-7.19-3.22-7.19-7.19V4c0-.55.45-1 1-1h12.38c.55 0 1 .45 1 1v4.81c0 3.97-3.22 7.19-7.19 7.19ZM4.81 9c-.67 0-1.21-.54-1.21-1.21V4.21C3.6 3.54 4.14 3 4.81 3M19.19 9c.67 0 1.21-.54 1.21-1.21V4.21c0-.67-.54-1.21-1.21-1.21"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Custom Calendar icon component
const CalendarIcon = ({ size = 24, color = "#6E56CF" }: { size?: number, color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.694 13.7h.009M15.694 16.7h.009M11.995 13.7h.009M11.995 16.7h.009M8.295 13.7h.01M8.295 16.7h.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Type definitions
interface ProgressBarProps {
  progress: number;
  icon: React.ReactNode;
  color?: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color?: string;
}

// Progress component with icon
const ProgressBar = ({ progress, icon, color }: ProgressBarProps) => {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ marginRight: spacing.md }}>{icon}</View>
      <View style={{ 
        flex: 1, 
        height: spacing.sm, 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        borderRadius: spacing.xs 
      }}>
        <View 
          style={{ 
            height: '100%', 
            width: `${progress * 100}%`, 
            backgroundColor: color || theme.purple, 
            borderRadius: spacing.xs 
          }} 
        />
      </View>
    </View>
  );
};

export default function Challenges() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  
  // Sample challenge data
  const challenges: Challenge[] = [
    { 
      id: 1, 
      title: 'Daily Practice', 
      description: 'Complete 5 exercises today', 
      progress: 0.4,
      icon: <CalendarIcon />,
      color: '#6E56CF'
    },
    { 
      id: 2, 
      title: 'Perfect Streak', 
      description: 'Get a perfect score 3 days in a row', 
      progress: 0.7,
      icon: <FlameIcon style={{ height: 24, width: 24 }} />,
      color: '#FF9500'
    },
    { 
      id: 3, 
      title: 'Night Owl', 
      description: 'Study after 10pm for 5 days', 
      progress: 0.2,
      icon: <TrophyIcon />,
      color: '#FFD700'
    },
    { 
      id: 4, 
      title: 'Early Bird', 
      description: 'Study before 8am for 5 days', 
      progress: 0.9,
      icon: <CalendarIcon color="#FF9500" />,
      color: '#FF9500'
    },
    { 
      id: 5, 
      title: 'Weekend Warrior', 
      description: 'Complete 10 lessons on weekends', 
      progress: 0.5,
      icon: <TrophyIcon color="#6E56CF" />,
      color: '#6E56CF'
    },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: spacing.lg }}>
        {/* Today's Challenge */}
        <View style={{ 
          backgroundColor: theme.card, 
          borderRadius: 16, 
          padding: spacing.xl,
          marginBottom: spacing.xl 
        }}>
          <Text style={{ 
            color: theme.inactive, 
            marginBottom: spacing.sm, 
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            TODAY'S CHALLENGE
          </Text>
          <Text style={{ 
            color: theme.text, 
            fontSize: 20, 
            fontWeight: 'bold',
            marginBottom: spacing.md 
          }}>
            Complete 5 lessons in a row
          </Text>
          <ProgressBar 
            progress={0.6} 
            icon={<FlameIcon style={{ height: 24, width: 24 }} />}
            color="#FF9500"
          />
          <Text style={{ 
            color: theme.inactive, 
            marginTop: spacing.md,
            fontWeight: '500'
          }}>
            3/5 completed
          </Text>
        </View>
        
        {/* Challenge List */}
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: theme.text,
          marginBottom: spacing.lg,
          marginLeft: spacing.sm
        }}>
          All Challenges
        </Text>
        
        {challenges.map((challenge) => (
          <Pressable 
            key={challenge.id}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View style={{ 
              backgroundColor: theme.card, 
              padding: spacing.lg, 
              borderRadius: 12, 
              marginBottom: spacing.lg,
            }}>
              <Text style={{ 
                color: theme.text, 
                fontWeight: 'bold', 
                fontSize: 18, 
                marginBottom: spacing.xs
              }}>
                {challenge.title}
              </Text>
              <Text style={{ 
                color: theme.inactive, 
                marginBottom: spacing.md
              }}>
                {challenge.description}
              </Text>
              <ProgressBar 
                progress={challenge.progress} 
                icon={challenge.icon}
                color={challenge.color}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
