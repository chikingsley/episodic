import { useState } from 'react';
import AgentAvatar from './agent-avatar';

// Main Profile Screen Component
const ProfileScreen = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      {/* Header with settings button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-red-500 font-mono">LVL.07</span>
        <button 
          className="w-8 h-8 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center"
          onClick={() => setShowSettingsModal(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Centered Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mb-3 shadow-lg shadow-red-900/20">
          <AgentAvatar seed="DARK MALLARD" size={96} />
        </div>
        <h2 className="text-xl font-bold font-mono tracking-tight">DARK MALLARD</h2>
        <p className="text-gray-500 text-xs">ROGUE SINCE APR 14, 2025</p>
        
        {/* Flag and language indicator */}
        <div className="mt-2 flex items-center bg-gray-900 border border-red-800 px-4 py-2 rounded">
          <span className="text-lg mr-2">🇫🇷</span>
          <span className="font-mono text-gray-300">FRANÇAIS</span>
          <span className="ml-2 text-xs bg-red-800 text-gray-200 px-2 py-0.5 rounded font-mono">REBEL</span>
        </div>
      </div>

      {/* Stats Cards - 2 per row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
          <div className="flex flex-col">
            <p className="text-xs text-red-500 font-mono mb-1">DESTRUCTION</p>
            <p className="text-3xl font-bold font-mono text-gray-200">1,990</p>
            <p className="text-xs text-gray-500 font-mono">XP TOTAL</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
          <div className="flex flex-col">
            <p className="text-xs text-red-500 font-mono mb-1">ARSENAL</p>
            <p className="text-3xl font-bold font-mono text-gray-200">12</p>
            <p className="text-xs text-gray-500 font-mono">WORDS LEARNED</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
          <div className="flex flex-col">
            <p className="text-xs text-red-500 font-mono mb-1">MISSIONS</p>
            <p className="text-3xl font-bold font-mono text-gray-200">6</p>
            <p className="text-xs text-gray-500 font-mono">COMPLETED</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-900/20 rounded-bl-full"></div>
          <div className="flex flex-col">
            <p className="text-xs text-red-500 font-mono mb-1">RAMPAGE</p>
            <p className="text-3xl font-bold font-mono text-gray-200">1</p>
            <p className="text-xs text-gray-500 font-mono">DAY STREAK</p>
          </div>
        </div>
      </div>

      {/* Journey Progress */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">MISSIONS LOG</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
        <span className="text-xs text-gray-600 font-mono">003</span>
      </div>
      
      <div className="bg-gray-900 border border-red-900 rounded p-4 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded bg-red-900/30 border border-red-800 flex items-center justify-center mr-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="flex-grow">
            <p className="font-mono text-sm text-gray-300">INFILTRATION: CANNES</p>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1">
              <div className="bg-red-700 h-1 rounded-full w-full"></div>
            </div>
          </div>
          <span className="ml-4 text-red-500 text-xs font-mono">100%</span>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded bg-red-900/30 border border-red-800 flex items-center justify-center mr-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="flex-grow">
            <p className="font-mono text-sm text-gray-300">INTEL: PARTY INVITE</p>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1">
              <div className="bg-red-700 h-1 rounded-full w-3/4"></div>
            </div>
          </div>
          <span className="ml-4 text-red-500 text-xs font-mono">75%</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div className="flex-grow">
            <p className="font-mono text-sm text-gray-600">OPERATION: DINNER SABOTAGE</p>
            <div className="w-full bg-gray-800 h-1 rounded-full mt-1">
              <div className="bg-gray-800 h-1 rounded-full w-0"></div>
            </div>
          </div>
          <span className="ml-4 text-gray-600 text-xs font-mono">0%</span>
        </div>
      </div>
      
      {/* Trophies */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">ACHIEVEMENTS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
        <span className="text-xs text-gray-600 font-mono">004</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <span className="text-2xl">💀</span>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">FATAL FLIRTATION</p>
            <p className="text-xs text-gray-600 text-center font-mono">First romantic takedown</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-b from-red-900 to-red-950 border border-red-700 flex items-center justify-center mb-2">
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">CHAOS AGENT</p>
            <p className="text-xs text-gray-600 text-center font-mono">Caused a public scene</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded p-4 opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-sm font-mono text-gray-500 text-center">INFILTRATOR</p>
            <p className="text-xs text-gray-600 text-center font-mono">Complete a covert dialogue</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded p-4 opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <p className="text-sm font-mono text-gray-500 text-center">DEEP COVER</p>
            <p className="text-xs text-gray-600 text-center font-mono">Survive a dinner operation</p>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          <div className="p-4 flex items-center border-b border-red-900">
            <button 
              className="mr-2"
              onClick={() => setShowSettingsModal(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold font-mono text-gray-200">OPERATIONS</h1>
            <span className="ml-auto text-red-500 font-mono">DONE</span>
          </div>
          
          <div className="flex-1 overflow-auto px-4 py-2">
            {/* Account Settings */}
            <div className="bg-gray-900 border border-red-900 rounded overflow-hidden mb-6">
              <div className="border-b border-red-900/30">
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-gray-300">SECURE CONNECTIONS</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div className="border-b border-red-900/30">
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-gray-300">STEALTH PROTOCOL</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-gray-300">AGENT STATUS</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Subscription */}
            <h3 className="text-red-500 uppercase text-xs font-bold font-mono tracking-wider mb-3">CLEARANCE</h3>
            <div className="bg-gray-900 border border-red-900 rounded overflow-hidden mb-6">
              <div className="p-4 flex items-center justify-between">
                <span className="font-mono text-gray-300">UPGRADE ACCESS</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
            
            {/* Support */}
            <h3 className="text-red-500 uppercase text-xs font-bold font-mono tracking-wider mb-3">INTELLIGENCE</h3>
            <div className="bg-gray-900 border border-red-900 rounded overflow-hidden mb-6">
              <div className="border-b border-red-900/30">
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-gray-300">COMMAND CENTER</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-mono text-gray-300">CONTACT HANDLER</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Log Out Button */}
            <div className="bg-red-900/30 border border-red-800 rounded overflow-hidden mb-6">
              <div className="p-4 flex items-center justify-center">
                <span className="font-mono text-red-500">GO DARK</span>
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex space-x-4 mb-2">
                <span className="text-red-600/70 text-sm font-mono">PROTOCOLS</span>
                <span className="text-red-600/70 text-sm font-mono">CLASSIFICATION</span>
              </div>
              <span className="text-red-600/70 text-sm font-mono">REDACTED FILES</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-red-900 p-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs text-gray-600 font-mono">HQ</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <span className="text-xs text-gray-600 font-mono">INTEL</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-xs text-gray-600 font-mono">RANKS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <AgentAvatar seed="DARK MALLARD" size={24} />
            </div>
            <span className="text-xs text-red-500 font-mono">AGENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;