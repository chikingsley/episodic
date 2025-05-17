'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { VocabCard as VocabCardType, getDueVocabCards, getVocabCardsById, calculateNextReviewDate } from '../data/lesson-data';
import { useUser } from '../context/user-context';

type ReviewSessionProps = {
  onComplete: () => void;
  onExit: () => void;
};

const ReviewSession = ({ onComplete, onExit }: ReviewSessionProps) => {
  const { userProgress, updateProgress } = useUser();
  const [dueCards, setDueCards] = useState<VocabCardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewResults, setReviewResults] = useState<{
    correct: number;
    incorrect: number;
    totalReviewed: number;
    xpEarned: number;
  }>({
    correct: 0,
    incorrect: 0,
    totalReviewed: 0,
    xpEarned: 0
  });

  // Load cards due for review on component mount
  useEffect(() => {
    const dueCardIds = getDueVocabCards(userProgress);
    const vocabCards = getVocabCardsById(dueCardIds);
    
    // Shuffle the cards to randomize the review order
    const shuffledCards = [...vocabCards].sort(() => Math.random() - 0.5);
    
    setDueCards(shuffledCards);
  }, [userProgress]);

  // Handle when user marks a card as known or unknown
  const handleCardReview = (correct: boolean) => {
    // Update the review results
    setReviewResults(prev => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: !correct ? prev.incorrect + 1 : prev.incorrect,
      totalReviewed: prev.totalReviewed + 1,
      xpEarned: prev.xpEarned + (correct ? 5 : 0) // 5 XP for each correct review
    }));

    // Update the user's vocab mastery for this card
    const currentCard = dueCards[currentCardIndex];
    const vocabId = currentCard.id;
    const currentMastery = userProgress.vocabMastery[vocabId] || {
      box: 1,
      lastReviewed: new Date().toISOString(),
      timesReviewed: 0,
      timesCorrect: 0,
      dueDate: calculateNextReviewDate(1)
    };
    
    // Calculate new box level based on correctness
    const newBox = correct 
      ? Math.min(currentMastery.box + 1, 5) // Move up to box 5 max 
      : Math.max(currentMastery.box - 1, 1); // Move down to box 1 min
    
    // Create updated vocab mastery
    const updatedVocabMastery = {
      ...userProgress.vocabMastery,
      [vocabId]: {
        ...currentMastery,
        timesReviewed: currentMastery.timesReviewed + 1,
        timesCorrect: currentMastery.timesCorrect + (correct ? 1 : 0),
        box: newBox,
        lastReviewed: new Date().toISOString(),
        dueDate: calculateNextReviewDate(newBox)
      }
    };

    // Update the user progress in the context
    updateProgress({
      vocabMastery: updatedVocabMastery,
      totalXP: userProgress.totalXP + (correct ? 5 : 0),
      dailyXP: userProgress.dailyXP + (correct ? 5 : 0)
    });

    // Reset flip state and move to next card
    setIsFlipped(false);
    
    // Check if this was the last card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  // If there are no cards due for review
  if (dueCards.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-400 hover:text-white" onClick={onExit}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-mono text-gray-200">VOCABULARY REVIEW</h2>
          </div>
          
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
        
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-16 h-16 rounded-full bg-green-900/40 border-2 border-green-800 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-mono text-green-500 mb-2">ALL CAUGHT UP</h3>
          <p className="text-gray-400 text-center max-w-md">
            You have no vocabulary cards due for review at this time. Check back later as you learn more vocabulary.
          </p>
          <button 
            className="mt-6 px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono"
            onClick={onExit}
          >
            RETURN TO MISSION HUB
          </button>
        </div>
      </div>
    );
  }

  // If the review session is complete
  if (isComplete) {
    return (
      <div className="bg-black min-h-screen text-white p-4 pb-20">
        <div className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto mt-8">
          <div className="text-xs font-mono text-red-500 mb-4">REVIEW COMPLETE</div>
          
          <h3 className="text-2xl font-bold text-white mb-6 text-center">VOCABULARY REPORT</h3>
          
          <div className="bg-red-900/20 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 font-mono">XP EARNED</span>
              <span className="text-2xl font-bold text-red-500">+{reviewResults.xpEarned}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Cards Reviewed</span>
                <span className="text-gray-300">{reviewResults.totalReviewed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Correct Answers</span>
                <span className="text-green-500">{reviewResults.correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Incorrect Answers</span>
                <span className="text-red-500">{reviewResults.incorrect}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Accuracy</span>
                <span className="text-gray-300">
                  {reviewResults.totalReviewed > 0 
                    ? Math.round((reviewResults.correct / reviewResults.totalReviewed) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono"
              onClick={onComplete}
            >
              CONTINUE TO MISSION HUB
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the current vocab card
  const currentCard = dueCards[currentCardIndex];

  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-400 hover:text-white" onClick={onExit}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-mono text-gray-200">VOCABULARY REVIEW</h2>
          <p className="text-xs text-gray-500">{currentCardIndex + 1} of {dueCards.length}</p>
        </div>
        
        <div className="w-6"></div> {/* Spacer for balance */}
      </div>
      
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800">
        <div 
          className="h-1 bg-red-700" 
          style={{ width: `${(currentCardIndex / dueCards.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="py-4">
        {/* Flashcard */}
        <div 
          className="max-w-md mx-auto bg-gray-900 border border-red-900 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="p-1 bg-red-900/50 text-center">
            <span className="text-xs font-mono text-white">
              {isFlipped ? 'TRANSLATION' : 'VOCAB TERM'}
            </span>
          </div>
          
          <div className="p-10">
            {!isFlipped ? (
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{currentCard.word}</h3>
                {currentCard.pronunciation && (
                  <div className="text-gray-400 mb-4">/{currentCard.pronunciation}/</div>
                )}
                <p className="text-sm text-gray-500 mt-4">Tap to reveal translation</p>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{currentCard.translation}</h3>
                {currentCard.example && (
                  <div className="text-gray-400 text-center mt-4">
                    <div className="italic mb-1">{currentCard.example.original}</div>
                    <div>{currentCard.example.translated}</div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="max-w-md mx-auto mt-6 flex justify-between">
          <button 
            className="flex-1 mr-2 py-4 bg-red-900/50 text-white rounded-lg hover:bg-red-900/70 font-mono transition-colors"
            onClick={() => handleCardReview(false)}
            disabled={!isFlipped}
          >
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mb-1">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="text-sm">STILL LEARNING</span>
            </div>
          </button>
          
          <button 
            className="flex-1 ml-2 py-4 bg-green-900/50 text-white rounded-lg hover:bg-green-900/70 font-mono transition-colors"
            onClick={() => handleCardReview(true)}
            disabled={!isFlipped}
          >
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500 mb-1">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-sm">KNOW IT</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSession; 