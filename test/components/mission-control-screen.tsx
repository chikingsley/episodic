import { useState } from 'react';

const MissionControlScreen = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  
  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mr-2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1 className="text-xl font-mono font-bold tracking-tight text-gray-200">MISSION CONTROL</h1>
        </div>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded-md">
            <span className="text-xs text-red-500 font-mono">CLEARANCE LVL.07</span>
          </div>
        </div>
      </div>

      {/* Mission Control Tabs */}
      <div className="flex border-b border-red-900 mb-6 overflow-x-auto hide-scrollbar">
        <button
          className={`py-3 px-4 font-mono text-sm whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'text-red-500 border-b-2 border-red-700 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('timeline')}
        >
          MISSION TIMELINE
        </button>
        <button
          className={`py-3 px-4 font-mono text-sm whitespace-nowrap ${
            activeTab === 'dossier'
              ? 'text-red-500 border-b-2 border-red-700 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('dossier')}
        >
          FIELD DOSSIER
        </button>
        <button
          className={`py-3 px-4 font-mono text-sm whitespace-nowrap ${
            activeTab === 'map'
              ? 'text-red-500 border-b-2 border-red-700 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('map')}
        >
          TACTICAL MAP
        </button>
        <button
          className={`py-3 px-4 font-mono text-sm whitespace-nowrap ${
            activeTab === 'network'
              ? 'text-red-500 border-b-2 border-red-700 font-semibold'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('network')}
        >
          ASSET NETWORK
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'timeline' && <MissionTimeline />}
      {activeTab === 'dossier' && <FieldDossier />}
      {activeTab === 'map' && <TacticalMap />}
      {activeTab === 'network' && <AssetNetwork />}

      {/* Bottom Navigation */}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span className="text-xs text-red-500 font-mono">MISSION CONTROL</span>
          </div>
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs text-gray-600 font-mono">AGENT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mission Timeline Component
const MissionTimeline = () => {
  return (
    <div className="mb-20">
      {/* Current Episode Header */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
            <span className="text-2xl">1</span>
          </div>
          <div>
            <p className="text-xs font-mono text-red-500">CURRENT OPERATION</p>
            <h3 className="font-mono text-gray-200 text-lg">EPISODE 1: INITIAL INFILTRATION</h3>
            <div className="w-48 bg-gray-800 h-1 rounded-full mt-1">
              <div className="bg-red-700 h-1 rounded-full w-2/5"></div>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-mono text-gray-400">PROGRESS</p>
            <p className="text-lg font-mono text-red-500">40%</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 mb-10">
        {/* Vertical Line */}
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-red-900/30"></div>
        
        {/* Mission 1.1 - Completed */}
        <div className="mb-8 relative">
          <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-green-900 border-2 border-green-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="bg-gray-900 border border-green-900 rounded p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-gray-200 text-sm">MISSION 1.1: BASIC GREETINGS</h4>
              <span className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">COMPLETED</span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">Master basic French greetings to establish initial contact with local assets.</p>
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                <span className="text-xs text-gray-500 font-mono">100 XP</span>
              </div>
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-xs text-gray-500 font-mono">APR 13, 2025</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mission 1.2 - In Progress */}
        <div className="mb-8 relative">
          <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-yellow-900 border-2 border-yellow-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-yellow-500">
              <path d="M12 2v20"></path>
              <path d="M17 5H7.5a2.5 2.5 0 0 0 0 5h9a2.5 2.5 0 0 1 0 5H7"></path>
            </svg>
          </div>
          <div className="bg-gray-900 border border-yellow-900 rounded p-4">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-gray-200 text-sm">MISSION 1.2: PERSONAL INTRODUCTIONS</h4>
              <span className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">IN PROGRESS</span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-1">Learn how to introduce yourself and establish your cover identity in French.</p>
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                <span className="text-xs text-gray-500 font-mono">150 XP</span>
              </div>
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-xs text-gray-500 font-mono">IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission 1.3 - Locked */}
        <div className="mb-8 relative">
          <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-gray-400 text-sm">MISSION 1.3: CASUAL CONVERSATIONS</h4>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">LOCKED</span>
            </div>
            <p className="text-xs text-gray-600 font-mono mt-1">Master café discussions and public space conversations to gather intelligence.</p>
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                <span className="text-xs text-gray-600 font-mono">200 XP</span>
              </div>
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-xs text-gray-600 font-mono">LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission 1.4 - Locked */}
        <div className="mb-8 relative">
          <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-gray-400 text-sm">MISSION 1.4: NUMBERS & INFORMATION</h4>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">LOCKED</span>
            </div>
            <p className="text-xs text-gray-600 font-mono mt-1">Learn numbers, dates, and essential information exchange protocols.</p>
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                <span className="text-xs text-gray-600 font-mono">150 XP</span>
              </div>
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-xs text-gray-600 font-mono">LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission 1.5 - Locked (Final Assessment) */}
        <div className="mb-8 relative">
          <div className="absolute left-[-25px] top-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
            <div className="flex justify-between items-center">
              <h4 className="font-mono text-gray-400 text-sm">MISSION 1.5: FIRST SOCIAL GATHERING</h4>
              <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">FINAL ASSESSMENT</span>
            </div>
            <p className="text-xs text-gray-600 font-mono mt-1">Complete assessment mission testing your ability to navigate a social event in French.</p>
            <div className="mt-2 flex justify-between">
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
                <span className="text-xs text-gray-600 font-mono">300 XP</span>
              </div>
              <div className="flex items-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-xs text-gray-600 font-mono">LOCKED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Future Episodes Preview */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">FUTURE OPERATIONS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>

      <div className="space-y-3 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
              <span className="text-xl text-gray-600">2</span>
            </div>
            <div>
              <h4 className="font-mono text-gray-400 text-sm">EPISODE 2: ESTABLISHING PRESENCE</h4>
              <p className="text-xs text-gray-600 font-mono mt-1">Shopping, transportation, restaurants, and communication skills.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-60">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
              <span className="text-xl text-gray-600">3</span>
            </div>
            <div>
              <h4 className="font-mono text-gray-400 text-sm">EPISODE 3: DEEP COVER OPERATIONS</h4>
              <p className="text-xs text-gray-600 font-mono mt-1">Business French, cultural references, complex social situations.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
              <span className="text-xl text-gray-600">4</span>
            </div>
            <div>
              <h4 className="font-mono text-gray-400 text-sm">EPISODE 4: TARGET ACQUISITION</h4>
              <p className="text-xs text-gray-600 font-mono mt-1">Specialized terminology, negotiation, subtext comprehension.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-40">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
              <span className="text-xl text-gray-600">5</span>
            </div>
            <div>
              <h4 className="font-mono text-gray-400 text-sm">EPISODE 5: MISSION CRITICAL</h4>
              <p className="text-xs text-gray-600 font-mono mt-1">Advanced cultural nuances, debate, regional variations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field Dossier Component (Language Profile)
const FieldDossier = () => {
  return (
    <div className="mb-20">
      {/* Skill Assessment */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <h3 className="font-mono text-gray-200 text-base mb-3">AGENT SKILL ASSESSMENT</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">LISTENING</span>
              <span className="text-xs font-mono text-red-500">BASIC+</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-3/10"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">SPEAKING</span>
              <span className="text-xs font-mono text-red-500">BASIC</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-2/10"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">READING</span>
              <span className="text-xs font-mono text-red-500">BASIC+</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-3/10"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">WRITING</span>
              <span className="text-xs font-mono text-red-500">BASIC</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-2/10"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">VOCABULARY</span>
              <span className="text-xs font-mono text-red-500">BASIC+</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-3/10"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-gray-400">GRAMMAR</span>
              <span className="text-xs font-mono text-red-500">BASIC</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full">
              <div className="bg-red-700 h-1 rounded-full w-2/10"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vocabulary Sections */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">ACQUIRED VOCABULARY</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
        <span className="text-xs text-gray-600 font-mono">12 WORDS</span>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-4">
          <h4 className="font-mono text-gray-300 text-sm mb-3">ESSENTIAL PHRASES</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">BONJOUR</p>
                <p className="text-xs text-gray-500 font-mono">HELLO</p>
              </div>
              <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">
                MASTERED
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">AU REVOIR</p>
                <p className="text-xs text-gray-500 font-mono">GOODBYE</p>
              </div>
              <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">
                MASTERED
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">MERCI</p>
                <p className="text-xs text-gray-500 font-mono">THANK YOU</p>
              </div>
              <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
                LEARNING
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300 font-mono">S'IL VOUS PLAÎT</p>
                <p className="text-xs text-gray-500 font-mono">PLEASE</p>
              </div>
              <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
                LEARNING
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
          <div className="flex justify-between mb-3">
            <h4 className="font-mono text-gray-300 text-sm">PERSONAL INFORMATION</h4>
            <span className="text-xs text-gray-500 font-mono">IN PROGRESS</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">JE M'APPELLE</p>
                <p className="text-xs text-gray-500 font-mono">MY NAME IS</p>
              </div>
              <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">
                MASTERED
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">J'HABITE À</p>
                <p className="text-xs text-gray-500 font-mono">I LIVE IN</p>
              </div>
              <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
                LEARNING
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-red-900/20 pb-1">
              <div>
                <p className="text-sm text-gray-300 font-mono">JE SUIS</p>
                <p className="text-xs text-gray-500 font-mono">I AM</p>
              </div>
              <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
                LEARNING
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300 font-mono">ENCHANTÉ</p>
                <p className="text-xs text-gray-500 font-mono">PLEASED TO MEET YOU</p>
              </div>
              <div className="px-2 py-0.5 bg-red-900/30 border border-red-800 rounded text-xs font-mono text-red-500">
                NEW
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grammar Knowledge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">GRAMMAR PROTOCOLS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="space-y-3 mb-10">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between">
            <h4 className="font-mono text-gray-300 text-sm">BASIC SENTENCE STRUCTURE</h4>
            <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
              LEVEL 1
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono mt-1">Subject + Verb + Object structure for basic French sentences.</p>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between">
            <h4 className="font-mono text-gray-300 text-sm">GENDER AGREEMENT</h4>
            <div className="px-2 py-0.5 bg-red-900/30 border border-red-800 rounded text-xs font-mono text-red-500">
              BASIC
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono mt-1">Masculine and feminine nouns and corresponding articles.</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
          <div className="flex justify-between">
            <h4 className="font-mono text-gray-400 text-sm">PRESENT TENSE VERBS</h4>
            <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">
              LOCKED
            </div>
          </div>
          <p className="text-xs text-gray-600 font-mono mt-1">Regular and irregular verb conjugations in present tense.</p>
        </div>
      </div>
    </div>
  );
};

// Tactical Map Component
const TacticalMap = () => {
  return (
    <div className="mb-20">
      <div className="bg-gray-900 border border-red-900 rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-red-900/30">
          <h3 className="font-mono text-gray-200 text-base mb-2">OPERATION ZONE: CANNES, FRANCE</h3>
          <p className="text-xs text-gray-500 font-mono">Your infiltration progress map showing language skill coverage areas.</p>
        </div>
        
        <div className="relative h-64 bg-gray-950 p-6">
          {/* This would be an actual map in a real app, using a stylized representation here */}
          <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-red-900/20 border border-red-800 flex items-center justify-center animate-pulse">
            <span className="text-xs font-mono text-red-500">ARRIVAL</span>
          </div>
          
          <div className="absolute top-20 left-28 w-20 h-20 rounded-full bg-red-900/10 border border-red-800 flex items-center justify-center">
            <span className="text-xs font-mono text-red-500">CAFÉ</span>
          </div>
          
          <div className="absolute top-36 left-44 w-24 h-24 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center opacity-50">
            <span className="text-xs font-mono text-gray-500">HOTEL</span>
          </div>
          
          <div className="absolute top-12 right-12 w-32 h-32 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center opacity-30">
            <span className="text-xs font-mono text-gray-500">CITY CENTER</span>
          </div>
          
          {/* Map path showing progression */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <path d="M70 70 L 120 130" stroke="#991b1b" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <path d="M120 130 L 180 180" stroke="#991b1b" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.5" />
            <path d="M180 180 L 250 100" stroke="#991b1b" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.2" />
          </svg>
        </div>
        
        <div className="p-4 border-t border-red-900/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400">ZONES UNLOCKED:</span>
            <span className="text-xs font-mono text-red-500 ml-2">2/10</span>
          </div>
          <button className="px-4 py-1 bg-red-900/30 border border-red-800 rounded text-xs font-mono text-red-500">
            EXPAND VIEW
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">LOCATION INTELLIGENCE</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <h4 className="font-mono text-gray-300 text-sm">CAFÉ LOCATIONS</h4>
                <p className="text-xs text-gray-500 font-mono mt-1">Common phrases and vocabulary for café interactions. Essential for establishing initial cover.</p>
              </div>
            </div>
            <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">
              UNLOCKED
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                <span className="text-xl">🚶</span>
              </div>
              <div>
                <h4 className="font-mono text-gray-300 text-sm">STREETS & DIRECTIONS</h4>
                <p className="text-xs text-gray-500 font-mono mt-1">Vocabulary for navigation and asking for directions in urban environments.</p>
              </div>
            </div>
            <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
              IN PROGRESS
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded p-4 opacity-70">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
                <span className="text-xl">🏨</span>
              </div>
              <div>
                <h4 className="font-mono text-gray-400 text-sm">HOTEL & ACCOMMODATION</h4>
                <p className="text-xs text-gray-600 font-mono mt-1">Vocabulary for hotel check-in, services, and room-related requests.</p>
              </div>
            </div>
            <div className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-500">
              LOCKED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Asset Network Component
const AssetNetwork = () => {
  return (
    <div className="mb-20">
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <h3 className="font-mono text-gray-200 text-base mb-3">LANGUAGE SKILL NETWORK</h3>
        <p className="text-xs text-gray-500 font-mono mb-4">Interactive visualization of your language skill connections and dependencies.</p>
        
        {/* This would be an interactive network visualization in a real app */}
        <div className="relative h-64 bg-gray-950 rounded border border-gray-800 p-3">
          {/* Main skill nodes */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center">
            <span className="text-xs font-mono text-red-500">CORE</span>
          </div>
          
          {/* Secondary nodes with connecting lines */}
          <div className="absolute top-32 left-1/4 transform -translate-x-1/2 w-12 h-12 rounded-full bg-yellow-900/30 border border-yellow-800 flex items-center justify-center">
            <span className="text-xs font-mono text-yellow-500">VOCAB</span>
          </div>
          
          <div className="absolute top-32 right-1/4 transform translate-x-1/2 w-12 h-12 rounded-full bg-blue-900/30 border border-blue-800 flex items-center justify-center">
            <span className="text-xs font-mono text-blue-500">GRAMMAR</span>
          </div>
          
          <div className="absolute bottom-8 left-1/3 transform -translate-x-1/2 w-12 h-12 rounded-full bg-green-900/30 border border-green-800 flex items-center justify-center">
            <span className="text-xs font-mono text-green-500">LISTEN</span>
          </div>
          
          <div className="absolute bottom-8 right-1/3 transform translate-x-1/2 w-12 h-12 rounded-full bg-purple-900/30 border border-purple-800 flex items-center justify-center">
            <span className="text-xs font-mono text-purple-500">SPEAK</span>
          </div>
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            {/* Core to Vocabulary */}
            <line x1="200" y1="78" x2="100" y2="150" stroke="#b45309" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* Core to Grammar */}
            <line x1="200" y1="78" x2="300" y2="150" stroke="#1e40af" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* Vocabulary to Listening */}
            <line x1="100" y1="150" x2="133" y2="230" stroke="#065f46" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* Grammar to Speaking */}
            <line x1="300" y1="150" x2="267" y2="230" stroke="#7e22ce" strokeWidth="2" strokeDasharray="4,4" />
            
            {/* Grammar to Listening */}
            <line x1="300" y1="150" x2="133" y2="230" stroke="#065f46" strokeWidth="2" strokeDasharray="4,4" opacity="0.3" />
            
            {/* Vocabulary to Speaking */}
            <line x1="100" y1="150" x2="267" y2="230" stroke="#7e22ce" strokeWidth="2" strokeDasharray="4,4" opacity="0.3" />
          </svg>
          
          {/* Tertiary small nodes */}
          <div className="absolute top-20 left-1/3 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
            <span className="text-xs font-mono text-gray-500">A1</span>
          </div>
          
          <div className="absolute top-24 right-1/3 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
            <span className="text-xs font-mono text-gray-500">A2</span>
          </div>
          
          <div className="absolute bottom-20 left-1/2 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center opacity-50">
            <span className="text-xs font-mono text-gray-500">B1</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">SKILL CONNECTIONS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-mono text-gray-300 text-sm">VOCAB → LISTENING</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">Your vocabulary knowledge enhances listening comprehension by 25%.</p>
            </div>
            <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded text-xs font-mono text-green-500">
              SYNERGY +25%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-mono text-gray-300 text-sm">GRAMMAR → SPEAKING</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">Your grammar knowledge enhances speaking ability by 15%.</p>
            </div>
            <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
              SYNERGY +15%
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-mono text-gray-300 text-sm">VOCAB → SPEAKING</h4>
              <p className="text-xs text-gray-500 font-mono mt-1">Your vocabulary knowledge enhances speaking ability by 20%.</p>
            </div>
            <div className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-800 rounded text-xs font-mono text-yellow-500">
              SYNERGY +20%
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">RECOMMENDED FOCUS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-900/40 border border-blue-800 flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <h4 className="font-mono text-gray-300 text-sm">PRIORITY: BASIC GRAMMAR</h4>
            <p className="text-xs text-gray-500 font-mono mt-1">Focus on grammar to maximize current mission effectiveness.</p>
          </div>
        </div>
        
        <button className="w-full bg-blue-900/30 border border-blue-800 rounded py-2 font-mono text-xs text-blue-500">
          INITIATE GRAMMAR TRAINING
        </button>
      </div>
    </div>
  );
};

export default MissionControlScreen;