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
  },
  {
    id: 'lesson-numbers-counting',
    title: 'NUMBERS & COUNTING',
    description: 'Master essential French numbers for secret communications',
    missionId: 'mission-cannes-infiltration',
    order: 3,
    expectedDuration: 8,
    xpReward: 60,
    cards: [
      {
        type: 'vocab',
        id: 'vocab-5',
        word: 'Un, une',
        translation: 'One',
        pronunciation: 'uhn, oon',
        example: {
          original: 'J\'ai un message pour vous.',
          translated: 'I have one message for you.'
        },
        audioUrl: '/audio/un.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-6',
        word: 'Deux',
        translation: 'Two',
        pronunciation: 'duh',
        example: {
          original: 'Deux agents sont arrivés.',
          translated: 'Two agents have arrived.'
        },
        audioUrl: '/audio/deux.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-7',
        word: 'Trois',
        translation: 'Three',
        pronunciation: 'twah',
        example: {
          original: 'Nous avons trois minutes.',
          translated: 'We have three minutes.'
        },
        audioUrl: '/audio/trois.mp3'
      },
      {
        type: 'dialogue',
        id: 'dialogue-3',
        conversation: [
          {
            speaker: 'contact',
            text: 'Combien de personnes sont avec vous?',
            translation: 'How many people are with you?',
            audioUrl: '/audio/dialogue-3-1.mp3'
          },
          {
            speaker: 'agent',
            text: 'Deux personnes. Un homme et une femme.',
            translation: 'Two people. One man and one woman.',
            audioUrl: '/audio/dialogue-3-2.mp3'
          },
          {
            speaker: 'contact',
            text: 'Parfait. Nous avons trois chambres réservées.',
            translation: 'Perfect. We have three rooms reserved.',
            audioUrl: '/audio/dialogue-3-3.mp3'
          }
        ]
      },
      {
        type: 'vocab',
        id: 'vocab-8',
        word: 'Quatre',
        translation: 'Four',
        pronunciation: 'katr',
        example: {
          original: 'Le rendez-vous est à quatre heures.',
          translated: 'The meeting is at four o\'clock.'
        },
        audioUrl: '/audio/quatre.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-9',
        word: 'Cinq',
        translation: 'Five',
        pronunciation: 'sank',
        example: {
          original: 'J\'ai besoin de cinq minutes.',
          translated: 'I need five minutes.'
        },
        audioUrl: '/audio/cinq.mp3'
      },
      {
        type: 'quiz',
        id: 'quiz-5',
        question: 'How do you say "three" in French?',
        questionType: 'multiple-choice',
        options: ['Quatre', 'Trois', 'Deux', 'Cinq'],
        correctAnswer: 'Trois',
        points: 10
      },
      {
        type: 'quiz',
        id: 'quiz-6',
        question: 'Translate: "I need five minutes."',
        questionType: 'translation',
        correctAnswer: 'J\'ai besoin de cinq minutes.',
        points: 15
      }
    ]
  },
  {
    id: 'lesson-cafe-conversation',
    title: 'CAFE COMMUNICATIONS',
    description: 'Master French phrases needed for cafe encounters',
    missionId: 'mission-cannes-infiltration',
    order: 4,
    expectedDuration: 12,
    xpReward: 80,
    cards: [
      {
        type: 'vocab',
        id: 'vocab-10',
        word: 'Un café, s\'il vous plaît',
        translation: 'A coffee, please',
        pronunciation: 'uhn ka-fay, seel voo play',
        example: {
          original: 'Je voudrais un café, s\'il vous plaît.',
          translated: 'I would like a coffee, please.'
        },
        audioUrl: '/audio/cafe.mp3'
      },
      {
        type: 'vocab',
        id: 'vocab-11',
        word: 'L\'addition',
        translation: 'The bill',
        pronunciation: 'lah-dee-syohn',
        example: {
          original: 'L\'addition, s\'il vous plaît.',
          translated: 'The bill, please.'
        },
        audioUrl: '/audio/addition.mp3'
      },
      {
        type: 'video',
        id: 'video-2',
        title: 'CAFE ENCOUNTER',
        description: 'Watch a typical French cafe interaction',
        videoUrl: '/videos/cafe.mp4',
        transcript: {
          original: 'Bonjour ! Je voudrais un café et un croissant, s\'il vous plaît. Merci beaucoup. C\'est combien ? Quinze euros ? Voilà. Au revoir !',
          translated: 'Hello! I would like a coffee and a croissant, please. Thank you very much. How much is it? Fifteen euros? Here you go. Goodbye!'
        }
      },
      {
        type: 'dialogue',
        id: 'dialogue-4',
        conversation: [
          {
            speaker: 'agent',
            text: 'Bonjour, je voudrais un café, s\'il vous plaît.',
            translation: 'Hello, I would like a coffee, please.',
            audioUrl: '/audio/dialogue-4-1.mp3'
          },
          {
            speaker: 'contact',
            text: 'Bien sûr. Un café noir ou avec du lait?',
            translation: 'Of course. Black coffee or with milk?',
            audioUrl: '/audio/dialogue-4-2.mp3'
          },
          {
            speaker: 'agent',
            text: 'Avec du lait, merci. Et un croissant aussi.',
            translation: 'With milk, thank you. And a croissant too.',
            audioUrl: '/audio/dialogue-4-3.mp3'
          },
          {
            speaker: 'contact',
            text: 'Voilà votre commande. C\'est huit euros, s\'il vous plaît.',
            translation: 'Here is your order. That\'s eight euros, please.',
            audioUrl: '/audio/dialogue-4-4.mp3'
          }
        ]
      },
      {
        type: 'vocab',
        id: 'vocab-12',
        word: 'Merci beaucoup',
        translation: 'Thank you very much',
        pronunciation: 'mair-see boh-koo',
        example: {
          original: 'Merci beaucoup pour votre aide.',
          translated: 'Thank you very much for your help.'
        },
        audioUrl: '/audio/merci.mp3'
      },
      {
        type: 'quiz',
        id: 'quiz-7',
        question: 'How do you ask for the bill in French?',
        questionType: 'multiple-choice',
        options: ['La facture', 'L\'addition', 'Le prix', 'La note'],
        correctAnswer: 'L\'addition',
        points: 10
      },
      {
        type: 'quiz',
        id: 'quiz-8',
        question: 'Translate: "A coffee with milk, please."',
        questionType: 'translation',
        correctAnswer: 'Un café avec du lait, s\'il vous plaît.',
        points: 15
      }
    ]
  }
];

