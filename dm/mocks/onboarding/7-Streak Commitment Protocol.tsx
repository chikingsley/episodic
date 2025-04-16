import React, { useState, useEffect } from 'react';

const StreakCommitmentProtocolScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedStreak, setSelectedStreak] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Streak commitment options
  const streakOptions = [
    {
      id: 'streak-7',
      days: 7,
      label: '7 DAY STREAK',
      description: 'Initial field readiness threshold.',
      rating: 'GOOD',
      securityLevel: 'BASELINE'
    },
    {
      id: 'streak-14',
      days: 14,
      label: '14 DAY STREAK',
      description: 'Standard operational persistence.',
      rating: 'GREAT',
      securityLevel: 'ELEVATED'
    },
    {
      id: 'streak-30',
      days: 30,
      label: '30 DAY STREAK',
      description: 'Advanced field commitment protocol.',
      rating: 'INCREDIBLE',
      securityLevel: 'SUPERIOR'
    },
    {
      id: 'streak-50',
      days: 50,
      label: '50 DAY STREAK',
      description: 'Elite agent operational consistency.',
      rating: 'UNSTOPPABLE',
      securityLevel: 'MAXIMUM'
    }
  ];
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Handle streak selection
  const selectStreak = (streak) => {
    setSelectedStreak(streak);
    setShowConfirmation(true);
    
    // Auto proceed after confirmation
    setTimeout(() => {
      window.location.href = '#agent-registration';
    }, 2000);
  };

  // Handle confirmation button click
  const handleConfirmation = () => {
    if (selectedStreak) {
      window.location.href = '#agent-registration';
    }
  };
  
  return (
    <div id="commitment-protocol" className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black overflow-hidden font-mono py-16">
      {/* Background grid and effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-15"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px',
               backgroundPosition: '-0.5px -0.5px'
             }}>
        </div>
        
        {/* Scan line effect */}
        <div className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-30"
             style={{ 
               top: `${scanPosition}%`, 
               boxShadow: '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.4)'
             }}>
        </div>
        
        {/* CRT scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
             style={{
               backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.1) 50%)',
               backgroundSize: '100% 4px'
             }}>
        </div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 opacity-70"
             style={{
               background: 'radial-gradient(circle, transparent 30%, black 90%)'
             }}>
        </div>
      </div>
      
      {/* Header */}
      <div className="z-10 flex flex-col items-center mb-8">
        <div className="text-red-600 text-xl font-bold mb-2 tracking-wide">
          OPERATIONAL CONTINUITY PROTOCOL
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md px-4">
          ESTABLISH FIELD PRESENCE COMMITMENT
        </div>
      </div>
      
      {/* Calendar icon with streak */}
      <div className="z-10 mb-8 relative w-28 h-28">
        {/* Calendar base */}
        <div className="absolute inset-0 bg-orange-500 rounded-lg"></div>
        <div className="absolute left-2 right-2 top-0 h-6 bg-orange-600 rounded-t-md"></div>
        
        {/* Calendar page */}
        <div className="absolute left-1 right-1 top-4 bottom-1 bg-white rounded-md flex items-center justify-center">
          <div className="text-4xl font-bold text-red-600">{selectedStreak ? selectedStreak.days : 7}</div>
        </div>
        
        {/* Agent silhouette */}
        <div className="absolute -right-8 -bottom-4 w-16 h-16">
          <div className="w-14 h-14 bg-green-500 rounded-full relative overflow-hidden">
            <div className="absolute left-3 top-3 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute right-3 top-3 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute left-1/2 top-9 w-5 h-2 bg-black rounded-full" style={{ transform: 'translateX(-50%)' }}></div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-xl px-4">
        {/* Streak explanation */}
        <div className="border-2 border-red-800/30 bg-black/70 p-5 mb-6">
          <div className="text-gray-300 mb-4">
            Field persistence is critical for mission success. Establish a consistent operational rhythm to maintain language acquisition momentum and neural pathway reinforcement.
          </div>
          <div className="text-gray-400 text-sm">
            Select your streak commitment protocol to calibrate mission scheduling parameters.
          </div>
        </div>
        
        {/* Streak options */}
        <div className="space-y-4">
          {streakOptions.map((streak) => (
            <div 
              key={streak.id}
              className={`border ${selectedStreak && selectedStreak.id === streak.id ? 'border-red-600' : 'border-gray-700'} bg-black/70 p-4 cursor-pointer transition-all duration-300 hover:border-red-600/70 flex justify-between items-center`}
              onClick={() => selectStreak(streak)}
            >
              <div>
                <div className="text-gray-200 font-bold">{streak.label}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {streak.description}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  SECURITY LEVEL: {streak.securityLevel}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`
                  ${streak.rating === 'GOOD' ? 'text-green-500' : 
                    streak.rating === 'GREAT' ? 'text-blue-500' : 
                    streak.rating === 'INCREDIBLE' ? 'text-purple-500' : 
                    'text-orange-500'}
                  font-bold
                `}>
                  {streak.rating}
                </div>
                
                {selectedStreak && selectedStreak.id === streak.id && (
                  <div className="mt-1 text-green-500 text-xs">SELECTED</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Streak visualization */}
        {selectedStreak && (
          <div className="mt-6 border border-red-800/30 bg-black/70 p-4">
            <div className="text-gray-400 text-xs mb-3">VISUAL PROTOCOL TIMELINE</div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: selectedStreak.days }).map((_, index) => (
                <div 
                  key={index}
                  className={`w-5 h-5 rounded-sm border ${index === 0 ? 'bg-red-600 border-red-700' : 'border-gray-700'}`}
                ></div>
              ))}
            </div>
          </div>
        )}
        
        {/* Confirmation button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleConfirmation}
            className="border-2 border-red-800 px-8 py-3 text-red-600 font-bold tracking-wide hover:bg-red-800 hover:text-white transition-colors duration-300 w-full"
          >
            CONFIRM COMMITMENT
          </button>
        </div>
        
        {/* Confirmation message */}
        <div className={`mt-6 text-center transition-opacity duration-500 ${showConfirmation ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-green-500 animate-pulse">
            COMMITMENT PROTOCOL REGISTERED. CALIBRATING FIELD OPERATIONS...
          </div>
        </div>
      </div>
      
      {/* File classification stamp */}
      <div className="absolute top-5 right-5 rotate-12 opacity-8 select-none z-20">
        <div className="border-2 border-red-700 px-6 py-2">
          <div className="text-red-700 font-mono text-lg font-bold">PERSONNEL</div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>PROTOCOL: OPERATIONAL CONTINUITY</div>
        <div className="mt-1 text-gray-500">FIELD PERSISTENCE ENHANCEMENT</div>
      </div>
    </div>
  );
};

export default StreakCommitmentProtocolScreen;