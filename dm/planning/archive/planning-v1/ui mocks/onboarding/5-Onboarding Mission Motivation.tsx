import React, { useState, useEffect } from 'react';

const MissionMotivationScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedMotivation, setSelectedMotivation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Mission motivation options
  const motivations = [
    {
      id: 'infiltration',
      name: 'INFILTRATION',
      title: 'Travel & Tourism',
      description: 'Develop language skills for seamless travel operations in target territories.',
      icon: '✈️',
      color: 'text-blue-500'
    },
    {
      id: 'asset',
      name: 'ASSET CULTIVATION',
      title: 'Meeting People',
      description: 'Build relationships with foreign nationals through linguistic connection.',
      icon: '👥',
      color: 'text-green-500'
    },
    {
      id: 'deepcover',
      name: 'DEEP COVER',
      title: 'Living Abroad',
      description: 'Prepare for long-term immersion in foreign environment.',
      icon: '🏙️',
      color: 'text-purple-500'
    },
    {
      id: 'intelligence',
      name: 'INTELLIGENCE ANALYSIS',
      title: 'Business & Career',
      description: 'Acquire language skills to advance professional objectives in target region.',
      icon: '💼',
      color: 'text-yellow-500'
    },
    {
      id: 'personal',
      name: 'PERSONAL INTEREST',
      title: 'Just for Fun',
      description: 'Self-initiated language acquisition for personal development.',
      icon: '🎯',
      color: 'text-pink-500'
    }
  ];
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Handle motivation selection
  const selectMotivation = (motivation) => {
    setSelectedMotivation(motivation);
    setShowConfirmation(true);
    
    // Auto proceed after confirmation
    setTimeout(() => {
      window.location.href = '#training-simulation';
    }, 2000);
  };
  
  return (
    <div id="mission-motivation" className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black overflow-hidden font-mono py-16">
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
          MISSION PARAMETERS
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md px-4">
          PRIMARY OBJECTIVE FOR LANGUAGE ACQUISITION
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-2xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motivations.map((motivation) => (
            <div 
              key={motivation.id}
              className={`border ${selectedMotivation && selectedMotivation.id === motivation.id ? 'border-red-600' : 'border-gray-700'} bg-black/70 p-4 cursor-pointer transition-all duration-300 hover:border-red-600/70`}
              onClick={() => selectMotivation(motivation)}
            >
              <div className="flex items-start">
                <div className="text-3xl mr-3 mt-1">
                  {motivation.icon}
                </div>
                <div>
                  <div className={`text-sm ${motivation.color} font-bold`}>
                    {motivation.name}
                  </div>
                  <div className="text-gray-200 font-bold mt-1">
                    {motivation.title}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    {motivation.description}
                  </div>
                </div>
              </div>
              
              {selectedMotivation && selectedMotivation.id === motivation.id && (
                <div className="mt-3 text-right">
                  <div className="text-green-500 text-xs">SELECTED</div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Confirmation message */}
        <div className={`mt-6 text-center transition-opacity duration-500 ${showConfirmation ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-green-500 animate-pulse">
            OBJECTIVE REGISTERED. CUSTOMIZING FIELD TRAINING...
          </div>
        </div>
      </div>
      
      {/* File classification stamp */}
      <div className="absolute top-5 right-5 rotate-12 opacity-8 select-none z-20">
        <div className="border-2 border-red-700 px-6 py-2">
          <div className="text-red-700 font-mono text-lg font-bold">EYES ONLY</div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>DIRECTIVE: MISSION-FOCUSED TRAINING</div>
        <div className="mt-1 text-gray-500">PRIORITY: OPERATIONAL EFFICIENCY</div>
      </div>
    </div>
  );
};

export default MissionMotivationScreen;