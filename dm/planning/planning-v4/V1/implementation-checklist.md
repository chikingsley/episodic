# Dark Mallard V1 - Technical Implementation Checklist

## Sprint 1: Foundation Setup (Days 1-3)

### Day 1: Ink Integration & Basic Exercise System

#### 1. Install and configure inkjs
```bash
cd dm
bun add inkjs
```

#### 2. Create Ink story loader component
```typescript
// dm/components/story/InkStoryProvider.tsx
import { createContext, useContext } from 'react';
import { Story } from 'inkjs';

interface InkStoryContextType {
  story: Story | null;
  currentText: string;
  choices: Choice[];
  canContinue: boolean;
  continueStory: () => void;
  makeChoice: (index: number) => void;
  getVariable: (name: string) => any;
  setVariable: (name: string, value: any) => void;
}

export const InkStoryContext = createContext<InkStoryContextType>({} as InkStoryContextType);
```

#### 3. Create exercise component architecture
```typescript
// dm/components/exercises/ExerciseTypes.ts
export type ExerciseType = 
  | 'mcq_translate'
  | 'mcq_listen'
  | 'fill_blank'
  | 'type_translate'
  | 'speak_repeat';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: {
    text?: string;
    audioUrl?: string;
    imageUrl?: string;
  };
  correctAnswer: string;
  options?: string[];
  keywords?: string[];
}

// dm/components/exercises/ExerciseContainer.tsx
export function ExerciseContainer({ exercise, onComplete }: Props) {
  switch(exercise.type) {
    case 'mcq_translate':
      return <MCQTranslate {...props} />;
    // ... other cases
  }
}
```

#### 4. Create first exercise component
```typescript
// dm/components/exercises/MCQTranslate.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MCQTranslate({ exercise, onComplete }) {
  const [selected, setSelected] = useState<number>(-1);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleSubmit = () => {
    const correct = selected === exercise.correctIndex;
    setShowFeedback(true);
    
    setTimeout(() => {
      onComplete({
        correct,
        coverIntegrityDelta: correct ? 2 : -10,
        xpEarned: correct ? 10 : 0,
        intelPoints: correct ? 5 : 0
      });
    }, 1500);
  };
  
  return (
    <View className="p-4">
      <Text className="text-lg mb-4">{exercise.prompt.text}</Text>
      {exercise.options.map((option, idx) => (
        <Button
          key={idx}
          variant={selected === idx ? "default" : "outline"}
          onPress={() => setSelected(idx)}
          className="mb-2"
        >
          {option}
        </Button>
      ))}
      <Button onPress={handleSubmit} disabled={selected === -1}>
        Submit
      </Button>
    </View>
  );
}
```

### Day 2: Game State Management & Cover Integrity System

#### 1. Set up Zustand store for game state
```typescript
// dm/lib/stores/gameStore.ts
import { create } from 'zustand';

interface GameState {
  // Player stats
  coverIntegrity: number;
  xp: number;
  intelPoints: number;
  currentMissionId: string | null;
  
  // Actions
  updateCoverIntegrity: (delta: number) => void;
  addXP: (amount: number) => void;
  addIntelPoints: (amount: number) => void;
  startMission: (missionId: string) => void;
  endMission: (success: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  coverIntegrity: 100,
  xp: 0,
  intelPoints: 0,
  currentMissionId: null,
  
  updateCoverIntegrity: (delta) => 
    set((state) => ({
      coverIntegrity: Math.max(0, Math.min(100, state.coverIntegrity + delta))
    })),
    
  addXP: (amount) => 
    set((state) => ({ xp: state.xp + amount })),
    
  addIntelPoints: (amount) =>
    set((state) => ({ intelPoints: state.intelPoints + amount })),
    
  startMission: (missionId) =>
    set({ currentMissionId: missionId }),
    
  endMission: (success) =>
    set((state) => ({
      currentMissionId: null,
      xp: success ? state.xp + 50 : state.xp,
      coverIntegrity: success 
        ? Math.min(100, state.coverIntegrity + 5)
        : state.coverIntegrity
    }))
}));
```

#### 2. Create Cover Integrity UI component
```typescript
// dm/components/ui/CoverIntegrityBar.tsx
import { View, Text } from 'react-native';
import { useGameStore } from '@/lib/stores/gameStore';

export function CoverIntegrityBar() {
  const coverIntegrity = useGameStore(state => state.coverIntegrity);
  
  const getColor = () => {
    if (coverIntegrity >= 70) return 'bg-green-500';
    if (coverIntegrity >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <View className="p-4">
      <Text className="text-sm text-gray-600 mb-1">Cover Integrity</Text>
      <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <View 
          className={`h-full ${getColor()}`}
          style={{ width: `${coverIntegrity}%` }}
        />
      </View>
      <Text className="text-xs text-right mt-1">{coverIntegrity}%</Text>
    </View>
  );
}
```

#### 3. Connect Ink story to game state
```typescript
// dm/hooks/useInkStory.ts
import { useEffect } from 'react';
import { Story } from 'inkjs';
import { useGameStore } from '@/lib/stores/gameStore';

export function useInkStory(storyJson: object) {
  const { updateCoverIntegrity, addIntelPoints } = useGameStore();
  
  useEffect(() => {
    const story = new Story(storyJson);
    
    // Observe Ink variables
    story.ObserveVariable('cover_integrity', (varName, newValue) => {
      const currentCI = useGameStore.getState().coverIntegrity;
      updateCoverIntegrity(newValue - currentCI);
    });
    
    story.ObserveVariable('intel_points', (varName, newValue) => {
      const currentIntel = useGameStore.getState().intelPoints;
      addIntelPoints(newValue - currentIntel);
    });
    
    return () => {
      // Cleanup observers
    };
  }, [storyJson]);
}
```

### Day 3: Mission Flow & Navigation

#### 1. Create mission screen
```typescript
// dm/app/(main)/mission/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { InkStoryProvider } from '@/components/story/InkStoryProvider';
import { StoryReader } from '@/components/story/StoryReader';
import { CoverIntegrityBar } from '@/components/ui/CoverIntegrityBar';

export default function MissionScreen() {
  const { id } = useLocalSearchParams();
  const [storyData, setStoryData] = useState(null);
  
  useEffect(() => {
    // Load story JSON
    loadMissionStory(id).then(setStoryData);
  }, [id]);
  
  if (!storyData) return <LoadingScreen />;
  
  return (
    <SafeAreaView className="flex-1">
      <CoverIntegrityBar />
      <InkStoryProvider storyJson={storyData}>
        <StoryReader />
      </InkStoryProvider>
    </SafeAreaView>
  );
}
```

#### 2. Create story reader component
```typescript
// dm/components/story/StoryReader.tsx
import { useInkStory } from '@/hooks/useInkStory';
import { ExerciseContainer } from '@/components/exercises/ExerciseContainer';

export function StoryReader() {
  const { currentText, choices, makeChoice, canContinue, continueStory } = useInkStory();
  const [showExercise, setShowExercise] = useState(false);
  
  // Check for exercise tags in current text
  useEffect(() => {
    const exerciseMatch = currentText.match(/#exercise:(\w+)/);
    if (exerciseMatch) {
      setShowExercise(true);
      // Load exercise data based on ID
    }
  }, [currentText]);
  
  if (showExercise) {
    return <ExerciseContainer exercise={currentExercise} onComplete={handleExerciseComplete} />;
  }
  
  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-base mb-4">{currentText}</Text>
      
      {choices.length > 0 ? (
        choices.map((choice, idx) => (
          <Button
            key={idx}
            onPress={() => makeChoice(idx)}
            className="mb-2"
          >
            {choice.text}
          </Button>
        ))
      ) : canContinue ? (
        <Button onPress={continueStory}>
          Continue
        </Button>
      ) : (
        <Button onPress={completeMission}>
          Complete Mission
        </Button>
      )}
    </ScrollView>
  );
}
```

