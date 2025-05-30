'use client';

import { useState } from 'react';
import { QuizCard as QuizCardType } from '../../data/lesson-data';

type QuizCardProps = {
  card: QuizCardType;
  onComplete: (correct: boolean, points: number) => void;
};

const QuizCard = ({ card, onComplete }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    let correct = false;
    const userAnswer = card.questionType === 'multiple-choice' ? selectedAnswer : textAnswer;
    
    if (Array.isArray(card.correctAnswer)) {
      correct = card.correctAnswer.includes(userAnswer);
    } else {
      // For translation and fill-blank, allow case-insensitive comparison
      correct = userAnswer.toLowerCase() === card.correctAnswer.toLowerCase();
    }
    
    setIsCorrect(correct);
    setHasSubmitted(true);
    
    // If correct, call onComplete immediately
    if (correct) {
      setTimeout(() => {
        onComplete(correct, card.points);
      }, 1500);
    }
  };

  const handleContinue = () => {
    onComplete(isCorrect, isCorrect ? card.points : 0);
  };

  const renderQuestionType = () => {
    switch (card.questionType) {
      case 'multiple-choice':
        return (
          <div className="space-y-3 mb-6">
            {card.options?.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded-lg font-mono text-sm ${
                  hasSubmitted
                    ? option === card.correctAnswer
                      ? 'bg-green-800 text-white border border-green-700'
                      : selectedAnswer === option && selectedAnswer !== card.correctAnswer
                        ? 'bg-red-900 text-white border border-red-800'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    : selectedAnswer === option
                      ? 'bg-red-900/50 text-white border border-red-800'
                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
                onClick={() => !hasSubmitted && setSelectedAnswer(option)}
                disabled={hasSubmitted}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'translation':
      case 'fill-blank':
        return (
          <div className="mb-6">
            <textarea
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none h-24"
              placeholder={card.questionType === 'translation' ? "Type your translation..." : "Fill in the blank..."}
              value={textAnswer}
              onChange={(e) => !hasSubmitted && setTextAnswer(e.target.value)}
              disabled={hasSubmitted}
            />
            
            {hasSubmitted && (
              <div className={`mt-3 p-3 rounded-lg ${isCorrect ? 'bg-green-800/30 border border-green-700' : 'bg-red-900/30 border border-red-800'}`}>
                <p className="text-sm font-mono mb-1">{isCorrect ? 'CORRECT' : 'INCORRECT'}</p>
                <p className="text-white">
                  {typeof card.correctAnswer === 'string' ? card.correctAnswer : card.correctAnswer.join(' or ')}
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto">
      <div className="text-xs font-mono text-red-500 mb-2 flex justify-between items-center">
        <span>QUIZ</span>
        <span>{card.points} XP</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-6">{card.question}</h3>
      
      {renderQuestionType()}
      
      <div className="flex justify-end">
        {!hasSubmitted ? (
          <button 
            className={`px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono text-sm ${
              (card.questionType === 'multiple-choice' && !selectedAnswer) ||
              ((card.questionType === 'translation' || card.questionType === 'fill-blank') && !textAnswer)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={checkAnswer}
            disabled={
              (card.questionType === 'multiple-choice' && !selectedAnswer) ||
              ((card.questionType === 'translation' || card.questionType === 'fill-blank') && !textAnswer)
            }
          >
            SUBMIT
          </button>
        ) : (
          <button 
            className={`px-4 py-2 ${
              isCorrect 
                ? 'bg-green-800 hover:bg-green-700' 
                : 'bg-red-800 hover:bg-red-700'
            } text-white rounded-lg font-mono text-sm`}
            onClick={handleContinue}
          >
            {isCorrect ? 'CONTINUE' : 'TRY NEXT QUESTION'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard; 