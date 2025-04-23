import { useState } from 'react';
import AgentAvatar from './agent-avatar';

type ClearanceLevelModalProps = {
  currentLevel: number;
  totalXP: number;
  isOpen: boolean;
  onClose: () => void;
  agentCodename?: string;
};

const ClearanceLevelModal = ({ 
  currentLevel = 7, 
  totalXP = 1990, 
  isOpen, 
  onClose,
  agentCodename = "DARK MALLARD" 
}: ClearanceLevelModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions'>('overview');
  
  // Clearance level data
  const clearanceLevels = [
    { level: 1, name: "RECRUIT", xpRequired: 0, description: "Basic field training" },
    { level: 2, name: "INITIATE", xpRequired: 100, description: "Simple observation tasks" },
    { level: 3, name: "FIELD TRAINEE", xpRequired: 300, description: "Basic communication protocols" },
    { level: 4, name: "FIELD AGENT", xpRequired: 600, description: "Simple asset interactions" },
    { level: 5, name: "OPERATIVE", xpRequired: 1000, description: "Field interrogation techniques" },
    { level: 6, name: "SENIOR OPERATIVE", xpRequired: 1500, description: "Complex cover operations" },
    { level: 7, name: "HANDLER", xpRequired: 2000, description: "Asset recruitment & management" },
    { level: 8, name: "FIELD DIRECTOR", xpRequired: 3000, description: "Regional operation oversight" },
    { level: 9, name: "DEPUTY DIRECTOR", xpRequired: 5000, description: "Strategic intelligence planning" },
    { level: 10, name: "DIRECTOR", xpRequired: 8000, description: "Agency command authority" },
  ];

  // Mission types that unlock at different levels
  const missionTypes = [
    { name: "SURVEILLANCE", unlocksAt: 1, description: "Basic vocabulary acquisition" },
    { name: "RECONNAISSANCE", unlocksAt: 2, description: "Simple phrases and questions" },
    { name: "INTELLIGENCE GATHERING", unlocksAt: 3, description: "Form basic sentences and responses" },
    { name: "ASSET MEETING", unlocksAt: 4, description: "Hold basic conversations" },
    { name: "COVERT INFILTRATION", unlocksAt: 5, description: "Navigate social situations" },
    { name: "COUNTER-INTELLIGENCE", unlocksAt: 6, description: "Discuss complex topics" },
    { name: "DEEP COVER", unlocksAt: 7, description: "Blend in as a native speaker" },
    { name: "EXTRACTION", unlocksAt: 8, description: "Handle emergency situations" },
    { name: "HANDLER OPERATIONS", unlocksAt: 9, description: "Train other agents in the field" },
    { name: "COMMAND OVERSIGHT", unlocksAt: 10, description: "Master all communication channels" },
  ];

  // Get current clearance level details
  const currentClearanceLevel = clearanceLevels.find(cl => cl.level === currentLevel) || clearanceLevels[0];
  
  // Calculate progress to next level
  const nextLevel = clearanceLevels.find(cl => cl.level === currentLevel + 1);
  let progressToNextLevel = 100;
  let xpToNextLevel = 0;
  
  if (nextLevel) {
    const xpForCurrentLevel = currentClearanceLevel.xpRequired;
    xpToNextLevel = nextLevel.xpRequired - xpForCurrentLevel;
    const xpProgress = totalXP - xpForCurrentLevel;
    progressToNextLevel = Math.min(100, Math.max(0, (xpProgress / xpToNextLevel) * 100));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col overflow-auto">
      <div className="p-4 flex items-center justify-between border-b border-red-900">
        <h1 className="text-xl font-bold font-mono text-gray-200">CLEARANCE LEVEL PROFILE</h1>
        <button 
          onClick={onClose}
          className="text-red-500 hover:text-red-400"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-red-900">
        <button 
          className={`px-4 py-2 font-mono text-sm ${activeTab === 'overview' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('overview')}
        >
          SECURITY CLEARANCE
        </button>
        <button 
          className={`px-4 py-2 font-mono text-sm ${activeTab === 'missions' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('missions')}
        >
          OPERATION TYPES
        </button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'overview' ? (
          <>
            {/* Agent Profile */}
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mr-4 shadow-lg shadow-red-900/20">
                <AgentAvatar seed={agentCodename} size={80} />
              </div>
              <div>
                <span className="text-xs font-mono text-red-500">FIELD OPERATIVE</span>
                <h3 className="font-mono text-white text-xl">{agentCodename}</h3>
                <p className="text-xs text-gray-400 font-mono">ACTIVE DUTY SINCE: 2023-09-15</p>
              </div>
            </div>

            {/* Current Clearance Level */}
            <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-xs font-mono text-red-500">CURRENT CLEARANCE</span>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-red-900/50 border border-red-800 flex items-center justify-center mr-3">
                      <span className="text-xl font-mono text-red-500">{currentLevel}</span>
                    </div>
                    <h3 className="font-mono text-white text-lg">{currentClearanceLevel.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-gray-400">TOTAL XP</span>
                  <p className="text-lg font-mono text-white">{totalXP} XP</p>
                </div>
              </div>

              <p className="text-sm text-gray-400 font-mono mb-4">
                Your security clearance grants access to: {currentClearanceLevel.description}
              </p>

              {nextLevel && (
                <>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-gray-400">PROGRESS TO LEVEL {nextLevel.level}</span>
                    <span className="text-gray-400">{Math.floor(progressToNextLevel)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                    <div 
                      className="bg-red-700 h-2 rounded-full"
                      style={{ width: `${progressToNextLevel}%` }}  
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {totalXP - currentClearanceLevel.xpRequired} / {xpToNextLevel} XP
                  </div>
                </>
              )}
            </div>

            {/* Clearance Levels */}
            <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider mb-2">
              AGENCY CLEARANCE HIERARCHY
            </h3>
            <div className="space-y-2 mb-6">
              {clearanceLevels.map((level) => {
                const isCurrentLevel = level.level === currentLevel;
                const isUnlocked = level.level <= currentLevel;
                const isNextLevel = level.level === currentLevel + 1;
                
                return (
                  <div 
                    key={level.level}
                    className={`p-3 rounded border ${
                      isCurrentLevel 
                        ? 'bg-red-900/20 border-red-800' 
                        : isUnlocked 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-gray-900/50 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isCurrentLevel 
                          ? 'bg-red-800 text-white' 
                          : isUnlocked 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-800 text-gray-500'
                      }`}>
                        <span className="text-sm font-mono">{level.level}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={`font-mono ${
                            isUnlocked ? 'text-gray-200' : 'text-gray-500'
                          }`}>
                            {level.name}
                          </h4>
                          <span className="text-xs font-mono text-gray-500">
                            {level.xpRequired} XP
                          </span>
                        </div>
                        <p className={`text-xs font-mono mt-1 ${
                          isUnlocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {isUnlocked ? level.description : isNextLevel ? level.description : '[CLASSIFIED]'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Mission Types */}
            <h3 className="text-red-500 text-xs font-bold font-mono tracking-wider mb-2">
              AUTHORIZED OPERATION TYPES
            </h3>
            <div className="space-y-2 mb-6">
              {missionTypes.map((mission) => {
                const isUnlocked = mission.unlocksAt <= currentLevel;
                
                return (
                  <div 
                    key={mission.name}
                    className={`p-3 rounded border ${
                      isUnlocked 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-900/50 border-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isUnlocked 
                          ? 'bg-gray-700 text-green-400' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        {isUnlocked ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={`font-mono ${
                            isUnlocked ? 'text-gray-200' : 'text-gray-500'
                          }`}>
                            {mission.name}
                          </h4>
                          <span className="text-xs font-mono text-gray-500">
                            LVL.{mission.unlocksAt < 10 ? `0${mission.unlocksAt}` : mission.unlocksAt}
                          </span>
                        </div>
                        <p className={`text-xs font-mono mt-1 ${
                          isUnlocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {isUnlocked ? mission.description : '[ACCESS DENIED]'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClearanceLevelModal; 