## Sprint 2: Audio & Content Pipeline (Days 4-6)

### Day 4: TTS Integration

#### 1. Set up TTS service
```typescript
// dm/lib/services/tts.ts
import { ElevenLabs } from 'elevenlabs-node';

const elevenlabs = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export async function generateAudio(text: string, voice: 'drake' | 'sheldon' | 'clerk') {
  const voiceMap = {
    drake: 'voice_id_1',
    sheldon: 'voice_id_2', 
    clerk: 'voice_id_3'
  };
  
  const audio = await elevenlabs.generate({
    text,
    voice: voiceMap[voice],
    model_id: 'eleven_multilingual_v2'
  });
  
  // Upload to S3
  const url = await uploadToS3(audio);
  return url;
}
```

#### 2. Create audio generation script
```typescript
// dm/scripts/generate-audio.ts
import { readFileSync } from 'fs';
import { generateAudio } from '@/lib/services/tts';

async function processInkFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const dialogueRegex = /^(\w+):\s*"([^"]+)"/gm;
  
  let match;
  const audioMap = {};
  
  while ((match = dialogueRegex.exec(content)) !== null) {
    const [_, character, text] = match;
    const voice = character.toLowerCase();
    
    console.log(`Generating audio for ${character}: ${text.substring(0, 50)}...`);
    
    const audioUrl = await generateAudio(text, voice);
    audioMap[`${character}_${match.index}`] = audioUrl;
  }
  
  // Save audio map
  writeFileSync(filePath.replace('.ink', '_audio.json'), JSON.stringify(audioMap, null, 2));
}

// Run on all ink files
const inkFiles = glob.sync('content/narrative/*.ink');
for (const file of inkFiles) {
  await processInkFile(file);
}
```

### Day 5: Speech Recognition

#### 1. Implement speech recognition
```typescript
// dm/components/exercises/SpeakRepeat.tsx
import { ExpoSpeechRecognition } from 'expo-speech-recognition';

export function SpeakRepeat({ exercise, onComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = async () => {
    const { status } = await ExpoSpeechRecognition.requestPermissionsAsync();
    if (status !== 'granted') return;
    
    setIsListening(true);
    ExpoSpeechRecognition.start({
      lang: 'fr-FR',
      onResults: (event) => {
        setTranscript(event.results[0]);
        evaluateSpeech(event.results[0], event.confidence);
      }
    });
  };
  
  const evaluateSpeech = (userTranscript: string, confidence: number) => {
    // Gate 1: Confidence check
    if (confidence < 0.85) {
      onComplete({ correct: false, reason: 'low_confidence' });
      return;
    }
    
    // Gate 2: Levenshtein distance
    const distance = levenshteinDistance(
      userTranscript.toLowerCase(),
      exercise.expectedTranscript.toLowerCase()
    );
    
    const ratio = distance / exercise.expectedTranscript.length;
    
    if (ratio <= 0.3) {
      onComplete({ correct: true, coverIntegrityDelta: 5 });
    } else {
      // Check keywords
      const hasAllKeywords = exercise.keywords.every(keyword =>
        userTranscript.toLowerCase().includes(keyword.toLowerCase())
      );
      
      onComplete({ 
        correct: hasAllKeywords,
        coverIntegrityDelta: hasAllKeywords ? 2 : -5
      });
    }
  };
  
  return (
    <View className="p-4">
      <Text className="text-lg mb-4">Repeat: "{exercise.prompt.text}"</Text>
      <AudioPlayer url={exercise.prompt.audioUrl} />
      
      <Button
        onPress={isListening ? stopListening : startListening}
        variant={isListening ? "destructive" : "default"}
      >
        {isListening ? 'Stop' : 'Start Speaking'}
      </Button>
      
      {transcript && (
        <Text className="mt-4 p-2 bg-gray-100 rounded">
          You said: {transcript}
        </Text>
      )}
    </View>
  );
}
```

