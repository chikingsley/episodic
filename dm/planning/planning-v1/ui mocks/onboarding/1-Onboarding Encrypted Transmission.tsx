import React, { useState, useEffect } from 'react';

const EncryptedTransmissionScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [interference, setInterference] = useState(true);
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Text animation timing
  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1500);
    
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    
    const interferenceTimer = setTimeout(() => {
      setInterference(false);
    }, 1000);
    
    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
      clearTimeout(interferenceTimer);
    };
  }, []);
  
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black overflow-hidden font-mono">
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
        
        {/* Static interference overlay */}
        {interference && (
          <div className="absolute inset-0 bg-black opacity-40 z-10 pointer-events-none">
            {Array(100).fill().map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  opacity: Math.random() * 0.4
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div className="relative mb-12">
          <div className="border-t-2 border-l-2 border-r-2 border-red-800/50 pt-1 px-4">
            <div className="border-l-2 border-r-2 border-t-2 border-red-800/30 pt-2 px-6">
              <div className="relative">
                <div className="font-mono text-3xl font-bold text-red-600 tracking-widest py-1 px-3">
                  DARK MALLARD
                </div>
                <div className="absolute -inset-0.5 border border-red-800/20" />
              </div>
            </div>
          </div>
          <div className="border-b-2 border-l-2 border-r-2 border-red-800/50 pb-1 px-4">
            <div className="border-b-2 border-l-2 border-r-2 border-red-800/30 pb-2 px-6">
              <div className="text-gray-500 text-xs tracking-widest text-center font-mono">
                LANGUAGE ACQUISITION DIVISION
              </div>
            </div>
          </div>
        </div>
        
        {/* Transmission text */}
        <div className={`transition-opacity duration-1000 ease-in-out ${showText ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-red-600 text-lg font-bold mb-4 tracking-wide animate-pulse">
            INCOMING TRANSMISSION
          </div>
          <div className="text-gray-400 text-sm max-w-md mb-12 leading-relaxed">
            Secure communication established. The Network has identified you as a potential asset for classified language acquisition operations. Standby for further instructions.
          </div>
        </div>
        
        {/* Accept button */}
        <div className={`transition-opacity duration-1000 ease-in-out ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <a href="#recruitment-pitch" className="block border-2 border-red-800 px-8 py-3 text-red-600 font-bold tracking-wide hover:bg-red-800 hover:text-white transition-colors duration-300">
            ACCEPT TRANSMISSION
          </a>
        </div>
      </div>
      
      {/* TOP SECRET overlay */}
      <div className="absolute top-5 right-5 rotate-12 opacity-8 select-none z-20">
        <div className="border-2 border-red-700 px-6 py-2">
          <div className="text-red-700 font-mono text-lg font-bold">CLASSIFIED</div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>TRANSMISSION ID: {Math.floor(Math.random() * 900000) + 100000}</div>
        <div className="mt-1 text-gray-500">ENCRYPTION: AES-256-GCM</div>
      </div>
    </div>
  );
};

export default EncryptedTransmissionScreen;