import React, { useState, useEffect } from 'react';

const DarkMallardHQ = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [missionData, setMissionData] = useState({
    title: "Hotel Check-in",
    operation: "Operation Riviera",
    phase: "Infiltration",
    description: "Establish your cover identity at the Grand Palais Hotel in Cannes. You must convince the front desk staff of your identity as a Canadian film industry professional.",
    coverIntegrity: 87,
    progress: 20,
    objectives: [
      { text: "Successfully check into hotel", completed: false },
      { text: "Gather intel about other guests", completed: false },
      { text: "Secure room with view of marina", completed: false }
    ],
    xpReward: 120
  });
  
  const [agentStats, setAgentStats] = useState({
    codename: "DARK MALLARD",
    clearanceLevel: "LEVEL 2",
    coverIdentity: "Simon Jackson",
    streak: 3,
    streakTarget: 7,
    totalXp: 450,
    dailyXp: 120
  });
  
  const [intelUpdates, setIntelUpdates] = useState([
    {
      id: 1,
      title: "New Asset Available",
      description: "Hotel concierge appears receptive to recruitment. Build rapport to unlock specialized vocabulary.",
      priority: "high",
      timestamp: "07:42"
    },
    {
      id: 2,
      title: "Cover Warning",
      description: "Security presence increased at hotel. Maintain professional demeanor and avoid drawing attention.",
      priority: "medium",
      timestamp: "06:15"
    },
    {
      id: 3,
      title: "Vocabulary Update",
      description: "New hotel terminology added to your intelligence files. Review before mission deployment.",
      priority: "low",
      timestamp: "Yesterday"
    }
  ]);
  
  const [quickActions, setQuickActions] = useState([
    {
      id: "practice",
      name: "Tactical Drills",
      icon: "🎯",
      description: "5-minute vocabulary reinforcement"
    },
    {
      id: "convo",
      name: "Field Communications",
      icon: "🗣️",
      description: "Practice conversation patterns"
    },
    {
      id: "review",
      name: "Intelligence Review",
      icon: "🧠",
      description: "Strengthen vocabulary recall"
    }
  ]);
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
    <div className="relative flex flex-col w-full h-screen bg-black overflow-y-auto text-gray-300 font-mono">
      {/* Background grid and effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-15"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)',
               backgroundSize: '20px 20px',
               backgroundPosition: '-0.5px -0.5px'
             }}>
        </div>
        
        {/* Scan line effect */}
        <div className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-30"
             style={{ 
               top: `${scanPosition}%`, 
               boxShadow: '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.4)'
             }}>
        </div>
        
        {/* CRT scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
             style={{
               backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.1) 50%)',
               backgroundSize: '100% 4px'
             }}>
        </div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 opacity-70"
             style={{
               background: 'radial-gradient(circle, transparent 30%, black 90%)'
             }}>
        </div>
      </div>
      
      {/* Top header */}
      <div className="z-10 border-b border-red-900/30 py-3 px-6 flex justify-between items-center">
        <div className="text-red-600 font-bold">DARK MALLARD</div>
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500">
            SECURITY LEVEL: <span className="text-green-500">OPERATIONAL</span>
          </div>
          <button className="text-gray-500 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 flex-1 overflow-y-auto px-4 py-6 pb-24">
        {/* Agent greeting */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">{getGreeting()}, AGENT</div>
          <div className="text-xl text-red-600 font-bold flex items-center">
            {agentStats.codename}
            <span className="ml-2 text-xs px-2 py-0.5 border border-red-900 text-red-600">
              {agentStats.clearanceLevel}
            </span>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="text-sm">
              Cover Identity: <span className="text-gray-400">{agentStats.coverIdentity}</span>
            </div>
            <div className="ml-auto flex items-center">
              <div className="text-xs text-gray-500 mr-2">STREAK</div>
              <div className="flex items-center">
                <div className="bg-red-900/30 text-red-500 px-2 py-0.5 text-sm">
                  {agentStats.streak}/{agentStats.streakTarget}
                </div>
                <div className="text-orange-500 ml-1">🔥</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current mission */}
        <div className="border border-red-900/30 bg-black/70 p-4 mb-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xs text-gray-500">CURRENT MISSION</div>
              <div className="text-lg text-gray-200 font-bold">{missionData.title}</div>
              <div className="text-xs text-red-600 mt-0.5">{missionData.operation} • {missionData.phase}</div>
            </div>
            <div className="text-xs px-2 py-1 border border-green-800 text-green-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              ACTIVE
            </div>
          </div>
          
          <div className="mb-4 text-sm text-gray-400">
            {missionData.description}
          </div>
          
          {/* Mission progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5">
              <div className="text-gray-500">MISSION PROGRESS</div>
              <div className="text-gray-500">{missionData.progress}%</div>
            </div>
            <div className="w-full h-1.5 bg-gray-900 overflow-hidden">
              <div className="h-full bg-red-600" style={{ width: `${missionData.progress}%` }}></div>
            </div>
          </div>
          
          {/* Cover integrity */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <div className="text-gray-500">COVER INTEGRITY</div>
              <div className="text-gray-500">{missionData.coverIntegrity}%</div>
            </div>
            <div className="w-full h-1.5 bg-gray-900 overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: `${missionData.coverIntegrity}%` }}></div>
            </div>
          </div>
          
          {/* Mission objectives */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">OBJECTIVES</div>
            <div className="space-y-2">
              {missionData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 border ${objective.completed ? 'border-green-600 bg-green-900/30' : 'border-gray-700'} flex items-center justify-center mr-3`}>
                    {objective.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className={`text-sm ${objective.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {objective.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mission action */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              REWARD: <span className="text-red-500">{missionData.xpReward} XP</span>
            </div>
            <button className="bg-red-900/30 hover:bg-red-900/50 border border-red-900 text-red-500 px-4 py-1.5 text-sm transition-colors">
              CONTINUE MISSION
            </button>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-2">QUICK ACTIONS</div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button key={action.id} className="border border-gray-800 hover:border-red-900/50 bg-black/70 hover:bg-gray-900/50 p-3 text-left transition-colors h-full">
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-bold text-gray-300 mb-1">{action.name}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Intelligence updates */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-2">INTELLIGENCE UPDATES</div>
          <div className="space-y-3">
            {intelUpdates.map((update) => (
              <div key={update.id} className="border border-gray-800 bg-black/70 p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-bold text-gray-300">{update.title}</div>
                  <div className={`text-xs px-2 py-0.5 ${
                    update.priority === 'high' ? 'bg-red-900/30 text-red-500' :
                    update.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-500' :
                    'bg-blue-900/30 text-blue-500'
                  }`}>
                    {update.priority.toUpperCase()}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mb-2">{update.description}</div>
                <div className="text-xs text-gray-600">{update.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="z-10 fixed bottom-0 left-0 right-0 border-t border-red-900/30 py-3 px-6 bg-black/90 backdrop-blur-sm flex justify-around">
        <div className="text-red-600 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <div className="text-xs mt-1">HQ</div>
        </div>
        <div className="text-gray-600 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-xs mt-1">INTEL</div>
        </div>
        <div className="text-gray-600 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div className="text-xs mt-1">MISSIONS</div>
        </div>
        <div className="text-gray-600 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="text-xs mt-1">AGENT</div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16 pointer-events-none" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16 pointer-events-none" />
    </div>
  );
};

export default DarkMallardHQ;