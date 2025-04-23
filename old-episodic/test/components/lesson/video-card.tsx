'use client';

import { useState } from 'react';
import { VideoCard as VideoCardType } from '../../data/lesson-data';

type VideoCardProps = {
  card: VideoCardType;
  onComplete: () => void;
};

const VideoCard = ({ card, onComplete }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const handlePlayVideo = () => {
    // In a real implementation, this would actually play a video
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="bg-gray-900 border border-red-900 rounded-lg p-6 max-w-xl mx-auto">
      <div className="text-xs font-mono text-red-500 mb-2">VIDEO BRIEFING</div>
      
      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
      <p className="text-gray-400 text-sm mb-6">{card.description}</p>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 aspect-video relative">
        {isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white">Video is playing...</div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <button 
              className="w-16 h-16 rounded-full bg-red-800 flex items-center justify-center"
              onClick={handlePlayVideo}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {card.transcript && (
        <>
          <button 
            className="w-full text-center text-sm text-gray-400 hover:text-white mb-4"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? 'HIDE TRANSCRIPT' : 'SHOW TRANSCRIPT'}
          </button>
          
          {showTranscript && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-white mb-2 text-sm">{card.transcript.original}</p>
              <p className="text-gray-400 text-sm">{card.transcript.translated}</p>
            </div>
          )}
        </>
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

export default VideoCard; 