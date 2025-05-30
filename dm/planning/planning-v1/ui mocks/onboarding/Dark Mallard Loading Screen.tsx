import React, { useState, useEffect } from 'react';

const DarkMallardLoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [decryptedText, setDecryptedText] = useState('');
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  const fullText = "ESTABLISHING SECURE CONNECTION...";
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);
  
  // Text decryption effect
  useEffect(() => {
    if (loadingProgress < 20) return;
    
    const textInterval = setInterval(() => {
      if (decryptedText.length >= fullText.length) {
        clearInterval(textInterval);
        return;
      }
      
      setDecryptedText(fullText.substring(0, decryptedText.length + 1));
    }, 100);
    
    return () => clearInterval(textInterval);
  }, [decryptedText, loadingProgress]);
  
  // Scan line animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLinePosition(prev => (prev + 1) % 100);
    }, 20);
    
    return () => clearInterval(scanInterval);
  }, []);
  
  // Generate encrypted version of remaining text
  const getEncryptedText = () => {
    if (decryptedText.length >= fullText.length) return '';
    const remainingLength = fullText.length - decryptedText.length;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < remainingLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full border-t border-l grid grid-cols-12" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(153, 27, 27, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(153, 27, 27, 0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>
      
      {/* Classified overlay */}
      <div className="absolute top-5 right-5 rotate-12 opacity-10">
        <div className="border-2 border-red-800 px-4 py-1 text-red-800 font-mono font-bold">
          CLASSIFIED
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="font-mono text-4xl font-bold text-red-800 tracking-widest relative">
            DARK MALLARD
            <div className="absolute -left-1 -right-1 -top-1 -bottom-1 border border-red-800 opacity-70"></div>
          </div>
          <div className="text-gray-500 text-xs tracking-widest text-center mt-1 font-mono">
            LANGUAGE ACQUISITION DIVISION
          </div>
        </div>
        
        {/* Duck silhouette */}
        <div className="mb-6 relative">
          <svg width="80" height="80" viewBox="0 0 200 200" className="text-red-800">
            <path fill="currentColor" d="M100,20 C60,20 40,50 40,90 C40,110 50,130 70,140 L60,180 L80,160 L100,180 L120,160 L140,180 L130,140 C150,130 160,110 160,90 C160,50 140,20 100,20 Z M80,70 C85,70 90,75 90,80 C90,85 85,90 80,90 C75,90 70,85 70,80 C70,75 75,70 80,70 Z" />
          </svg>
          
          {/* Scan effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 h-1 bg-red-700 opacity-70" 
                 style={{ top: `${scanLinePosition}%`, boxShadow: '0 0 5px rgba(220, 38, 38, 0.8)' }}></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="h-6 font-mono text-gray-300 mb-4 flex items-center">
          <span className="text-green-500">&gt;</span>
          <span className="ml-2">{decryptedText}</span>
          <span className="text-red-700">{getEncryptedText()}</span>
          <span className={`ml-1 w-2 h-4 bg-gray-300 ${loadingProgress < 100 ? 'animate-pulse' : ''}`}></span>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-4 bg-gray-900 border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50 z-0" 
               style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,.5) 5px, rgba(0,0,0,.5) 10px)' }}></div>
          <div className="h-full bg-red-800 relative z-10 transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }}></div>
          
          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300 font-mono font-bold">
            {scanComplete ? 'CONNECTION SECURE' : `${loadingProgress}%`}
          </div>
        </div>
        
        {/* Status details */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 text-xs font-mono text-gray-500">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${loadingProgress > 30 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>ENCRYPTION: {loadingProgress > 30 ? 'ACTIVE' : 'PENDING'}</span>
          </div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${loadingProgress > 50 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>ASSETS: {loadingProgress > 50 ? 'LOADED' : 'LOADING'}</span>
          </div>
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${loadingProgress > 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>INTEL: {loadingProgress > 70 ? 'AVAILABLE' : 'RETRIEVING'}</span>
          </div>
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${loadingProgress > 90 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>UPLINK: {loadingProgress > 90 ? 'SECURE' : 'VERIFYING'}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>SECURITY LEVEL: {Math.floor(loadingProgress / 20) + 1}/5</div>
        <div className="mt-1">ACCESS CODE: {Math.floor(Math.random() * 900000) + 100000}</div>
      </div>
    </div>
  );
};

export default DarkMallardLoadingScreen;