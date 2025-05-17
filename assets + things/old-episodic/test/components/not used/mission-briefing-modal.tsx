function MissionBriefingModal({ isOpen, onClose, darkMode = true }) {
  // We'll create a self-contained component without useState to avoid syntax issues
  
  // Theme colors based on mode
  const theme = {
    background: darkMode ? 'bg-black' : 'bg-gray-100',
    cardBg: darkMode ? 'bg-gray-900' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    textTertiary: darkMode ? 'text-gray-500' : 'text-gray-500',
    border: darkMode ? 'border-red-900' : 'border-red-300',
    borderSecondary: darkMode ? 'border-gray-800' : 'border-gray-300',
    accent: darkMode ? 'bg-red-900/30' : 'bg-red-100',
    accentBorder: darkMode ? 'border-red-800' : 'border-red-300',
    accentText: darkMode ? 'text-red-500' : 'text-red-700',
    buttonBg: darkMode ? 'bg-red-800' : 'bg-red-600',
    statusGreen: darkMode ? 'bg-green-900/30' : 'bg-green-100',
    statusGreenBorder: darkMode ? 'border-green-800' : 'border-green-300',
    statusGreenText: darkMode ? 'text-green-500' : 'text-green-700',
    cardGradient: darkMode ? 'from-gray-900 to-gray-950' : 'from-white to-gray-50'
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-black' : 'bg-gray-900'} bg-opacity-95 z-50 flex flex-col`}>
      {/* Header with Decryption Animation */}
      <div className={`p-4 flex items-center border-b ${theme.border}`}>
        <button 
          className="mr-2"
          onClick={onClose}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={theme.accentText}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={`text-xl font-bold font-mono ${theme.text}`}>MISSION BRIEFING</h1>
        
        {/* Decryption Animation */}
        <div className="ml-4 h-4 w-24 overflow-hidden relative">
          <div className={`absolute top-1 left-0 h-2 w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
          <div className={`absolute top-1 left-0 h-2 w-full ${darkMode ? 'bg-red-800' : 'bg-red-600'} animate-decrypt`} 
               style={{width: '0%', animation: 'decrypt 3s ease-in forwards'}}>
          </div>
        </div>
        <span className={`ml-2 text-xs font-mono ${theme.textSecondary}`}>DECRYPTING</span>
      </div>
      
      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Mission Brief Card with Classification */}
        <div className={`${theme.cardBg} border ${theme.border} rounded-lg p-4 mb-4 relative`}>
          {/* TOP SECRET Stamp */}
          <div className="absolute top-3 right-3 rotate-[-20deg] opacity-20 pointer-events-none">
            <div className={`border-2 ${darkMode ? 'border-red-800' : 'border-red-600'} rounded px-2 py-0.5`}>
              <span className={`font-mono text-sm ${darkMode ? 'text-red-800' : 'text-red-600'} font-black tracking-tighter`}>TOP SECRET</span>
            </div>
          </div>
          
          {/* Redacted Text Effect */}
          <div className="absolute bottom-6 left-12 opacity-10 pointer-events-none">
            <div className="w-32 h-3 bg-black"></div>
            <div className="w-48 h-3 bg-black mt-2"></div>
            <div className="w-20 h-3 bg-black mt-2"></div>
          </div>
        
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-3`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.accentText}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div>
              <p className={`text-xs font-mono ${theme.accentText}`}>OPERATION</p>
              <h3 className={`font-mono ${theme.text} text-lg`}>CANNES INFILTRATION</h3>
            </div>
          </div>
          
          {/* Typewriter Text Animation */}
          <div>
            <p className={`text-sm ${theme.textSecondary} font-mono mb-4 animate-typewriter overflow-hidden whitespace-nowrap`}
               style={{animation: 'typing 3.5s steps(50, end) forwards'}}>
              CLASSIFIED BRIEFING: Your mission is to infiltrate high society in Cannes, France.
            </p>
            
            <p className={`text-sm ${theme.textSecondary} font-mono mb-4 animate-typewriter overflow-hidden opacity-0`}
               style={{animation: 'typing 3.5s steps(60, end) forwards 1s, fadeIn 0.5s forwards 1s'}}>
              You must master French language and cultural protocols to blend in seamlessly with the local population.
            </p>
          </div>
          
          <p className={`text-sm ${theme.textSecondary} font-mono mb-4`}>
            PRIMARY OBJECTIVE: Establish a cover identity by learning basic French conversation skills. You will need to navigate social situations without raising suspicion.
          </p>
          
          <div className={`border-t ${theme.borderSecondary} pt-4`}>
            <h4 className={`font-mono ${theme.text} text-sm mb-3`}>MISSION PARAMETERS:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className={`w-2 h-2 ${darkMode ? 'bg-red-700' : 'bg-red-500'} rounded-full mr-2`}></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Complete basic greeting protocols</span>
              </li>
              <li className="flex items-center">
                <div className={`w-2 h-2 ${darkMode ? 'bg-red-700' : 'bg-red-500'} rounded-full mr-2`}></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Master introduction phrases</span>
              </li>
              <li className="flex items-center">
                <div className={`w-2 h-2 ${darkMode ? 'bg-red-700' : 'bg-red-500'} rounded-full mr-2`}></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Develop sufficient vocabulary for casual conversations</span>
              </li>
              <li className="flex items-center">
                <div className={`w-2 h-2 ${darkMode ? 'bg-red-700' : 'bg-red-500'} rounded-full mr-2`}></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Understand basic cultural customs to avoid detection</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Training Modules Section */}
        <div className="space-y-3 mb-6">
          <h4 className={`font-mono ${theme.text} text-sm mb-2 flex items-center`}>
            <span>AVAILABLE TRAINING MODULES</span>
            <div className={`ml-2 h-px ${darkMode ? 'bg-red-900' : 'bg-red-300'} flex-grow`}></div>
          </h4>
          
          {/* Completed Module */}
          <div className={`${theme.cardBg} border ${theme.border} rounded p-4 group hover:bg-gray-800 transition-colors duration-300 cursor-pointer`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}>
                  <span className="text-xl">1</span>
                </div>
                <div>
                  <h4 className={`font-mono ${theme.text} text-sm`}>BASIC GREETINGS</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-24 bg-gray-800 h-1 rounded-full mr-2 overflow-hidden">
                      <div className={`${darkMode ? 'bg-green-700' : 'bg-green-500'} h-1 rounded-full w-full`}></div>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-green-500' : 'text-green-700'} font-mono`}>COMPLETED</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Play Button (appears on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-green-800' : 'bg-green-600'} flex items-center justify-center`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#10B981" : "#FFFFFF"} strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* In-Progress Module with Pulsing Indicator */}
          <div className={`${theme.cardBg} border ${theme.border} rounded p-4 group hover:bg-gray-800 transition-colors duration-300 cursor-pointer relative`}>
            {/* Glowing Indicator */}
            <div className="absolute -right-1 -top-1">
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-3 group-hover:scale-105 transition-transform`}>
                  <span className="text-xl">2</span>
                </div>
                <div>
                  <h4 className={`font-mono ${theme.text} text-sm`}>PERSONAL INTRODUCTIONS</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-24 bg-gray-800 h-1 rounded-full mr-2 overflow-hidden">
                      <div className={`${darkMode ? 'bg-yellow-700' : 'bg-yellow-500'} h-1 rounded-full w-1/2 animate-progress`}
                           style={{animation: 'progress 1.5s ease-in-out infinite alternate'}}>
                      </div>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-yellow-500' : 'text-yellow-700'} font-mono`}>IN PROGRESS</span>
                  </div>
                </div>
              </div>
              
              {/* Interactive Continue Button (appears on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-yellow-800' : 'bg-yellow-600'} flex items-center justify-center`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#FBBF24" : "#FFFFFF"} strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Locked Module with Security Effect */}
          <div className={`${theme.cardBg} border ${theme.borderSecondary} rounded p-4 opacity-60 group hover:opacity-70 transition-opacity cursor-pointer`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} border ${theme.borderSecondary} flex items-center justify-center mr-3`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#6B7280" : "#374151"} strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <h4 className={`font-mono ${theme.textTertiary} text-sm`}>CASUAL CONVERSATIONS</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-24 bg-gray-800 h-1 rounded-full mr-2">
                      <div className="bg-gray-800 h-1 rounded-full w-0"></div>
                    </div>
                    <span className={`text-xs ${theme.textTertiary} font-mono`}>SECURITY CLEARANCE REQUIRED</span>
                  </div>
                </div>
              </div>
              
              {/* Lock Icon */}
              <div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#4B5563" : "#6B7280"} strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Handler Notes Section with Typed Effect */}
        <div className={`${theme.cardBg} border ${theme.borderSecondary} rounded-lg p-4 mb-6 relative`}>
          <div className={`absolute top-0 right-0 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'} px-2 py-1 rounded-bl-lg`}>
            <span className={`text-xs font-mono ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>HANDLER NOTES</span>
          </div>
          
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 mt-1">
              <img src="/api/placeholder/40/40" alt="Handler" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className={`text-xs font-mono ${darkMode ? 'text-blue-400' : 'text-blue-700'} mb-1`}>COMMANDANT RENARD</p>
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 ${darkMode ? 'bg-green-500' : 'bg-green-600'} rounded-full mr-2`}></span>
                <p className={`text-xs font-mono ${theme.textSecondary}`}>SECURE TRANSMISSION | 0800 HOURS</p>
              </div>
              <div className="mt-2 font-mono text-sm text-gray-400 typewriter-parent">
                <span className="animate-cursor-blink">|</span>
                <p className="animate-typing-slow">Dark Mallard, your initial progress is satisfactory but not exceptional. Remember, language is your primary weapon in this operation. Sharpen it.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <button className={`w-full ${theme.buttonBg} py-3 rounded-md font-mono text-white mb-6 relative overflow-hidden group`}>
          <span className="relative z-10">RESUME TRAINING MODULE 2</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        </button>
      </div>
    </div>
  );
}

export default MissionBriefingModal;