### Day 6: Content Validation & Build Pipeline

#### 1. Create content validation script
```typescript
// dm/scripts/validate-content.ts
import { z } from 'zod';
import { readFileSync, readdirSync } from 'fs';

const SlugSchema = z.string().regex(
  /^[a-z]{2}-C\d{2}-op\d{2}-u\d{2}-[NLDP]-\d{2}$/,
  'Invalid slug format'
);

const ExerciseSchema = z.object({
  id: z.string(),
  type: z.enum(['mcq_translate', 'mcq_listen', 'fill_blank', 'type_translate', 'speak_repeat']),
  prompt: z.object({
    text: z.string().optional(),
    audioUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional()
  }),
  correctAnswer: z.string(),
  options: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional()
});

// Validate all content files
function validateContent() {
  const errors = [];
  
  // Check narrative files
  const narrativeFiles = readdirSync('content/narrative');
  for (const file of narrativeFiles) {
    const slug = file.replace('.json', '');
    try {
      SlugSchema.parse(slug);
    } catch (e) {
      errors.push(`Invalid narrative filename: ${file}`);
    }
  }
  
  // Check exercise files
  const exerciseFiles = readdirSync('content/exercises');
  for (const file of exerciseFiles) {
    const content = JSON.parse(readFileSync(`content/exercises/${file}`, 'utf-8'));
    try {
      ExerciseSchema.parse(content);
    } catch (e) {
      errors.push(`Invalid exercise format in ${file}: ${e.message}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    process.exit(1);
  }
  
  console.log('✅ All content validated successfully');
}

validateContent();
```

#### 2. Set up CI/CD pipeline
```yaml
# .github/workflows/content-validation.yml
name: Content Validation

on:
  push:
    paths:
      - 'content/**'
      - 'content_src/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Compile Ink files
        run: bun run scripts/compile-ink.ts
        
      - name: Validate content
        run: bun run scripts/validate-content.ts
        
      - name: Check audio references
        run: bun run scripts/check-audio-refs.ts
```

## Sprint 3: Complete V1 Features (Days 7-9)

### Day 7: Convex Integration

#### 1. Set up Convex schema
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    displayName: v.string(),
    coverIntegrity: v.number(),
    xp: v.number(),
    intelPoints: v.number(),
    currentMissionId: v.optional(v.string()),
    completedMissions: v.array(v.string()),
    streak: v.object({
      current: v.number(),
      longest: v.number(),
      lastCompletedDate: v.string()
    })
  }).index("by_clerk", ["clerkId"]),
  
  missionSessions: defineTable({
    userId: v.id("users"),
    missionId: v.string(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    status: v.union(v.literal("in_progress"), v.literal("completed"), v.literal("failed")),
    storyState: v.any(), // Ink story state
    coverIntegrityAtStart: v.number(),
    coverIntegrityAtEnd: v.optional(v.number()),
    xpEarned: v.optional(v.number())
  }).index("by_user", ["userId"]),
  
  exerciseEvents: defineTable({
    sessionId: v.id("missionSessions"),
    exerciseId: v.string(),
    exerciseType: v.string(),
    correct: v.boolean(),
    responseTime: v.number(),
    userAnswer: v.string(),
    timestamp: v.string()
  }).index("by_session", ["sessionId"])
});
```

#### 2. Create Convex mutations
```typescript
// convex/mutations/startMission.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const startMission = mutation({
  args: {
    missionId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", q => q.eq("clerkId", identity.subject))
      .first();
      
    if (!user) throw new Error("User not found");
    
    // Create new session
    const sessionId = await ctx.db.insert("missionSessions", {
      userId: user._id,
      missionId: args.missionId,
      startTime: new Date().toISOString(),
      status: "in_progress",
      storyState: {},
      coverIntegrityAtStart: user.coverIntegrity
    });
    
    // Update user's current mission
    await ctx.db.patch(user._id, {
      currentMissionId: args.missionId
    });
    
    return { sessionId, coverIntegrity: user.coverIntegrity };
  }
});
```

