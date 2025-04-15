// Types for different card content
export type VocabCard = {
  type: 'vocab';
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  example?: {
    original: string;
    translated: string;
  };
  imageUrl?: string;
  audioUrl?: string;
};

export type DialogueCard = {
  type: 'dialogue';
  id: string;
  conversation: {
    speaker: 'agent' | 'contact';
    text: string;
    translation: string;
    audioUrl?: string;
  }[];
};

export type VideoCard = {
  type: 'video';
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Placeholder for video content
  transcript?: {
    original: string;
    translated: string;
  };
};

export type QuizCard = {
  type: 'quiz';
  id: string;
  question: string;
  questionType: 'multiple-choice' | 'translation' | 'fill-blank';
  options?: string[]; // For multiple choice
  correctAnswer: string | string[]; // Could be multiple correct answers
  explanation?: string;
  points: number;
};

export type LessonCard = VocabCard | DialogueCard | VideoCard | QuizCard;

export type Lesson = {
  id: string;
  title: string;
  description: string;
  missionId: string;
  order: number;
  coverImage?: string;
  expectedDuration: number; // in minutes
  xpReward: number;
  cards: LessonCard[];
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  difficulty: 'recruit' | 'agent' | 'handler' | 'director';
  location: string;
  requiredClearance: number;
  totalXP: number;
  completionReward?: string;
  lessons: string[]; // Array of lesson IDs
};

// Sample mission with lessons for French language learning
export const sampleMissions: Mission[] = [
  {
    id: 'mission-cannes-infiltration',
    title: 'CANNES INFILTRATION',
    description: 'Establish cover identity with basic French conversation skills',
    coverImage: '/missions/cannes.jpg',
    difficulty: 'recruit',
    location: 'Cannes, France',
    requiredClearance: 1,
    totalXP: 300,
    completionReward: 'SOCIAL INFILTRATOR BADGE',
    lessons: [
      'lesson-basic-greetings',
      'lesson-introductions',
      'lesson-cafe-conversation'
    ]
  }
];

