'use client';

import { useState } from 'react';
import { VocabCard as VocabCardType } from '../../data/lesson-data';
import Image from 'next/image';

type VocabCardProps = {
  card: VocabCardType;
  onComplete: () => void;
};

const VocabCard = ({ card, onComplete }: VocabCardProps) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAudioPlay = () => {
    // In a real implementation, this would play audio
    setIsAudioPlaying(true);
    setTimeout(() => {
      setIsAudioPlaying(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto">
      <div className="text-xs font-mono text-red-500 mb-2">VOCABULARY</div>
      
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-white mb-1">{card.word}</h3>
        {card.pronunciation && (
          <p className="text-gray-400 text-sm font-mono">[{card.pronunciation}]</p>
        )}
      </div>
      
      <div className="flex justify-center mb-6">
        {card.imageUrl ? (
          <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden">
            <Image src={card.imageUrl} alt={card.word} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-4xl">{card.word.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mb-6">
        <button 
          className={`px-4 py-2 rounded-lg font-mono text-sm ${isAudioPlaying ? 'bg-gray-700 text-gray-300' : 'bg-red-900 text-white hover:bg-red-800'}`}
          onClick={handleAudioPlay}
          disabled={isAudioPlaying}
        >
          {isAudioPlaying ? 'PLAYING...' : 'PLAY AUDIO'}
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        {showTranslation ? (
          <div className="text-white text-center text-xl">{card.translation}</div>
        ) : (
          <button 
            className="w-full text-gray-400 text-center py-2 hover:text-white"
            onClick={() => setShowTranslation(true)}
          >
            Tap to reveal translation
          </button>
        )}
      </div>
      
      {card.example && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-white mb-2 text-sm">{card.example.original}</p>
          <p className="text-gray-400 text-sm">{card.example.translated}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 font-mono text-sm"
          onClick={onComplete}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default VocabCard; 