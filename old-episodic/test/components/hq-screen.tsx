import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ClearanceLevelModal from './clearance-level-modal';
import AgentAvatar from './agent-avatar';
import { useUser } from '../context/user-context';
import { sampleMissions, sampleLessons } from '../data/lesson-data';

const HQScreen = () => {
  const { userProgress } = useUser();
  const [showMissionBrief, setShowMissionBrief] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  // Filter lessons based on completion
  const completedLessons = userProgress.lessonsCompleted;
  
  // Get the available missions for this user
  const availableMissions = sampleMissions.filter(mission => 
    userProgress.unlockedMissions.includes(mission.id)
  );
  
  // Get the current active mission (first one for now)
  const activeMission = availableMissions[0];
  
  // Calculate mission completion percentage
  const missionLessons = activeMission ? sampleLessons.filter(lesson => 
    lesson.missionId === activeMission.id
  ) : [];
  
  const completionPercentage = missionLessons.length 
    ? (missionLessons.filter(lesson => completedLessons.includes(lesson.id)).length / missionLessons.length) * 100
    : 0;
  
  return (
    <div className="bg-black min-h-screen text-white p-4 pb-20">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mr-2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h1 className="text-xl font-mono font-bold tracking-tight text-gray-200">HEADQUARTERS</h1>
        </div>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded-md">
            <span className="text-xs text-red-500 font-mono">DAY {userProgress.streakDays}</span>
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
      </motion.div>

      {/* Agent Status */}
      <motion.div 
        className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mr-3 shadow-lg shadow-red-900/20">
              <AgentAvatar seed={userProgress.agentCodename || "DARK MALLARD"} size={48} />
            </div>
            <div>
              <span className="text-xs font-mono text-red-500">AGENT STATUS</span>
              <h3 className="font-mono text-gray-200 text-base">{userProgress.agentCodename || "DARK MALLARD"}</h3>
              <div className="flex mt-1">
                <div className="px-2 py-0.5 bg-green-900/30 border border-green-800 rounded-sm mr-2">
                  <span className="text-xs text-green-500 font-mono">ACTIVE</span>
                </div>
                <div 
                  className="px-2 py-0.5 bg-red-900/30 border border-red-800 rounded-sm cursor-pointer hover:bg-red-900/50 transition-colors"
                  onClick={() => setShowClearanceModal(true)}
                >
                  <span className="text-xs text-red-500 font-mono">LVL.{userProgress.level.toString().padStart(2, '0')}</span>
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
                  strokeDasharray={`${userProgress.dailyXP / 100 * 100}, 100`}
                />
              </svg>
              <span className="text-lg font-mono font-bold text-red-500">{Math.min(Math.round(userProgress.dailyXP / 100 * 100), 100)}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-gray-500">STREAK: </span>
            <span className="text-gray-300">{userProgress.streakDays} {userProgress.streakDays === 1 ? 'DAY' : 'DAYS'}</span>
          </div>
          <div>
            <span className="text-gray-500">XP TODAY: </span>
            <span className="text-gray-300">{userProgress.dailyXP}/100</span>
          </div>
          <div>
            <span className="text-gray-500">TOTAL: </span>
            <span className="text-gray-300">{userProgress.totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Main Mission Card */}
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-gray-950 border border-red-900 rounded-lg overflow-hidden mb-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
              <p className="text-sm text-gray-400 font-mono">{activeMission?.title || "MISSION BRIEFING"}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 font-mono mb-4">
            {activeMission?.description || "Complete your training regimen to prepare for your next mission."}
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
              <span className="text-gray-300 ml-1">{Math.round(completionPercentage)}%</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-800 h-1 rounded-full mb-4">
            <motion.div 
              className="bg-red-700 h-1 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            ></motion.div>
          </div>
          
          <motion.button 
            className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
            onClick={() => setShowMissionBrief(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            CONTINUE MISSION
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider">QUICK ACTIONS</h3>
        <div className="h-px bg-red-900 flex-grow mx-2"></div>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className="bg-gray-900 border border-red-900 rounded p-4"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(127, 29, 29, 0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-yellow-900 to-amber-950 border border-yellow-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">QUICK PRACTICE</p>
            <p className="text-xs font-mono text-gray-500 text-center">5 MIN DRILL</p>
          </div>
        </motion.div>
        
        <a href="/review">
          <motion.div 
            className="bg-gray-900 border border-red-900 rounded p-4"
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(127, 29, 29, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-green-900 to-green-950 border border-green-700 flex items-center justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                </svg>
              </div>
              <p className="text-sm font-mono text-gray-300 text-center">VOCABULARY REVIEW</p>
              <p className="text-xs font-mono text-gray-500 text-center">SPACED REPETITION</p>
            </div>
          </motion.div>
        </a>
        
        <motion.div 
          className="bg-gray-900 border border-red-900 rounded p-4"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(127, 29, 29, 0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-blue-900 to-blue-950 border border-blue-700 flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p className="text-sm font-mono text-gray-300 text-center">CONVERSATION</p>
            <p className="text-xs font-mono text-gray-500 text-center">PRACTICE DIALOGUE</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Mission Brief Modal */}
      <AnimatePresence>
        {showMissionBrief && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
              <motion.div 
                className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-red-500">OPERATION</p>
                    <h3 className="font-mono text-gray-200 text-lg">{activeMission?.title || "MISSION BRIEFING"}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 font-mono mb-4">
                  CLASSIFIED BRIEFING: {activeMission?.description || "Your mission details are being prepared."}
                </p>
                
                <p className="text-sm text-gray-400 font-mono mb-4">
                  PRIMARY OBJECTIVE: Master language skills needed for covert operations.
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
              </motion.div>
              
              <div className="space-y-3 mb-6">
                <h4 className="font-mono text-gray-300 text-sm mb-2">AVAILABLE TRAINING MODULES:</h4>
                
                {missionLessons.map((lesson, index) => (
                  <motion.div 
                    key={lesson.id}
                    className="bg-gray-900 border border-red-900 rounded p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
                          <span className="text-xl">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-mono text-gray-300 text-sm">{lesson.title}</h4>
                          <div className="flex items-center mt-1">
                            <div className="w-24 bg-gray-800 h-1 rounded-full mr-2">
                              <div 
                                className={`${
                                  completedLessons.includes(lesson.id) 
                                    ? 'bg-green-700 w-full' 
                                    : index === 0 || completedLessons.includes(missionLessons[index - 1]?.id || '')
                                      ? 'bg-yellow-700 w-1/2'
                                      : 'bg-gray-800 w-0'
                                } h-1 rounded-full`}
                              ></div>
                            </div>
                            <span className={`text-xs font-mono ${
                              completedLessons.includes(lesson.id) 
                                ? 'text-green-500'
                                : index === 0 || completedLessons.includes(missionLessons[index - 1]?.id || '')
                                  ? 'text-yellow-500'
                                  : 'text-gray-500'
                            }`}>
                              {completedLessons.includes(lesson.id)
                                ? 'COMPLETED'
                                : index === 0 || completedLessons.includes(missionLessons[index - 1]?.id || '')
                                  ? 'AVAILABLE'
                                  : 'LOCKED'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <a href="/lesson/lesson-basic-greetings">
                <motion.button 
                  className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white mb-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  START BASIC GREETINGS LESSON
                </motion.button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <AgentAvatar seed={userProgress.agentCodename || "DARK MALLARD"} size={24} />
            </div>
            <span className="text-xs text-gray-600 font-mono">AGENT</span>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
              <motion.div 
                className="bg-gray-900 border border-red-900 rounded overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
              
              {/* Support */}
              <h3 className="text-red-500 uppercase text-xs font-bold font-mono tracking-wider mb-3">INTELLIGENCE</h3>
              <motion.div 
                className="bg-gray-900 border border-red-900 rounded overflow-hidden mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clearance Level Modal */}
      <ClearanceLevelModal 
        isOpen={showClearanceModal} 
        onClose={() => setShowClearanceModal(false)}
        currentLevel={userProgress.level}
        totalXP={userProgress.totalXP}
        agentCodename={userProgress.agentCodename || "DARK MALLARD"}
      />
    </div>
  );
};

export default HQScreen;