// Sample lessons for the Cannes Infiltration mission
export const sampleLessons: Lesson[] = [
  {
    id: 'lesson-basic-greetings',
    title: 'BASIC GREETINGS',
    description: 'Master essential French greetings to avoid detection',
    missionId: 'mission-cannes-infiltration',
    order: 1,
    expectedDuration: 5,
    xpReward: 50,
    cards: [
      {
        type: 'vocab',
        id: 'vocab-1',
        word: 'Bonjour',
        translation: 'Hello / Good day',
        pronunciation: 'bohn-zhoor',
        example: {
          original: 'Bonjour, comment allez-vous?',
          translated: 'Hello, how are you?'
        },
        audioUrl: '/audio/bonjour.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-2',
        word: 'Bonsoir',
        translation: 'Good evening',
        pronunciation: 'bohn-swahr',
        example: {
          original: 'Bonsoir, bienvenue au restaurant.',
          translated: 'Good evening, welcome to the restaurant.'
        },
        audioUrl: '/audio/bonsoir.mp3'
      },
      {
        type: 'dialogue',
        id: 'dialogue-1',
        conversation: [
          {
            speaker: 'contact',
            text: 'Bonjour, comment allez-vous?',
            translation: 'Hello, how are you?',
            audioUrl: '/audio/dialogue-1-1.mp3'
          },
          {
            speaker: 'agent',
            text: 'Très bien, merci. Et vous?',
            translation: 'Very well, thank you. And you?',
            audioUrl: '/audio/dialogue-1-2.mp3'
          },
          {
            speaker: 'contact',
            text: 'Ça va bien, merci.',
            translation: 'I am well, thank you.',
            audioUrl: '/audio/dialogue-1-3.mp3'
          }
        ]
      },
      {
        type: 'quiz',
        id: 'quiz-1',
        question: 'How do you say "Good day" in French?',
        questionType: 'multiple-choice',
        options: ['Bon matin', 'Bonjour', 'Bonne journée', 'Bon après-midi'],
        correctAnswer: 'Bonjour',
        points: 10
      },
      {
        type: 'quiz',
        id: 'quiz-2',
        question: 'Translate: "Good evening, welcome to the restaurant."',
        questionType: 'translation',
        correctAnswer: 'Bonsoir, bienvenue au restaurant.',
        points: 15
      }
    ]
  },
  {
    id: 'lesson-introductions',
    title: 'PERSONAL INTRODUCTIONS',
    description: 'Learn to introduce yourself and maintain your cover identity',
    missionId: 'mission-cannes-infiltration',
    order: 2,
    expectedDuration: 10,
    xpReward: 75,
    cards: [
      {
        type: 'vocab',
        id: 'vocab-3',
        word: 'Je m\'appelle',
        translation: 'My name is',
        pronunciation: 'zhuh ma-pell',
        example: {
          original: 'Je m\'appelle Pierre.',
          translated: 'My name is Pierre.'
        },
        audioUrl: '/audio/je-mappelle.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-4',
        word: 'Enchanté',
        translation: 'Pleased to meet you',
        pronunciation: 'ahn-shahn-tay',
        example: {
          original: 'Enchanté de faire votre connaissance.',
          translated: 'Pleased to make your acquaintance.'
        },
        audioUrl: '/audio/enchante.mp3'
      },
      {
        type: 'video',
        id: 'video-1',
        title: 'INTRODUCING YOURSELF',
        description: 'Watch how to introduce yourself naturally in French',
        videoUrl: '/videos/introductions.mp4',
        transcript: {
          original: 'Bonjour, je m\'appelle Marie. Je suis américaine. J\'habite à Paris maintenant. Enchanté de faire votre connaissance.',
          translated: 'Hello, my name is Marie. I am American. I live in Paris now. Pleased to make your acquaintance.'
        }
      },
      {
        type: 'dialogue',
        id: 'dialogue-2',
        conversation: [
          {
            speaker: 'agent',
            text: 'Bonjour, je m\'appelle Jean. Et vous?',
            translation: 'Hello, my name is Jean. And you?',
            audioUrl: '/audio/dialogue-2-1.mp3'
          },
          {
            speaker: 'contact',
            text: 'Je m\'appelle Sophie. D\'où venez-vous?',
            translation: 'My name is Sophie. Where are you from?',
            audioUrl: '/audio/dialogue-2-2.mp3'
          },
          {
            speaker: 'agent',
            text: 'Je viens du Canada. Je suis ici en vacances.',
            translation: 'I am from Canada. I am here on vacation.',
            audioUrl: '/audio/dialogue-2-3.mp3'
          },
          {
            speaker: 'contact',
            text: 'Ah, bienvenue en France! Enchanté.',
            translation: 'Ah, welcome to France! Pleased to meet you.',
            audioUrl: '/audio/dialogue-2-4.mp3'
          }
        ]
      },
      {
        type: 'quiz',
        id: 'quiz-3',
        question: 'How would you introduce yourself as "David"?',
        questionType: 'fill-blank',
        correctAnswer: 'Je m\'appelle David',
        points: 15
      },
      {
        type: 'quiz',
        id: 'quiz-4',
        question: 'What does "Enchanté" mean?',
        questionType: 'multiple-choice',
        options: ['Thank you', 'Goodbye', 'Pleased to meet you', 'How are you?'],
        correctAnswer: 'Pleased to meet you',
        points: 10
      }
    ]
  }
];

// User progress tracking
export type UserProgress = {
  lessonsCompleted: string[];
  currentLesson?: {
    id: string;
    currentCardIndex: number;
    startedAt: string; // ISO date string
  };
  vocabMastery: {
    [vocabId: string]: {
      box: number; // 1-5, for spaced repetition
      lastReviewed: string; // ISO date string
      timesReviewed: number;
      timesCorrect: number;
    };
  };
  totalXP: number;
  dailyXP: number;
  streakDays: number;
  lastActive: string; // ISO date string
};

// Sample initial user progress
export const initialUserProgress: UserProgress = {
  lessonsCompleted: [],
  vocabMastery: {},
  totalXP: 0,
  dailyXP: 0,
  streakDays: 0,
  lastActive: new Date().toISOString()
}; 