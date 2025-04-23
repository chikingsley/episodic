'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson, UserProgress } from '../data/lesson-data';
import VocabCard from './lesson/vocab-card';
import DialogueCard from './lesson/dialogue-card';
import VideoCard from './lesson/video-card';
import QuizCard from './lesson/quiz-card';

type LessonPlayerProps = {
  lesson: Lesson;
  userProgress: UserProgress;
  onComplete: (xpEarned: number, updatedProgress: UserProgress) => void;
  onExit: () => void;
};

type LessonSummary = {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  xpEarned: number;
  time: number; // in seconds
};

const LessonPlayer = ({ lesson, userProgress, onComplete, onExit }: LessonPlayerProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [summary, setSummary] = useState<LessonSummary>({
    totalCards: lesson.cards.length,
    correctAnswers: 0,
    incorrectAnswers: 0,
    xpEarned: 0,
    time: 0,
  });
  
  // Track vocab mastery for spaced repetition
  const [vocabMastery, setVocabMastery] = useState(userProgress.vocabMastery);

  // Handle completing the entire lesson
  useEffect(() => {
    if (isComplete) {
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      // Only update summary once when completing the lesson
      if (summary.time === 0) {
        setSummary(prev => ({
          ...prev,
          time: timeInSeconds
        }));
      } else {
        // Update user progress
        const updatedProgress: UserProgress = {
          ...userProgress,
          lessonsCompleted: [...userProgress.lessonsCompleted, lesson.id],
          vocabMastery: vocabMastery,
          totalXP: userProgress.totalXP + summary.xpEarned + lesson.xpReward, // Add bonus XP for completion
          dailyXP: userProgress.dailyXP + summary.xpEarned + lesson.xpReward,
          lastActive: new Date().toISOString()
        };
        
        // Call the onComplete callback with updated progress
        onComplete(summary.xpEarned + lesson.xpReward, updatedProgress);
      }
    }
  }, [isComplete, lesson, summary, userProgress, vocabMastery, startTime, onComplete]);

  // Handle card completion
  const handleCardComplete = useCallback((correct?: boolean, points: number = 0) => {
    if (currentCardIndex < lesson.cards.length - 1) {
      // Move to the next card
      setCurrentCardIndex(prevIndex => prevIndex + 1);
      
      // Update summary if this was a quiz
      if (typeof correct === 'boolean') {
        setSummary(prev => ({
          ...prev,
          correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
          incorrectAnswers: !correct ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
          xpEarned: prev.xpEarned + (correct ? points : 0)
        }));
        
        // If we need to update the vocab mastery for spaced repetition
        const currentCard = lesson.cards[currentCardIndex];
        if (currentCard.type === 'vocab') {
          const vocabId = currentCard.id;
          const currentMastery = vocabMastery[vocabId] || {
            box: 1,
            lastReviewed: new Date().toISOString(),
            timesReviewed: 0,
            timesCorrect: 0
          };
          
          // Update the mastery level
          setVocabMastery(prev => ({
            ...prev,
            [vocabId]: {
              ...currentMastery,
              timesReviewed: currentMastery.timesReviewed + 1,
              timesCorrect: currentMastery.timesCorrect + (correct ? 1 : 0),
              // Move to next box if correct, or back to box 1 if incorrect
              box: correct ? Math.min(currentMastery.box + 1, 5) : 1,
              lastReviewed: new Date().toISOString()
            }
          }));
        }
      }
    } else {
      // Lesson is complete
      setIsComplete(true);
    }
  }, [currentCardIndex, lesson.cards, vocabMastery]);

  // Render the current card
  const renderCurrentCard = () => {
    const currentCard = lesson.cards[currentCardIndex];
    
    switch (currentCard.type) {
      case 'vocab':
        return <VocabCard card={currentCard} onComplete={() => handleCardComplete()} />;
        
      case 'dialogue':
        return <DialogueCard card={currentCard} onComplete={() => handleCardComplete()} />;
        
      case 'video':
        return <VideoCard card={currentCard} onComplete={() => handleCardComplete()} />;
        
      case 'quiz':
        return <QuizCard card={currentCard} onComplete={handleCardComplete} />;
        
      default:
        return <div>Unknown card type</div>;
    }
  };

  // Render lesson completion summary
  const renderSummary = () => {
    return (
      <motion.div 
        className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-xs font-mono text-red-500 mb-4">MISSION DEBRIEF</div>
        
        <h3 className="text-2xl font-bold text-white mb-6 text-center">{lesson.title} COMPLETE</h3>
        
        <motion.div 
          className="bg-red-900/20 rounded-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300 font-mono">XP EARNED</span>
            <span className="text-2xl font-bold text-red-500">+{summary.xpEarned + lesson.xpReward}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Correct Answers</span>
              <span className="text-gray-300">{summary.correctAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Incorrect Answers</span>
              <span className="text-gray-300">{summary.incorrectAnswers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Completion Bonus</span>
              <span className="text-gray-300">+{lesson.xpReward} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Time Spent</span>
              <span className="text-gray-300">{Math.floor(summary.time / 60)}m {summary.time % 60}s</span>
            </div>
          </div>
        </motion.div>
        
        <div className="flex justify-center">
          <motion.button 
            className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono"
            onClick={onExit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CONTINUE TO MISSION HUB
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progress = (currentCardIndex / lesson.cards.length) * 100;
    
    return (
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div 
          className="h-1 bg-red-700" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      <AnimatePresence>
        {!isComplete && (
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="text-gray-400 hover:text-white"
              onClick={onExit}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-mono text-gray-200">{lesson.title}</h2>
              <p className="text-xs text-gray-500">{currentCardIndex + 1} of {lesson.cards.length}</p>
            </div>
            
            <div className="w-6"></div> {/* Spacer for balance */}
          </motion.div>
        )}
      </AnimatePresence>
      
      {renderProgressBar()}
      
      <div className="py-4">
        {isComplete ? renderSummary() : renderCurrentCard()}
      </div>
    </div>
  );
};

export default LessonPlayer; 