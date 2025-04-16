import React, { useState, useEffect } from 'react';

const LanguageSelectionScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // Available language operations
  const languages = [
    { 
      id: 'french', 
      name: 'FRENCH',
      region: 'WESTERN EUROPE', 
      operation: 'OPERATION RIVIERA'
    },
    { 
      id: 'spanish', 
      name: 'SPANISH',
      region: 'IBERIA/LATIN AMERICA', 
      operation: 'OPERATION MATADOR'
    },
    { 
      id: 'italian', 
      name: 'ITALIAN',
      region: 'SOUTHERN EUROPE', 
      operation: 'OPERATION VENEZIA'
    },
    { 
      id: 'german', 
      name: 'GERMAN',
      region: 'CENTRAL EUROPE', 
      operation: 'OPERATION ALPINE'
    },
    { 
      id: 'japanese', 
      name: 'JAPANESE',
      region: 'EAST ASIA', 
      operation: 'OPERATION SAKURA'
    }
  ];
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Handle language selection
  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    
    // After a short delay, redirect to next screen
    setTimeout(() => {
      window.location.href = '#skill-assessment';
    }, 2000);
  };
  
  return (
    <div id="language-selection" className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black overflow-hidden font-mono py-16">
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
          COVER IDENTITY SELECTION
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md px-4">
          SELECT TARGET LANGUAGE FOR FIELD OPERATIONS
        </div>
      </div>
      
      {/* Main content - Simplified Language Selection */}
      <div className="z-10 w-full max-w-2xl px-4">
        <div className="border-2 border-red-800/30 bg-black/70 p-6 mb-6">
          <div className="text-gray-300 mb-6">
            Choose your target language to establish operational parameters. Intelligence assets and mission protocols will be calibrated according to your selection.
          </div>
          
          {/* Language options */}
          <div className="space-y-3">
            {languages.map((language) => (
              <div 
                key={language.id}
                className={`border ${selectedLanguage && selectedLanguage.id === language.id ? 'border-red-600 bg-red-900/10' : 'border-gray-700 hover:border-red-600/50 hover:bg-gray-900'} p-4 cursor-pointer transition-colors duration-300`}
                onClick={() => selectLanguage(language)}
              >
                <div className="flex justify-between">
                  <div className="text-gray-200 font-bold">{language.name}</div>
                  <div className="text-gray-400 text-sm">{language.region}</div>
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  {language.operation}
                </div>
                
                {selectedLanguage && selectedLanguage.id === language.id && (
                  <div className="flex justify-end mt-2">
                    <div className="text-green-500 text-xs">TARGET ACQUIRED</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Visual map representation - simplified */}
        <div className="border-2 border-red-800/30 bg-black/70 p-4">
          <div className="text-gray-400 text-xs mb-2">GLOBAL ASSET DISTRIBUTION</div>
          <div className="w-full h-40 bg-gray-900/70 border border-gray-800 relative">
            {/* Minimal world map - just for visual effect */}
            <div className="absolute top-[30%] left-[10%] right-[40%] h-[20%] bg-gray-800/30 border border-gray-700/20"></div>
            <div className="absolute top-[35%] left-[60%] right-[10%] h-[15%] bg-gray-800/30 border border-gray-700/20"></div>
            
            {/* Locations */}
            {selectedLanguage && (
              <div 
                className="absolute w-3 h-3 bg-red-600 rounded-full animate-pulse"
                style={{
                  top: selectedLanguage.id === 'french' ? '30%' : 
                        selectedLanguage.id === 'spanish' ? '40%' : 
                        selectedLanguage.id === 'italian' ? '35%' : 
                        selectedLanguage.id === 'german' ? '25%' : 
                        selectedLanguage.id === 'japanese' ? '35%' : '30%',
                  left: selectedLanguage.id === 'french' ? '45%' : 
                         selectedLanguage.id === 'spanish' ? '40%' : 
                         selectedLanguage.id === 'italian' ? '50%' : 
                         selectedLanguage.id === 'german' ? '48%' : 
                         selectedLanguage.id === 'japanese' ? '80%' : '45%'
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Selection confirmation */}
      {selectedLanguage && (
        <div className="z-10 mt-8 text-center">
          <div className="text-green-500 animate-pulse">
            LANGUAGE TARGET CONFIRMED: {selectedLanguage.name}
          </div>
          <div className="text-gray-400 text-sm mt-2">
            ESTABLISHING SECURE CONNECTION...
          </div>
        </div>
      )}
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>NETWORK UPTIME: 99.7%</div>
        <div className="mt-1 text-gray-500">SYSTEM STATUS: OPERATIONAL</div>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;