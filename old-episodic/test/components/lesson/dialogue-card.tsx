'use client';

import { useState } from 'react';
import { DialogueCard as DialogueCardType } from '../../data/lesson-data';
import AgentAvatar from '../agent-avatar';

type DialogueCardProps = {
  card: DialogueCardType;
  onComplete: () => void;
};

const DialogueCard = ({ card, onComplete }: DialogueCardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAdvance = () => {
    if (currentStep < card.conversation.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleAudioPlay = (index: number) => {
    // In a real implementation, this would play audio
    setIsAudioPlaying(true);
    setTimeout(() => {
      setIsAudioPlaying(false);
      // Auto-advance after audio completes if it's the current step
      if (index === currentStep) {
        setTimeout(() => {
          handleAdvance();
        }, 500);
      }
    }, 2000);
  };

  return (
    <div className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto">
      <div className="text-xs font-mono text-red-500 mb-4 flex justify-between items-center">
        <span>DIALOGUE</span>
        <button 
          className="text-xs text-gray-400 hover:text-white"
          onClick={() => setShowAllTranslations(!showAllTranslations)}
        >
          {showAllTranslations ? 'HIDE TRANSLATIONS' : 'SHOW TRANSLATIONS'}
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        {card.conversation.slice(0, currentStep + 1).map((line, index) => (
          <div 
            key={index} 
            className={`flex ${line.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${line.speaker === 'agent' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-center mb-1">
                {line.speaker === 'contact' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <AgentAvatar seed="CONTACT" size={24} variant="undercover" />
                  </div>
                )}
                <span className="text-xs font-mono text-gray-400">
                  {line.speaker === 'agent' ? 'YOU' : 'CONTACT'}
                </span>
                {line.speaker === 'agent' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden ml-2">
                    <AgentAvatar seed="DARK MALLARD" size={24} />
                  </div>
                )}
              </div>
              
              <div className={`rounded-lg p-3 ${
                line.speaker === 'agent' 
                  ? 'bg-red-900/50 text-white' 
                  : 'bg-gray-800 text-white'
              }`}>
                <p>{line.text}</p>
                {(showAllTranslations || index === currentStep) && (
                  <p className="text-gray-400 text-sm mt-1">{line.translation}</p>
                )}
              </div>
              
              {index === currentStep && (
                <div className="flex justify-center mt-2">
                  <button 
                    className={`px-3 py-1 rounded font-mono text-xs ${
                      isAudioPlaying ? 'bg-gray-700 text-gray-300' : 'bg-red-900/50 text-white hover:bg-red-800/50'
                    }`}
                    onClick={() => handleAudioPlay(index)}
                    disabled={isAudioPlaying}
                  >
                    {isAudioPlaying ? 'PLAYING...' : 'PLAY AUDIO'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <div className="flex space-x-1">
          {card.conversation.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-red-500' : 'bg-gray-700'
              }`}
            ></div>
          ))}
        </div>
        
        <button 
          className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono text-sm"
          onClick={handleAdvance}
        >
          {currentStep < card.conversation.length - 1 ? 'NEXT' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
};

export default DialogueCard; 