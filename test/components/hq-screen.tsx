import { useState } from 'react';
import ClassifiedOverlay from './classified-overlay';
import ClearanceLevelModal from './clearance-level-modal';
import AgentAvatar from './agent-avatar';

const HQScreen = () => {
  const [showMissionBrief, setShowMissionBrief] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isModule3Unlocked, setIsModule3Unlocked] = useState(false);
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  
  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mr-2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h1 className="text-xl font-mono font-bold tracking-tight text-gray-200">HEADQUARTERS</h1>
        </div>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded-md">
            <span className="text-xs text-red-500 font-mono">DAY 1</span>
          </div>
          <button 
            className="w-8 h-8 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center cursor-pointer"
            onClick={() => setShowSettingsModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mr-3 shadow-lg shadow-red-900/20">
              <AgentAvatar seed="DARK MALLARD" size={48} />
            </div>
            <div>
              <span className="text-xs font-mono text-red-500">AGENT STATUS</span>
              <h3 className="font-mono text-gray-200 text-base">DARK MALLARD</h3>
              <div className="flex mt-1">
                <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded-sm mr-2">
                  <span className="text-xs text-green-500 font-mono">ACTIVE</span>
                </div>
                <div 
                  className="px-2 py-0.5 bg-red-900/30 border border-red-800 rounded-sm cursor-pointer hover:bg-red-900/50 transition-colors"
                  onClick={() => setShowClearanceModal(true)}
                >
                  <span className="text-xs text-red-500 font-mono">LVL.07</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs font-mono text-gray-400 mb-1">DAILY TARGET</div>
            <div className="w-16 h-16 rounded-full bg-gray-800 border-4 border-red-900/50 flex items-center justify-center relative">
              <svg viewBox="0 0 36 36" className="w-16 h-16 absolute">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="4"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#991b1b"
                  strokeWidth="4"
                  strokeDasharray="30, 100"
                />
              </svg>
              <span className="text-lg font-mono font-bold text-red-500">30%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-gray-500">STREAK: </span>
            <span className="text-gray-300">1 DAY</span>
          </div>
          <div>
            <span className="text-gray-500">XP TODAY: </span>
            <span className="text-gray-300">30/100</span>
          </div>
          <div>
            <span className="text-gray-500">TOTAL: </span>
            <span className="text-gray-300">1,990 XP</span>
          </div>
        </div>
      </div>

      {/* Main Mission Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900 rounded-lg overflow-hidden mb-6 relative">
        <div className="absolute top-0 right-0 bg-red-900/70 px-3 py-1 rounded-bl-lg">
          <span className="text-xs font-mono text-white">PRIORITY</span>
        </div>
        <div className="p-4">
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div>
              <h3 className="font-mono text-gray-200 text-lg">ACTIVE MISSION</h3>
              <p className="text-sm text-gray-400 font-mono">OPERATION: CANNES INFILTRATION</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 font-mono mb-4">
            Master basic French greetings to establish initial contact with local assets. Complete the daily training regimen to build language foundation.
          </p>
          
          <div className="flex items-center justify-between text-xs font-mono mb-3">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="text-gray-500">ESTIMATED TIME: </span>
              <span className="text-gray-300 ml-1">15 MIN</span>
            </div>
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-500">COMPLETION: </span>
              <span className="text-gray-300 ml-1">30%</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-800 h-1 rounded-full mb-4">
            <div className="bg-red-700 h-1 rounded-full w-3/10"></div>
          </div>
          
          <button 
            className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
            onClick={() => setShowMissionBrief(true)}
          >
            CONTINUE MISSION
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">QUICK ACTIONS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-yellow-900 to-amber-950 border border-yellow-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">QUICK PRACTICE</p>
            <p className="text-xs font-mono text-gray-500 text-center">5 MIN DRILL</p>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-blue-900 to-blue-950 border border-blue-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">CONVERSATION</p>
            <p className="text-xs font-mono text-gray-500 text-center">PRACTICE DIALOGUE</p>
          </div>
        </div>
      </div>

      {/* Intel Briefing */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">FIELD INTELLIGENCE</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h4 className="font-mono text-gray-300 text-sm">WEEKLY PROGRESS REPORT</h4>
                <p className="text-xs text-gray-500 font-mono mt-1">Your performance is 15% above last week. Continue the momentum to reach optimal language acquisition.</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <div className="bg-gray-900 border border-red-900 rounded p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                <span className="text-xl">🇫🇷</span>
              </div>
              <div>
                <h4 className="font-mono text-gray-300 text-sm">CULTURAL BRIEFING</h4>
                <p className="text-xs text-gray-500 font-mono mt-1">Understanding French etiquette is critical for successful field operations. Review the latest cultural intelligence.</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Mission Brief Modal */}
      {showMissionBrief && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          <div className="p-4 flex items-center border-b border-red-900">
            <button 
              className="mr-2"
              onClick={() => setShowMissionBrief(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold font-mono text-gray-200">MISSION BRIEFING</h1>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-mono text-red-500">OPERATION</p>
                  <h3 className="font-mono text-gray-200 text-lg">CANNES INFILTRATION</h3>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 font-mono mb-4">
                CLASSIFIED BRIEFING: Your mission is to infiltrate high society in Cannes, France. You must master French language and cultural protocols to blend in seamlessly with the local population.
              </p>
              
              <p className="text-sm text-gray-400 font-mono mb-4">
                PRIMARY OBJECTIVE: Establish a cover identity by learning basic French conversation skills. You will need to navigate social situations without raising suspicion.
              </p>
              
              <div className="border-t border-red-900/30 pt-4">
                <h4 className="font-mono text-gray-300 text-sm mb-3">MISSION PARAMETERS:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400 font-mono">Complete basic greeting protocols</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400 font-mono">Master introduction phrases</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400 font-mono">Develop sufficient vocabulary for casual conversations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400 font-mono">Understand basic cultural customs to avoid detection</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <h4 className="font-mono text-gray-300 text-sm mb-2">AVAILABLE TRAINING MODULES:</h4>
              
              <div className="bg-gray-900 border border-red-900 rounded p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                      <span className="text-xl">1</span>
                    </div>
                    <div>
                      <h4 className="font-mono text-gray-300 text-sm">BASIC GREETINGS</h4>
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-800 h-1 rounded-full mr-2">
                          <div className="bg-green-700 h-1 rounded-full w-full"></div>
                        </div>
                        <span className="text-xs text-green-500 font-mono">COMPLETED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 border border-red-900 rounded p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                      <span className="text-xl">2</span>
                    </div>
                    <div>
                      <h4 className="font-mono text-gray-300 text-sm">PERSONAL INTRODUCTIONS</h4>
                      <div className="flex items-center mt-1">
                        <div className="w-24 bg-gray-800 h-1 rounded-full mr-2">
                          <div className="bg-yellow-700 h-1 rounded-full w-1/2"></div>
                        </div>
                        <span className="text-xs text-yellow-500 font-mono">IN PROGRESS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <ClassifiedOverlay 
                isLocked={!isModule3Unlocked} 
                level="restricted" 
                onUnlock={() => setIsModule3Unlocked(true)}
              >
                <div className="bg-gray-900 border border-gray-800 rounded p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center mr-3">
                        <span className="text-xl">3</span>
                      </div>
                      <div>
                        <h4 className="font-mono text-gray-300 text-sm">CASUAL CONVERSATIONS</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-24 bg-gray-800 h-1 rounded-full mr-2">
                            <div className="bg-gray-800 h-1 rounded-full w-0"></div>
                          </div>
                          <span className="text-xs text-gray-500 font-mono">LOCKED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ClassifiedOverlay>
            </div>
            
            <a href="/lesson/lesson-basic-greetings">
              <button className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white mb-6">
                START BASIC GREETINGS LESSON
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-red-900 p-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs text-red-500 font-mono">HQ</span>
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
            <span className="text-xs text-gray-600 font-mono">AGENT</span>
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
          </div>
        </div>
      )}

      {/* Clearance Level Modal */}
      <ClearanceLevelModal 
        isOpen={showClearanceModal} 
        onClose={() => setShowClearanceModal(false)}
        currentLevel={7}
        totalXP={1990}
        agentCodename="DARK MALLARD"
      />
    </div>
  );
};

export default HQScreen;