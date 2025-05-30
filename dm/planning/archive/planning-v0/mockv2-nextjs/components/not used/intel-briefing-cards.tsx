export default function IntelBriefingCards({ darkMode = true }) {
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
    blueBg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100',
    blueBorder: darkMode ? 'border-blue-800' : 'border-blue-300',
    blueText: darkMode ? 'text-blue-500' : 'text-blue-700',
    yellowBg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
    yellowBorder: darkMode ? 'border-yellow-800' : 'border-yellow-300',
    yellowText: darkMode ? 'text-yellow-500' : 'text-yellow-700',
    greenBg: darkMode ? 'bg-green-900/30' : 'bg-green-100',
    greenBorder: darkMode ? 'border-green-800' : 'border-green-300',
    greenText: darkMode ? 'text-green-500' : 'text-green-700',
  };

  return (
    <div className={`${theme.background} p-4 min-h-screen`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-mono font-bold ${theme.text}`}>FIELD INTELLIGENCE</h2>
        <div className="flex space-x-2">
          <button className={`px-2 py-1 ${theme.blueBg} border ${theme.blueBorder} rounded text-xs font-mono ${theme.blueText}`}>
            REFRESH
          </button>
          <div className={`px-2 py-1 ${theme.accent} border ${theme.accentBorder} rounded flex items-center`}>
            <span className={`text-xs font-mono ${theme.accentText}`}>UPDATED: 0800</span>
          </div>
        </div>
      </div>
      
      {/* Intel Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`${theme.accentText} text-xs font-bold font-mono tracking-wider`}>PRIORITY BRIEFINGS</h3>
        <div className={`h-px ${darkMode ? 'bg-red-900' : 'bg-red-300'} flex-grow mx-2`}></div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className={`text-xs ${theme.textTertiary} font-mono`}>LIVE</span>
        </div>
      </div>
      
      {/* Progress Report Card - Animated Hover Effects */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-lg p-4 mb-4 group hover:border-blue-500 hover:shadow-md hover:shadow-blue-900/10 cursor-pointer transition-all duration-300 relative overflow-hidden`}>
        {/* Animated Reveal Bar - Appears on Hover */}
        <div className="absolute inset-0 w-1 bg-blue-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        
        {/* Top-right Classification Badge */}
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-900/50 text-xs font-mono text-blue-400 rounded-bl-md">
          PERFORMANCE ANALYSIS
        </div>
        
        <div className="flex justify-between items-start pl-3">
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-lg ${theme.blueBg} border ${theme.blueBorder} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#3B82F6" : "#2563EB"} strokeWidth="2" className="group-hover:stroke-blue-400 transition-colors">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div>
              <h4 className={`font-mono ${theme.text} text-sm group-hover:text-blue-500 transition-colors`}>WEEKLY PROGRESS REPORT</h4>
              
              {/* Expandable Content - Reveals on Hover */}
              <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96">
                <div className="pt-2 pb-3">
                  <div className="flex space-x-2 mb-2">
                    <div className={`px-2 py-0.5 ${theme.blueBg} border ${theme.blueBorder} rounded text-xs font-mono ${theme.blueText}`}>
                      +15% XP
                    </div>
                    <div className={`px-2 py-0.5 ${theme.greenBg} border ${theme.greenBorder} rounded text-xs font-mono ${theme.greenText}`}>
                      STREAK: 1 DAY
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 mt-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-mono ${theme.textTertiary}`}>VOCABULARY ACQUISITION</span>
                        <span className={`font-mono ${theme.blueText}`}>+12 WORDS</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-1 bg-blue-700 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-mono ${theme.textTertiary}`}>PRONUNCIATION ACCURACY</span>
                        <span className={`font-mono ${theme.blueText}`}>68%</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-1 bg-blue-700 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-mono ${theme.textTertiary}`}>GRAMMAR PROFICIENCY</span>
                        <span className={`font-mono ${theme.blueText}`}>45%</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-1 bg-blue-700 rounded-full w-2/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Text - Hides on Hover */}
              <div className="block group-hover:hidden">
                <p className={`text-xs ${theme.textTertiary} font-mono mt-1`}>Your performance is 15% above last week. Continue the momentum to reach optimal language acquisition.</p>
              </div>
            </div>
          </div>
          
          {/* Transition Arrow - Rotates on Hover */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
               className={`${theme.textTertiary} group-hover:text-blue-500 transform group-hover:rotate-90 transition-all duration-300`}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Cultural Briefing Card - Interactive Badge Notification */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-lg p-4 mb-4 group hover:border-red-500 cursor-pointer transition-all duration-300 relative overflow-hidden`}>
        {/* New indicator badge that scales on hover */}
        <div className="absolute -top-1 -right-1 z-10">
          <div className={`bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300`}>
            NEW
          </div>
        </div>
      
        {/* Animated Reveal Bar */}
        <div className="absolute inset-0 w-1 bg-red-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        
        <div className="flex justify-between items-start pl-3">
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              <span className="text-xl transform group-hover:scale-125 transition-transform">🇫🇷</span>
            </div>
            <div>
              <h4 className={`font-mono ${theme.text} text-sm group-hover:${theme.accentText} transition-colors`}>CULTURAL BRIEFING</h4>
              
              {/* Expandable Content - Reveals on Hover */}
              <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96">
                <div className="pt-2 pb-1">
                  <div className="flex space-x-2 mb-2">
                    <div className={`px-2 py-0.5 ${theme.accent} border ${theme.accentBorder} rounded text-xs font-mono ${theme.accentText}`}>
                      CRITICAL
                    </div>
                    <div className={`px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-400`}>
                      SOCIAL PROTOCOL
                    </div>
                  </div>
                  
                  <div className={`mt-3 text-sm font-mono ${theme.textSecondary}`}>
                    <p className="mb-2">French formal greetings are essential for first encounters:</p>
                    <ul className="space-y-1 list-disc pl-5 text-xs">
                      <li>Use &quot;Bonjour Madame/Monsieur&quot; when meeting someone new</li>
                      <li>Handshakes are common and expected in business settings</li>
                      <li>&quot;La bise&quot; (cheek kissing) is for friends and family only</li>
                      <li>Always use formal &quot;vous&quot; form until invited to use informal &quot;tu&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Preview Text - Hides on Hover */}
              <div className="block group-hover:hidden">
                <p className={`text-xs ${theme.textTertiary} font-mono mt-1`}>Understanding French etiquette is critical for successful field operations. Review the latest cultural intelligence.</p>
              </div>
            </div>
          </div>
          
          {/* Transition Arrow with Animation */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
               className={`${theme.textTertiary} group-hover:${theme.accentText} transform group-hover:rotate-90 transition-all duration-300`}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Tactical Map Update Card - Fan-out Files Effect */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-lg p-4 mb-4 group hover:border-green-500 cursor-pointer transition-all duration-300 relative overflow-hidden`}>
        {/* Animated Reveal Bar */}
        <div className="absolute inset-0 w-1 bg-green-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
        
        <div className="flex justify-between items-start pl-3">
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-lg ${theme.greenBg} border ${theme.greenBorder} flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#10B981" : "#059669"} strokeWidth="2" className="group-hover:stroke-green-400 transition-colors">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h4 className={`font-mono ${theme.text} text-sm group-hover:${theme.greenText} transition-colors`}>TACTICAL MAP UPDATE</h4>
              
              {/* Expandable Content with Fanned Files Effect */}
              <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-96">
                <div className="pt-2 pb-1 relative">
                  {/* Miniature Map Preview */}
                  <div className="h-32 bg-gray-950 rounded-lg border border-gray-800 mb-2 relative overflow-hidden">
                    {/* Mini grid overlay */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, ${darkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px), 
                                        linear-gradient(to bottom, ${darkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px)`,
                      backgroundSize: '10px 10px',
                      opacity: 0.1
                    }}></div>
                    
                    {/* Location Markers */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-green-700"></div>
                    <div className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-yellow-700 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-gray-700 opacity-50"></div>
                    
                    {/* Path lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <path d="M 25 25 L 50 33" stroke="#10B981" strokeWidth="1" strokeDasharray="2,2" fill="none" />
                      <path d="M 50 33 L 75 75" stroke="#FBBF24" strokeWidth="1" strokeDasharray="2,2" fill="none" opacity="0.7" />
                    </svg>
                    
                    {/* Current position */}
                    <div className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  </div>
                  
                  <div className="flex space-x-2 mb-2">
                    <div className={`px-2 py-0.5 ${theme.greenBg} border ${theme.greenBorder} rounded text-xs font-mono ${theme.greenText}`}>
                      UPDATED
                    </div>
                    <div className={`px-2 py-0.5 ${theme.yellowBg} border ${theme.yellowBorder} rounded text-xs font-mono ${theme.yellowText}`}>
                      NEW LOCATION
                    </div>
                  </div>
                  
                  <p className={`mt-2 text-xs font-mono ${theme.textSecondary}`}>
                    The café district surveillance point is now active. Intelligence shows increased language learning opportunities in this area. Focus your operations here to maximize vocabulary acquisition.
                  </p>
                </div>
              </div>
              
              {/* Preview Text - Hides on Hover */}
              <div className="block group-hover:hidden">
                <p className={`text-xs ${theme.textTertiary} font-mono mt-1`}>New surveillance point identified near café district. Priority location for upcoming mission.</p>
              </div>
            </div>
          </div>
          
          {/* Transition Arrow */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
               className={`${theme.textTertiary} group-hover:${theme.greenText} transform group-hover:rotate-90 transition-all duration-300`}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Mission Alert - Special Notification Card */}
      <div className={`${theme.cardBg} border-l-4 border-yellow-600 border-t border-r border-b ${theme.borderSecondary} rounded-lg p-4 mb-8 relative overflow-hidden group hover:border-yellow-500 hover:shadow-lg transition-all`}> 
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 animate-bounce">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h4 className="font-mono text-yellow-600 text-base font-bold">MISSION ALERT</h4>
        </div>
        <p className={`text-sm ${theme.textSecondary} font-mono`}>
          Operation Cannes is entering a critical phase. All agents are required to review new intelligence and adjust tactics accordingly. Maintain heightened awareness in the café district.
        </p>
        <div className="mt-3 flex justify-end">
          <span className="text-xs font-mono bg-yellow-600/20 text-yellow-700 px-2 py-0.5 rounded">ALERT LEVEL: ELEVATED</span>
        </div>
      </div>

      {/* End of cards */}
    </div>
  );
}