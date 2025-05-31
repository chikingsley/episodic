import React, { useState, useEffect } from 'react';

const MissionControlIntroScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [introStage, setIntroStage] = useState(0);
  const [showTutorialHighlight, setShowTutorialHighlight] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  
  // Tutorial elements to highlight
  const tutorialElements = [
    {
      id: 'active-mission',
      name: 'ACTIVE MISSION',
      description: 'Your current mission objective. Complete this to advance your field effectiveness.',
      position: { top: '28%', left: '50%' }
    },
    {
      id: 'intelligence',
      name: 'INTELLIGENCE',
      description: 'Vocabulary and language elements you have acquired through operations.',
      position: { top: '45%', left: '25%' }
    },
    {
      id: 'mission-control',
      name: 'MISSION MAP',
      description: 'Overview of all available and completed operations in your target region.',
      position: { top: '45%', left: '75%' }
    },
    {
      id: 'agent-profile',
      name: 'AGENT PROFILE',
      description: 'Your operational statistics, achievements, and cover identity details.',
      position: { top: '85%', left: '85%' }
    }
  ];
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Progress through intro stages
  useEffect(() => {
    if (introStage === 0) {
      const timer = setTimeout(() => {
        setIntroStage(1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (introStage === 1) {
      const timer = setTimeout(() => {
        setShowTutorialHighlight(true);
        setHighlightedElement(tutorialElements[0]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [introStage]);
  
  // Handle next tutorial highlight
  const showNextHighlight = () => {
    const currentIndex = tutorialElements.findIndex(el => el.id === highlightedElement.id);
    
    if (currentIndex < tutorialElements.length - 1) {
      setHighlightedElement(tutorialElements[currentIndex + 1]);
    } else {
      // End tutorial
      setShowTutorialHighlight(false);
      setHighlightedElement(null);
      setIntroStage(2);
    }
  };
  
  // Handle tutorial completion
  const completeTutorial = () => {
    // In a real app, this would redirect to the actual app interface
    setIntroStage(3);
  };
  
  return (
    <div id="mission-control" className="relative flex flex-col items-center justify-center w-full h-screen bg-black overflow-hidden font-mono">
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
      
      {/* Initial loading screen */}
      {introStage === 0 && (
        <div className="z-10 flex flex-col items-center">
          <div className="text-red-600 text-xl font-bold mb-4 animate-pulse">
            INITIALIZING MISSION CONTROL
          </div>
          <div className="w-64 h-1 bg-gray-800 mb-4">
            <div className="h-full bg-red-600" style={{ width: '60%' }}></div>
          </div>
          <div className="text-gray-400 text-sm">
            ESTABLISHING SECURE CONNECTION...
          </div>
        </div>
      )}
      
      {/* App interface mockup - simplified version */}
      {introStage >= 1 && (
        <div className="z-10 w-full h-full flex flex-col">
          {/* Top header */}
          <div className="border-b border-red-900/30 py-3 px-6 flex justify-between items-center">
            <div className="text-red-600 font-bold">DARK MALLARD</div>
            <div className="text-xs text-gray-500">SECURITY LEVEL: OPERATIONAL</div>
          </div>
          
          {/* Main content area - mockup */}
          <div className="flex-1 relative">
            {/* Mission card */}
            <div className="absolute w-[80%] max-w-md border border-red-900/50 bg-black/70 p-4" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
              <div className="text-red-600 text-sm font-bold mb-2">ACTIVE MISSION</div>
              <div className="text-gray-300 font-bold">Operation Café Encounter</div>
              <div className="text-gray-500 text-sm mt-1">Learn essential café vocabulary and order protocol</div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-gray-500">PROGRESS: 20%</div>
                <button className="border border-red-700 text-red-600 px-3 py-1 text-sm hover:bg-red-900/20">CONTINUE</button>
              </div>
            </div>
            
            {/* Intelligence section hint */}
            <div className="absolute w-32 h-32 border border-gray-800/50 flex items-center justify-center rounded-full" style={{ top: '40%', left: '20%' }}>
              <div className="text-center">
                <div className="text-gray-600 text-xs">INTEL</div>
              </div>
            </div>
            
            {/* Mission map hint */}
            <div className="absolute w-32 h-32 border border-gray-800/50 flex items-center justify-center rounded-full" style={{ top: '40%', left: '80%' }}>
              <div className="text-center">
                <div className="text-gray-600 text-xs">MISSIONS</div>
              </div>
            </div>
          </div>
          
          {/* Bottom navigation */}
          <div className="border-t border-red-900/30 py-3 px-6 flex justify-around">
            <div className="text-red-600 text-center">
              <div className="text-xs">HQ</div>
            </div>
            <div className="text-gray-600 text-center">
              <div className="text-xs">INTEL</div>
            </div>
            <div className="text-gray-600 text-center">
              <div className="text-xs">MISSIONS</div>
            </div>
            <div className="text-gray-600 text-center">
              <div className="text-xs">AGENT</div>
            </div>
          </div>
          
          {/* Tutorial overlay */}
          {showTutorialHighlight && highlightedElement && (
            <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center">
              {/* Highlight circle */}
              <div 
                className="absolute w-32 h-32 rounded-full border-2 border-red-600 animate-pulse"
                style={{ 
                  top: highlightedElement.position.top, 
                  left: highlightedElement.position.left,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Info card */}
              <div className="absolute w-64 bg-black border border-red-900 p-4" style={{ bottom: '20%', left: '50%', transform: 'translateX(-50%)' }}>
                <div className="text-red-600 font-bold mb-2">
                  {highlightedElement.name}
                </div>
                <div className="text-gray-400 text-sm mb-4">
                  {highlightedElement.description}
                </div>
                <button 
                  onClick={showNextHighlight}
                  className="w-full border border-red-700 py-2 text-red-600 hover:bg-red-900/20"
                >
                  CONTINUE BRIEFING
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Final tutorial steps */}
      {introStage === 2 && (
        <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center">
          <div className="w-80 bg-black border-2 border-red-800/30 p-6">
            <div className="text-red-600 font-bold mb-2">
              MISSION CONTROL ACTIVATED
            </div>
            <div className="text-gray-300 mb-4">
              All systems operational. You are now ready to begin your field training in language acquisition.
            </div>
            <div className="text-gray-400 text-sm mb-6">
              Your first mission has been prepared. Complete it to establish your presence in the field.
            </div>
            <button 
              onClick={completeTutorial}
              className="w-full border-2 border-red-700 py-3 text-red-600 font-bold hover:bg-red-900/20"
            >
              BEGIN OPERATIONS
            </button>
          </div>
        </div>
      )}
      
      {/* Mission success message */}
      {introStage === 3 && (
        <div className="z-10 text-center px-4">
          <div className="text-green-500 text-xl font-bold mb-4">
            ONBOARDING COMPLETE
          </div>
          <div className="text-gray-300 mb-8">
            Your agent profile has been successfully established. Welcome to The Network.
          </div>
          <div className="text-gray-400 text-sm mb-8">
            This is the end of our mockup flow. In the real app, you would now be taken to the HQ screen to begin your first mission.
          </div>
          <a 
            href="#encrypted-transmission"
            className="border-2 border-red-800 px-8 py-3 text-red-600 font-bold tracking-wide hover:bg-red-800 hover:text-white transition-colors duration-300"
          >
            RESTART DEMO
          </a>
        </div>
      )}
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>SYSTEM STATUS: OPERATIONAL</div>
        <div className="mt-1 text-gray-500">VERSION: 1.0.0-ALPHA</div>
      </div>
    </div>
  );
};

export default MissionControlIntroScreen;