import React, { useState, useEffect } from 'react';

const SkillAssessmentScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Skill level options with descriptions
  const skillLevels = [
    {
      id: 'level0',
      name: 'LEVEL 0',
      title: 'NO PRIOR KNOWLEDGE',
      description: 'Start with the basics. No previous exposure to the language.',
      securityClearance: 'RESTRICTED'
    },
    {
      id: 'level1',
      name: 'LEVEL 1',
      title: 'BASIC PHRASES ONLY',
      description: 'Familiar with common greetings and simple expressions.',
      securityClearance: 'CONFIDENTIAL'
    },
    {
      id: 'level2',
      name: 'LEVEL 2',
      title: 'ELEMENTARY PROFICIENCY',
      description: 'Can handle simple conversations and understand basic texts.',
      securityClearance: 'SECRET'
    },
    {
      id: 'level3',
      name: 'LEVEL 3',
      title: 'PROFESSIONAL PROFICIENCY',
      description: 'Comfortable with complex conversations in most contexts.',
      securityClearance: 'TOP SECRET'
    },
    {
      id: 'level4',
      name: 'LEVEL 4',
      title: 'NATIVE/BILINGUAL',
      description: 'Complete fluency comparable to native speakers.',
      securityClearance: 'COSMIC TOP SECRET'
    }
  ];
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Handle level selection
  const selectLevel = (level) => {
    setSelectedLevel(level);
    setShowConfirmation(true);
    
    // Auto proceed after confirmation
    setTimeout(() => {
      window.location.href = '#mission-motivation';
    }, 2000);
  };
  
  return (
    <div id="skill-assessment" className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black overflow-hidden font-mono py-16">
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
          AGENT SKILL ASSESSMENT
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md px-4">
          CURRENT PROFICIENCY LEVEL IN TARGET LANGUAGE
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-2xl px-4">
        {/* Skill level options */}
        <div className="space-y-4">
          {skillLevels.map((level) => (
            <div 
              key={level.id}
              className={`border ${selectedLevel && selectedLevel.id === level.id ? 'border-red-600' : 'border-gray-700'} bg-black/70 p-4 cursor-pointer transition-all duration-300 hover:border-red-600/70`}
              onClick={() => selectLevel(level)}
            >
              <div className="flex items-center justify-between">
                <div className="text-gray-200 font-bold">{level.title}</div>
                <div className={`text-xs px-2 py-1 border ${selectedLevel && selectedLevel.id === level.id ? 'border-red-600 text-red-600' : 'border-gray-600 text-gray-500'}`}>
                  {level.name}
                </div>
              </div>
              <div className="text-gray-400 text-sm mt-2">
                {level.description}
              </div>
              <div className="flex justify-between mt-3 text-xs">
                <div className="text-gray-500">
                  SECURITY CLEARANCE: <span className={selectedLevel && selectedLevel.id === level.id ? 'text-red-500' : 'text-gray-500'}>
                    {level.securityClearance}
                  </span>
                </div>
                {selectedLevel && selectedLevel.id === level.id && (
                  <div className="text-green-500">SELECTED</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Confirmation message */}
        <div className={`mt-6 text-center transition-opacity duration-500 ${showConfirmation ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-green-500 animate-pulse">
            PROFICIENCY LEVEL CONFIRMED. CALIBRATING TRAINING PROTOCOLS...
          </div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>ASSESSMENT PROTOCOL: SELF-EVALUATION</div>
        <div className="mt-1 text-gray-500">VERIFICATION METHOD: FIELD TRAINING</div>
      </div>
    </div>
  );
};

export default SkillAssessmentScreen;