export default function TacticalMapVisualization({ darkMode = true }) {
  // Theme colors based on mode
  const theme = {
    background: darkMode ? 'bg-gray-950' : 'bg-gray-100',
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
    completed: darkMode ? 'bg-green-800/30' : 'bg-green-100',
    inProgress: darkMode ? 'bg-yellow-800/30' : 'bg-yellow-100',
    locked: darkMode ? 'bg-gray-800/30' : 'bg-gray-200'
  };

  return (
    <div className={`p-4 ${theme.background} min-h-screen`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-mono font-bold ${theme.text}`}>TACTICAL MAP</h2>
        <div className="flex space-x-2">
          <button className={`px-2 py-1 ${theme.accent} border ${theme.accentBorder} rounded text-xs font-mono ${theme.accentText}`}>
            ZOOM IN
          </button>
          <button className={`w-8 h-8 ${theme.cardBg} border ${theme.borderSecondary} rounded flex items-center justify-center`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.textSecondary}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className={`${theme.cardBg} border ${theme.border} rounded-lg overflow-hidden mb-6 relative`}>
        {/* Classified Map Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span className="font-mono text-6xl font-black tracking-tighter">CLASSIFIED</span>
        </div>
        
        {/* Map Header */}
        <div className={`p-4 border-b ${theme.borderSecondary} flex justify-between items-center`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-2`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={theme.accentText}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h3 className={`font-mono ${theme.text} text-base`}>CANNES, FRANCE</h3>
              <p className={`text-xs ${theme.textTertiary} font-mono`}>OPERATION ZONE</p>
            </div>
          </div>
          <div className={`px-2 py-1 ${theme.accent} border ${theme.accentBorder} rounded-md`}>
            <span className={`text-xs font-mono ${theme.accentText}`}>SECURITY LVL.07</span>
          </div>
        </div>
        
        {/* Tactical Map Content */}
        <div className="relative h-96 bg-gray-950 p-6">
          {/* Grid Lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, ${darkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px), 
                              linear-gradient(to bottom, ${darkMode ? '#374151' : '#E5E7EB'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.2
          }}></div>

          {/* Radial Grid Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-md max-h-md relative">
              <div className="absolute inset-0 rounded-full border border-gray-800 opacity-20 scale-[0.3] transform-origin-center"></div>
              <div className="absolute inset-0 rounded-full border border-gray-800 opacity-20 scale-[0.5] transform-origin-center"></div>
              <div className="absolute inset-0 rounded-full border border-gray-800 opacity-20 scale-[0.7] transform-origin-center"></div>
              <div className="absolute inset-0 rounded-full border border-gray-800 opacity-20 transform-origin-center"></div>
            </div>
          </div>
          
          {/* Map Locations - COMPLETED ZONE */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`relative group cursor-pointer`}>
              {/* Pulsing Indicator */}
              <div className="absolute inset-0 bg-green-500 rounded-full opacity-30 animate-ping-slow"></div>
              
              {/* Location Icon */}
              <div className={`w-12 h-12 rounded-full ${theme.completed} border border-green-700 flex items-center justify-center z-10 relative`}>
                <span className="text-lg">🏠</span>
              </div>
              
              {/* Location Name (appears on hover) */}
              <div className="absolute left-0 top-14 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`px-2 py-1 ${theme.cardBg} border border-green-700 rounded text-xs font-mono whitespace-nowrap`}>
                  <span className="text-green-500">ARRIVAL POINT</span>
                </div>
              </div>
              
              {/* Completion Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-700 border border-green-500 flex items-center justify-center z-20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Map Locations - IN PROGRESS ZONE */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`relative group cursor-pointer`}>
              {/* Pulsing Indicator */}
              <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-30 animate-ping-slow"></div>
              
              {/* Location Icon */}
              <div className={`w-14 h-14 rounded-full ${theme.inProgress} border border-yellow-700 flex items-center justify-center z-10 relative`}>
                <span className="text-lg">☕</span>
              </div>
              
              {/* Location Name (appears on hover) */}
              <div className="absolute left-0 top-16 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`px-2 py-1 ${theme.cardBg} border border-yellow-700 rounded text-xs font-mono whitespace-nowrap`}>
                  <span className="text-yellow-500">CAFÉ DISTRICT</span>
                </div>
              </div>
              
              {/* Progress Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-700 border border-yellow-500 flex items-center justify-center z-20">
                <span className="text-[10px] text-white font-bold">50%</span>
              </div>
            </div>
          </div>
          
          {/* Map Locations - LOCKED ZONE */}
          <div className="absolute top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`relative group cursor-pointer`}>
              {/* Location Icon (grey/locked) */}
              <div className={`w-16 h-16 rounded-full ${theme.locked} border border-gray-700 flex items-center justify-center z-10 relative opacity-60`}>
                <span className="text-lg opacity-70">🏛️</span>
              </div>
              
              {/* Location Name (appears on hover) */}
              <div className="absolute left-0 top-18 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`px-2 py-1 ${theme.cardBg} border border-gray-700 rounded text-xs font-mono whitespace-nowrap`}>
                  <span className="text-gray-500">HOTEL DISTRICT</span>
                </div>
              </div>
              
              {/* Lock Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center z-20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Connecting Paths between locations */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {/* Completed Path: Arrival to Café */}
            <path d="M 100 100 L 200 133" 
                  stroke={darkMode ? "#10B981" : "#059669"} 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  fill="none" />
                  
            {/* In Progress Path: Café to Hotel */}
            <path d="M 200 133 L 267 267" 
                  stroke={darkMode ? "#FBBF24" : "#D97706"} 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  strokeDashoffset="0"
                  fill="none">
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
            </path>
            
            {/* Locked Path: Hotel to Villa */}
            <path d="M 267 267 L 300 300" 
                  stroke={darkMode ? "#4B5563" : "#9CA3AF"} 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  fill="none"
                  opacity="0.3" />
          </svg>
          
          {/* Current Position Marker */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-[150%] z-30">
            <div className="relative">
              {/* Pulsing Circle */}
              <div className={`absolute -inset-4 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} opacity-10 animate-ping`}></div>
              
              {/* Position Marker */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative">
                <circle cx="12" cy="12" r="8" fill={darkMode ? "#991B1B" : "#EF4444"} />
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 2L14 7L12 12L10 7L12 2Z" fill={darkMode ? "#991B1B" : "#EF4444"} />
                <path d="M12 22L14 17L12 12L10 17L12 22Z" fill={darkMode ? "#991B1B" : "#EF4444"} />
                <path d="M2 12L7 14L12 12L7 10L2 12Z" fill={darkMode ? "#991B1B" : "#EF4444"} />
                <path d="M22 12L17 14L12 12L17 10L22 12Z" fill={darkMode ? "#991B1B" : "#EF4444"} />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Map Legend & Info */}
        <div className={`p-4 border-t ${theme.borderSecondary}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className={`font-mono ${theme.text} text-sm mb-2`}>LOCATION STATUS</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-700 mr-2"></div>
                  <span className={`text-xs ${theme.textSecondary} font-mono`}>SECURED AREA</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-700 mr-2"></div>
                  <span className={`text-xs ${theme.textSecondary} font-mono`}>ACTIVE OPERATION</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-700 mr-2"></div>
                  <span className={`text-xs ${theme.textSecondary} font-mono`}>RESTRICTED ACCESS</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className={`font-mono ${theme.text} text-sm mb-2`}>OPERATIONAL DATA</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className={theme.textTertiary}>AREAS UNLOCKED:</span>
                  <span className={theme.textSecondary}>2/4</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textTertiary}>MISSION COVERAGE:</span>
                  <span className={theme.textSecondary}>35%</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textTertiary}>INTEL GATHERED:</span>
                  <span className={theme.textSecondary}>12 FILES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Intelligence Preview */}
      <h3 className={`${theme.accentText} text-xs font-bold font-mono tracking-wider mb-2 flex items-center`}>
        <span>ACTIVE LOCATION INTELLIGENCE</span>
        <div className={`ml-2 h-px ${theme.accent} flex-grow`}></div>
        <div className={`px-2 py-0.5 ${theme.accent} border ${theme.accentBorder} rounded-sm ml-2`}>
          <span className={`text-xs ${theme.accentText} font-mono`}>CAFÉ DISTRICT</span>
        </div>
      </h3>
      
      <div className={`${theme.cardBg} border ${theme.border} rounded-lg p-4 mb-6`}>
        <div className="flex mb-4">
          <div className={`w-12 h-12 rounded-lg ${theme.accent} border ${theme.accentBorder} flex items-center justify-center mr-3`}>
            <span className="text-xl">☕</span>
          </div>
          <div>
            <h4 className={`font-mono ${theme.text} text-base`}>CAFÉ DISTRICT</h4>
            <p className={`text-xs ${theme.textSecondary} font-mono`}>CULTURAL HUB • REQUIRES BASIC PHRASES</p>
          </div>
        </div>
        
        <p className={`text-sm ${theme.textSecondary} font-mono mb-4`}>
          Primary location for initial language immersion. Local cafés provide optimal cover for practicing basic vocabulary and gathering cultural intelligence.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg`}>
            <div className="flex items-center mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#D1D5DB" : "#4B5563"} strokeWidth="2" className="mr-1">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className={`text-xs font-mono ${theme.text} font-bold`}>LANGUAGE ESSENTIALS</span>
            </div>
            <ul className="space-y-1">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Basic greetings</span>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Ordering phrases</span>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Small talk vocabulary</span>
              </li>
            </ul>
          </div>
          
          <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-lg`}>
            <div className="flex items-center mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={darkMode ? "#D1D5DB" : "#4B5563"} strokeWidth="2" className="mr-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className={`text-xs font-mono ${theme.text} font-bold`}>TACTICAL ADVANTAGES</span>
            </div>
            <ul className="space-y-1">
              <li className="flex items-center">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Low security presence</span>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Native speaker exposure</span>
              </li>
              <li className="flex items-center">
                <div className="w-1 h-1 bg-yellow-500 rounded-full mr-1"></div>
                <span className={`text-xs ${theme.textSecondary} font-mono`}>Cultural immersion</span>
              </li>
            </ul>
          </div>
        </div>
        
        <button className={`w-full ${theme.buttonBg} py-2 rounded-md font-mono text-white text-sm`}>
          DEPLOY TO LOCATION
        </button>
      </div>
    </div>
  );
}

