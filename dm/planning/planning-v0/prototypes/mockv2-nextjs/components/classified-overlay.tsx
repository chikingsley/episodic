import React from 'react';

interface ClassifiedOverlayProps {
  children: React.ReactNode;
  level?: 'top-secret' | 'classified' | 'restricted';
  isLocked?: boolean;
  onUnlock?: () => void;
}

const ClassifiedOverlay: React.FC<ClassifiedOverlayProps> = ({ 
  children, 
  level = 'classified',
  isLocked = true,
  onUnlock 
}) => {
  const levelColors = {
    'top-secret': 'bg-red-900/80 border-red-700',
    'classified': 'bg-amber-900/80 border-amber-700',
    'restricted': 'bg-blue-900/80 border-blue-700'
  };

  const levelStyle = levelColors[level];
  
  if (!isLocked) {
    return <>{children}</>;
  }
  
  return (
    <div className="relative rounded-md overflow-hidden">
      {/* Semi-transparent content */}
      <div className="opacity-20 pointer-events-none filter blur-[1px]">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`p-3 ${levelStyle} rounded-md border-2 flex flex-col items-center transform rotate-[-5deg]`}>
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 mr-1.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-white font-bold font-mono tracking-wider uppercase">
              {level.replace('-', ' ')}
            </span>
          </div>
          
          {/* This would use the Redacted font in production */}
          <p className="font-mono text-white opacity-80 mb-2 text-center uppercase" style={{ fontFamily: "'Redacted', monospace" }}>
            Access restricted
            <br />
            Clearance required
          </p>
          
          {onUnlock && (
            <button 
              onClick={onUnlock}
              className="mt-2 px-4 py-1 bg-red-700 hover:bg-red-600 text-white font-mono text-sm rounded-sm"
            >
              REQUEST ACCESS
            </button>
          )}
        </div>
        
        {/* Stamp effect */}
        <div className="absolute top-2 right-2 transform rotate-12 text-red-600 font-bold border-2 border-red-600 px-2 py-0.5 rounded-sm text-xs">
          CLASSIFIED
        </div>
      </div>
    </div>
  );
};

export default ClassifiedOverlay; 