### Day 8: UI Polish & Animation

#### 1. Add character avatars and animations
```typescript
// dm/components/ui/CharacterAvatar.tsx
import { Image, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export function CharacterAvatar({ character, isSpeaking }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isSpeaking]);
  
  const avatarMap = {
    drake: require('@/assets/characters/drake.png'),
    sheldon: require('@/assets/characters/sheldon.png'),
    clerk: require('@/assets/characters/clerk.png')
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Image 
        source={avatarMap[character]} 
        className="w-20 h-20 rounded-full"
      />
    </Animated.View>
  );
}
```

#### 2. Create mission complete screen
```typescript
// dm/components/screens/MissionComplete.tsx
import { View, Text } from 'react-native';
import { useGameStore } from '@/lib/stores/gameStore';
import LottieView from 'lottie-react-native';

export function MissionCompleteScreen({ sessionData }) {
  const { coverIntegrity, xp } = useGameStore();
  
  return (
    <View className="flex-1 items-center justify-center p-4">
      <LottieView
        source={require('@/assets/animations/success.json')}
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
      
      <Text className="text-2xl font-bold mt-4">Mission Complete!</Text>
      
      <View className="mt-6 w-full">
        <StatRow label="Cover Integrity" value={`${coverIntegrity}%`} />
        <StatRow label="XP Earned" value={`+${sessionData.xpEarned}`} />
        <StatRow label="Intel Points" value={`+${sessionData.intelEarned}`} />
      </View>
      
      <Button className="mt-8" onPress={navigateToHome}>
        Continue
      </Button>
    </View>
  );
}
```

### Day 9: Testing & Bug Fixes

#### 1. Create test suite for exercises
```typescript
// __tests__/exercises.test.ts
import { evaluateMCQ, evaluateSpeech } from '@/lib/exercises/evaluation';

describe('Exercise Evaluation', () => {
  test('MCQ evaluation', () => {
    const result = evaluateMCQ({
      selectedIndex: 1,
      correctIndex: 1
    });
    
    expect(result.correct).toBe(true);
    expect(result.coverIntegrityDelta).toBe(2);
  });
  
  test('Speech evaluation - exact match', () => {
    const result = evaluateSpeech({
      transcript: 'Bonjour monsieur',
      expected: 'Bonjour monsieur',
      confidence: 0.9
    });
    
    expect(result.correct).toBe(true);
  });
  
  test('Speech evaluation - keyword match', () => {
    const result = evaluateSpeech({
      transcript: 'Bonjour',
      expected: 'Bonjour monsieur',
      keywords: ['bonjour'],
      confidence: 0.9
    });
    
    expect(result.correct).toBe(true);
  });
});
```

#### 2. Performance optimization checklist
- [ ] Preload first 3 audio files on mission start
- [ ] Cache Ink story state in AsyncStorage
- [ ] Lazy load exercise components
- [ ] Optimize image assets (use WebP format)
- [ ] Enable Hermes for Android
- [ ] Profile app with Flipper

## Deployment Checklist

### Pre-deployment
- [ ] All content validated
- [ ] Audio files generated and uploaded to S3
- [ ] Convex functions deployed
- [ ] Environment variables set
- [ ] App icons and splash screens created

### iOS Deployment
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to App Store
eas submit -p ios
```

### Android Deployment
```bash
# Build APK
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

## Next Steps After V1

1. **Content Expansion**
   - Lessons 6-30 of Pimsleur French I
   - Side missions for vocabulary practice
   - Cultural notes from Paul Noble

2. **Advanced Features**
   - Equipment/gadget system
   - Multiplayer handler battles
   - Daily challenges
   - Leaderboards

3. **Additional Languages**
   - Spanish: Operation Madrid
   - Italian: Operation Venezia
   - Japanese: Operation Sakura

4. **Monetization**
   - Premium voice packs
   - Accelerated progression
   - Exclusive story branches 