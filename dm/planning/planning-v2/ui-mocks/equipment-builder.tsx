import React, { useState, useEffect } from 'react';

const EquipmentBuilder = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [completionLevel, setCompletionLevel] = useState(3); // 0-5
  const [animatingPart, setAnimatingPart] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Equipment data
  const equipment = {
    name: "FIELD SURVEILLANCE KIT",
    codeName: "ÉCOUTEUR-5",
    mission: "CAFÉ RECONNAISSANCE",
    purpose: "Covert audio recording and transmission capability for café surveillance operation.",
    components: [
      {
        id: 1,
        name: "Base Transceiver",
        status: completionLevel >= 1 ? "installed" : "locked",
        function: "Encrypted signal transmission to field HQ",
        details: "16-bit encryption with frequency hopping to evade detection. Range of 500m in urban environments.",
        completedWith: "Vocabulary Mastery: Greetings"
      },
      {
        id: 2,
        name: "Directional Microphone",
        status: completionLevel >= 2 ? "installed" : "locked",
        function: "High-sensitivity audio capture",
        details: "Captures clear audio up to 15m in noisy environments, with targeted directional capability.",
        completedWith: "Dialogue Practice: Café Introduction"
      },
      {
        id: 3,
        name: "Power System",
        status: completionLevel >= 3 ? "installed" : "locked",
        function: "Long-duration power supply",
        details: "12-hour operational capacity with quick-charge capability. Low electromagnetic signature.",
        completedWith: "Listening Exercise: Menu Options"
      },
      {
        id: 4,
        name: "Disguise Housing",
        status: completionLevel >= 4 ? "locked" : "locked",
        function: "Concealment as everyday object",
        details: "Appears as standard consumer electronics with heat signature dampening.",
        completedWith: "Speaking Practice: Ordering Food"
      },
      {
        id: 5,
        name: "Memory Module",
        status: completionLevel >= 5 ? "locked" : "locked",
        function: "Local storage of intercepts",
        details: "256GB encrypted storage with remote wipe capability. Auto-categorization of captured audio.",
        completedWith: "Field Operation: Complete Café Interaction"
      }
    ]
  };

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);
  
  // Component animation on mount
  useEffect(() => {
    let timeout;
    // Animate each installed component sequentially
    for (let i = 0; i < completionLevel; i++) {
      timeout = setTimeout(() => {
        setAnimatingPart(i + 1);
        setTimeout(() => setAnimatingPart(null), 1000);
      }, i * 1500);
    }
    
    return () => clearTimeout(timeout);
  }, [completionLevel]);
  
  // Handle part selection
  const handlePartClick = (part) => {
    if (part.status === "installed") {
      setSelectedPart(part);
      setShowDetails(true);
    }
  };
  
  // Progress bar
  const ProgressBar = ({ level, maxLevel = 5 }) => {
    return (
      <div className="w-full h-1.5 bg-green-900/30 mt-1 mb-2">
        <div 
          className="h-full bg-green-500"
          style={{ width: `${(level / maxLevel) * 100}%` }}
        />
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-black text-green-500 font-mono p-4 overflow-hidden relative">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Scanline effect */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-green-500 opacity-20"
        style={{ top: `${scanPosition}%` }}
      />
      
      {/* CRT vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, transparent 40%, black 150%)' }}
      />
      
      {/* Terminal borders */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-800" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-800" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-800" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-800" />
      
      {/* Top header */}
      <div className="flex justify-between items-center mb-4 border-b border-green-900 pb-2">
        <div className="flex items-center">
          <div className="text-xs border border-green-800 px-2 py-1 bg-black">
            EQUIPMENT ASSEMBLY
          </div>
          <div className="ml-4 text-xs text-green-400">{equipment.codeName}</div>
        </div>
        
        <div className="flex items-center">
          <div className="text-xs text-green-400 mr-4">MISSION: {equipment.mission}</div>
          <div className="text-xs border border-green-800 px-2 py-1 bg-black">
            PROGRESS: {completionLevel}/5
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left panel - Equipment visualization */}
        <div className="flex-1 relative border border-green-900 mr-4 overflow-hidden">
          <div className="absolute inset-0 flex flex-col">
            {/* Equipment header */}
            <div className="border-b border-green-900 p-3 bg-black/80">
              <div className="text-lg font-bold text-green-500">{equipment.name}</div>
              <div className="text-xs text-green-700 mt-1">
                COMPLETION STATUS: {completionLevel}/5 COMPONENTS INSTALLED
              </div>
            </div>
            
            {/* Main equipment visualization area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Blueprint background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 300" width="100%" height="100%" className="stroke-green-800">
                  <line x1="50" y1="0" x2="50" y2="300" strokeDasharray="4,4" />
                  <line x1="100" y1="0" x2="100" y2="300" strokeDasharray="4,4" />
                  <line x1="150" y1="0" x2="150" y2="300" strokeDasharray="4,4" />
                  <line x1="200" y1="0" x2="200" y2="300" strokeDasharray="4,4" />
                  <line x1="250" y1="0" x2="250" y2="300" strokeDasharray="4,4" />
                  <line x1="300" y1="0" x2="300" y2="300" strokeDasharray="4,4" />
                  <line x1="350" y1="0" x2="350" y2="300" strokeDasharray="4,4" />
                  
                  <line x1="0" y1="50" x2="400" y2="50" strokeDasharray="4,4" />
                  <line x1="0" y1="100" x2="400" y2="100" strokeDasharray="4,4" />
                  <line x1="0" y1="150" x2="400" y2="150" strokeDasharray="4,4" />
                  <line x1="0" y1="200" x2="400" y2="200" strokeDasharray="4,4" />
                  <line x1="0" y1="250" x2="400" y2="250" strokeDasharray="4,4" />
                  
                  <circle cx="200" cy="150" r="100" fill="none" strokeDasharray="4,4" />
                  <circle cx="200" cy="150" r="75" fill="none" strokeDasharray="4,4" />
                  <circle cx="200" cy="150" r="50" fill="none" strokeDasharray="4,4" />
                  <circle cx="200" cy="150" r="25" fill="none" strokeDasharray="4,4" />
                </svg>
              </div>
              
              {/* Equipment visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Base component */}
                  <div 
                    className={`absolute top-0 left-0 w-56 h-56 flex items-center justify-center ${
                      equipment.components[0].status === "installed" ? 
                        "opacity-100" : "opacity-30"
                    } ${
                      animatingPart === 1 ? "animate-pulse" : ""
                    }`}
                  >
                    <div 
                      className="w-40 h-40 border-4 border-green-700 bg-black/80 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => handlePartClick(equipment.components[0])}
                    >
                      <div className="text-green-500 font-bold">BASE</div>
                    </div>
                  </div>
                  
                  {/* Directional Microphone */}
                  <div 
                    className={`absolute top-10 left-56 w-32 h-20 ${
                      equipment.components[1].status === "installed" ? 
                        "opacity-100" : "opacity-30"
                    } ${
                      animatingPart === 2 ? "animate-pulse" : ""
                    }`}
                  >
                    <div 
                      className="h-full w-full border-2 border-green-700 bg-black/80 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePartClick(equipment.components[1])}
                    >
                      <div className="text-green-500 text-sm">MIC</div>
                    </div>
                  </div>
                  
                  {/* Power System */}
                  <div 
                    className={`absolute bottom-0 left-16 w-24 h-24 ${
                      equipment.components[2].status === "installed" ? 
                        "opacity-100" : "opacity-30"
                    } ${
                      animatingPart === 3 ? "animate-pulse" : ""
                    }`}
                  >
                    <div 
                      className="h-full w-full border-2 border-green-700 bg-black/80 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePartClick(equipment.components[2])}
                    >
                      <div className="text-green-500 text-sm">POWER</div>
                    </div>
                  </div>
                  
                  {/* Disguise Housing */}
                  <div 
                    className={`absolute top-0 left-16 w-24 h-24 ${
                      equipment.components[3].status === "installed" ? 
                        "opacity-100" : "opacity-30"
                    } ${
                      animatingPart === 4 ? "animate-pulse" : ""
                    }`}
                  >
                    <div 
                      className="h-full w-full border-2 border-green-700 bg-black/80 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePartClick(equipment.components[3])}
                    >
                      <div className="text-green-500 text-sm">DISGUISE</div>
                    </div>
                  </div>
                  
                  {/* Memory Module */}
                  <div 
                    className={`absolute bottom-10 left-48 w-16 h-16 ${
                      equipment.components[4].status === "installed" ? 
                        "opacity-100" : "opacity-30"
                    } ${
                      animatingPart === 5 ? "animate-pulse" : ""
                    }`}
                  >
                    <div 
                      className="h-full w-full border-2 border-green-700 bg-black/80 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePartClick(equipment.components[4])}
                    >
                      <div className="text-green-500 text-sm">MEMORY</div>
                    </div>
                  </div>
                  
                  {/* Connection lines */}
                  <svg viewBox="0 0 300 300" width="300" height="300" className="absolute top-0 left-0">
                    {/* Base to Microphone */}
                    <line 
                      x1="150" y1="150" x2="210" y2="120" 
                      className={`stroke-green-700 ${equipment.components[1].status === "installed" ? "opacity-100" : "opacity-30"}`} 
                      strokeWidth="2"
                      strokeDasharray={equipment.components[1].status === "installed" ? "none" : "4,4"}
                    />
                    
                    {/* Base to Power */}
                    <line 
                      x1="150" y1="150" x2="120" y2="210" 
                      className={`stroke-green-700 ${equipment.components[2].status === "installed" ? "opacity-100" : "opacity-30"}`} 
                      strokeWidth="2"
                      strokeDasharray={equipment.components[2].status === "installed" ? "none" : "4,4"}
                    />
                    
                    {/* Base to Disguise */}
                    <line 
                      x1="150" y1="150" x2="120" y2="90" 
                      className={`stroke-green-700 ${equipment.components[3].status === "installed" ? "opacity-100" : "opacity-30"}`} 
                      strokeWidth="2"
                      strokeDasharray={equipment.components[3].status === "installed" ? "none" : "4,4"}
                    />
                    
                    {/* Base to Memory */}
                    <line 
                      x1="150" y1="150" x2="200" y2="200" 
                      className={`stroke-green-700 ${equipment.components[4].status === "installed" ? "opacity-100" : "opacity-30"}`} 
                      strokeWidth="2"
                      strokeDasharray={equipment.components[4].status === "installed" ? "none" : "4,4"}
                    />
                    
                    {/* Active data flow animation */}
                    {equipment.components[1].status === "installed" && (
                      <circle r="3" fill="#4CAF50" opacity="0.8">
                        <animateMotion 
                          dur="3s"
                          repeatCount="indefinite"
                          path="M150,150 L210,120"
                        />
                      </circle>
                    )}
                    
                    {equipment.components[2].status === "installed" && (
                      <circle r="3" fill="#4CAF50" opacity="0.8">
                        <animateMotion 
                          dur="4s"
                          repeatCount="indefinite"
                          path="M120,210 L150,150"
                        />
                      </circle>
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Status readout */}
            <div className="border-t border-green-900 p-3 bg-black/80 text-xs">
              <div className="grid grid-cols-5 gap-2">
                {equipment.components.map((component, idx) => (
                  <div 
                    key={idx} 
                    className={`border p-1 text-center ${
                      component.status === "installed" ? 
                        "border-green-700 bg-green-900/20 text-green-500" : 
                        "border-gray-800 bg-gray-900/10 text-gray-700"
                    }`}
                  >
                    {component.name.split(' ')[0]}
                    <div className="mt-1">
                      {component.status === "installed" ? (
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      ) : (
                        <span className="inline-block w-2 h-2 bg-gray-700 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Component details and progress */}
        <div className="w-80 border border-green-900 bg-black/70 flex flex-col">
          {showDetails && selectedPart ? (
            <>
              {/* Component detail view */}
              <div className="border-b border-green-900 p-3 flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold text-green-500">{selectedPart.name}</div>
                  <div className="text-xs text-green-700 mt-1">COMPONENT DETAILS</div>
                </div>
                <button 
                  className="text-green-700 hover:text-green-500"
                  onClick={() => setShowDetails(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="border border-green-900 bg-green-900/10 p-3 mb-4">
                  <div className="text-xs text-green-400 mb-2">COMPONENT FUNCTION</div>
                  <div className="text-sm text-green-300">{selectedPart.function}</div>
                </div>
                
                <div className="border border-green-900 bg-green-900/10 p-3 mb-4">
                  <div className="text-xs text-green-400 mb-2">TECHNICAL SPECIFICATIONS</div>
                  <div className="text-sm text-green-300">{selectedPart.details}</div>
                </div>
                
                <div className="border border-green-900 bg-green-900/10 p-3 mb-4">
                  <div className="text-xs text-green-400 mb-2">INSTALLATION NOTES</div>
                  <div className="text-sm text-green-300">
                    Secured through completion of: <span className="text-green-500">{selectedPart.completedWith}</span>
                  </div>
                </div>
                
                <div className="border border-green-900 bg-green-900/10 p-3">
                  <div className="text-xs text-green-400 mb-2">OPERATIONAL STATUS</div>
                  <div className="text-sm text-green-300 flex items-center">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    FULLY OPERATIONAL
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Default equipment progress view */}
              <div className="border-b border-green-900 p-3">
                <div className="text-lg font-bold text-green-500">ASSEMBLY PROGRESS</div>
                <div className="text-xs text-green-700 mt-1">SELECT COMPONENT FOR DETAILS</div>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto">
                <div className="mb-4">
                  <div className="text-xs text-green-400 mb-2">EQUIPMENT PURPOSE</div>
                  <div className="text-sm text-green-300 border border-green-900 bg-green-900/10 p-3">
                    {equipment.purpose}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-green-400 mb-2">COMPONENT STATUS</div>
                  <div className="space-y-3">
                    {equipment.components.map((component, idx) => (
                      <div 
                        key={idx} 
                        className={`border p-2 cursor-pointer ${
                          component.status === "installed" ? 
                            "border-green-700 bg-green-900/10 hover:bg-green-900/20" : 
                            "border-gray-800 bg-gray-900/10"
                        }`}
                        onClick={() => component.status === "installed" && handlePartClick(component)}
                      >
                        <div className="flex justify-between items-center">
                          <div className={`font-bold ${
                            component.status === "installed" ? "text-green-500" : "text-gray-700"
                          }`}>
                            {component.name}
                          </div>
                          <div className={`text-xs ${
                            component.status === "installed" ? "text-green-700" : "text-gray-700"
                          }`}>
                            {component.status === "installed" ? "INSTALLED" : "LOCKED"}
                          </div>
                        </div>
                        <div className="text-xs mt-1 text-green-700">
                          {component.status === "installed" ? 
                            "Click for details" : 
                            `Unlocked by: ${component.completedWith}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-green-400 mb-2">NEXT COMPONENT UNLOCK</div>
                  {completionLevel < 5 ? (
                    <div className="border border-yellow-900 bg-yellow-900/10 p-3">
                      <div className="text-sm text-yellow-500 font-bold">
                        {equipment.components[completionLevel].name}
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        Complete: {equipment.components[completionLevel].completedWith}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-900 bg-green-900/10 p-3">
                      <div className="text-sm text-green-500 font-bold">
                        EQUIPMENT FULLY ASSEMBLED
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Ready for field deployment
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="border-t border-green-900 p-3">
            <div className="text-xs text-green-400 mb-1">ASSEMBLY PROGRESS</div>
            <ProgressBar level={completionLevel} />
            <div className="flex justify-between items-center text-xs">
              <div className="text-green-700">
                {completionLevel}/5 COMPONENTS
              </div>
              <div className={`${
                completionLevel < 2 ? "text-red-500" : 
                completionLevel < 4 ? "text-yellow-500" : 
                "text-green-500"
              }`}>
                {completionLevel < 2 ? "NON-FUNCTIONAL" : 
                 completionLevel < 4 ? "BASIC FUNCTION" : 
                 completionLevel < 5 ? "OPERATIONAL" : "FULLY OPERATIONAL"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentBuilder;