import React, { useState, useEffect } from 'react';

const RecruitmentPitchScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Simulate video loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Text typing animation
  useEffect(() => {
    if (textProgress < 100 && videoReady) {
      const textInterval = setInterval(() => {
        setTextProgress(prev => Math.min(prev + 1, 100));
      }, 40);
      return () => clearInterval(textInterval);
    }
  }, [textProgress, videoReady]);
  
  // Calculate text to display based on progress
  const commandantSpeech = "The Network is seeking agents with exceptional language acquisition potential. Your profile indicates aptitude for covert operations requiring linguistic expertise. Our missions demand operatives who can blend seamlessly into foreign environments, extract critical intelligence, and maintain cover under pressure. This is not merely language learning - it's mission-critical training with real-world applications.";
  
  const displayedText = commandantSpeech.substring(0, Math.floor(commandantSpeech.length * (textProgress / 100)));
  
  return (
    <div id="recruitment-pitch" className="relative flex flex-col items-center justify-center w-full h-screen bg-black overflow-hidden font-mono">
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
      
      {/* Main content */}
      <div className="z-10 flex flex-col w-full max-w-3xl px-4">
        {/* Commandant video feed */}
        <div className="relative mb-6 border-2 border-red-800/50 aspect-video">
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-red-600 animate-pulse">ESTABLISHING CONNECTION...</div>
            </div>
          )}
          
          {videoReady && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="relative">
                {/* Commandant silhouette */}
                <div className="w-32 h-32 bg-black rounded-full mx-auto mb-4"></div>
                <div className="w-48 h-12 bg-black rounded-sm mx-auto"></div>
                
                {/* Visual overlay elements */}
                <div className="absolute inset-0 flex items-center justify-center text-red-600 text-opacity-30 text-xs">
                  LIVE TRANSMISSION
                </div>
                
                {/* Scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-30"
                     style={{ 
                       top: `${scanPosition % 100}%`, 
                       boxShadow: '0 0 5px rgba(220, 38, 38, 0.4)'
                     }}>
                </div>
              </div>
            </div>
          )}
          
          {/* Video UI elements */}
          <div className="absolute top-2 left-2 text-red-600 text-xs">
            SECURE CHANNEL: ALPHA-7
          </div>
          
          <div className="absolute top-2 right-2 text-red-600 text-xs">
            <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse mr-1"></span>
            LIVE
          </div>
          
          <div className="absolute bottom-2 left-2 text-red-600 text-xs">
            COMMANDANT RENARD
          </div>
          
          <div className="absolute bottom-2 right-2 text-red-600 text-xs">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        {/* Transmission text */}
        <div className="border-2 border-red-800/30 bg-black/70 p-4 mb-8 h-40 overflow-y-auto">
          <div className="text-gray-300 leading-relaxed text-sm">
            {displayedText}
            <span className={`ml-1 inline-block w-2 h-4 bg-gray-300 ${textProgress < 100 ? 'animate-pulse' : 'opacity-0'}`}></span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center space-x-6">
          <a href="#language-selection" className="border-2 border-red-800 px-6 py-3 text-red-600 font-bold tracking-wide hover:bg-red-800 hover:text-white transition-colors duration-300">
            ACCEPT MISSION
          </a>
          
          <button className="border-2 border-gray-700 px-6 py-3 text-gray-500 font-bold tracking-wide hover:bg-gray-800 hover:text-white transition-colors duration-300">
            DECLINE
          </button>
        </div>
      </div>
      
      {/* TOP SECRET overlay */}
      <div className="absolute top-5 right-5 rotate-12 opacity-8 select-none z-20">
        <div className="border-2 border-red-700 px-6 py-2">
          <div className="text-red-700 font-mono text-lg font-bold">CLASSIFIED</div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>BRIEFING REF: R7-{Math.floor(Math.random() * 9000) + 1000}</div>
        <div className="mt-1 text-gray-500">SECURITY LEVEL: RESTRICTED</div>
      </div>
    </div>
  );
};

export default RecruitmentPitchScreen;