// Add the new lessons to the mission
sampleMissions[0].lessons = [
  'lesson-basic-greetings',
  'lesson-introductions',
  'lesson-numbers-counting',
  'lesson-cafe-conversation'
];

// User progress tracking
export type UserProgress = {
  agentCodename?: string;
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
      dueDate: string; // Date when the card should be reviewed again
    };
  };
  totalXP: number;
  dailyXP: number;
  streakDays: number;
  lastActive: string; // ISO date string
  level: number;
  unlockedMissions: string[];
};

// Initial user progress for new users
export const initialUserProgress: UserProgress = {
  agentCodename: 'DARK MALLARD',
  lessonsCompleted: [],
  vocabMastery: {},
  totalXP: 0,
  dailyXP: 0,
  streakDays: 1,
  lastActive: new Date().toISOString(),
  level: 1,
  unlockedMissions: ['mission-cannes-infiltration'], // First mission is unlocked by default
};

// SRS interval calculation (in hours)
export const srsIntervals = {
  1: 6,      // Box 1: Review after 6 hours
  2: 24,     // Box 2: Review after 1 day
  3: 72,     // Box 3: Review after 3 days
  4: 168,    // Box 4: Review after 1 week
  5: 336     // Box 5: Review after 2 weeks
};

// Calculate the next review date based on the SRS box
export function calculateNextReviewDate(box: number): string {
  const now = new Date();
  const hours = srsIntervals[box as keyof typeof srsIntervals] || 6;
  const nextDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return nextDate.toISOString();
}

// Get vocab items due for review
export function getDueVocabCards(progress: UserProgress): string[] {
  const now = new Date();
  return Object.entries(progress.vocabMastery)
    .filter(([_, data]) => {
      if (!data.dueDate) return false;
      const dueDate = new Date(data.dueDate);
      return dueDate <= now;
    })
    .map(([vocabId, _]) => vocabId);
}

// Get vocab cards from their IDs
export function getVocabCardsById(vocabIds: string[]): VocabCard[] {
  const allVocabCards: VocabCard[] = [];
  
  // Collect all vocab cards from all lessons
  sampleLessons.forEach(lesson => {
    lesson.cards.forEach(card => {
      if (card.type === 'vocab') {
        allVocabCards.push(card);
      }
    });
  });
  
  // Filter to get only the requested vocab cards
  return allVocabCards.filter(card => vocabIds.includes(card.id));
} 