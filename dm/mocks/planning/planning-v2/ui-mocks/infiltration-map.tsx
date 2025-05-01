import React, { useState, useEffect } from 'react';

const InfiltrationMap = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dataFlowPosition, setDataFlowPosition] = useState(0);
  
  // Nodes data
  const nodes = [
    { 
      id: 1, 
      title: "Hotel Check-in",
      status: "completed", // completed, active, locked
      position: { x: 20, y: 30 },
      completionLevel: 5, // 1-5
      connections: [2, 5],
      description: "Establish cover identity at hotel reception, obtain room with surveillance capabilities.",
      objectives: [
        "Master hotel vocabulary",
        "Practice reservation dialogue",
        "Learn room-related terminology"
      ],
      equipment: "Audio surveillance kit"
    },
    { 
      id: 2, 
      title: "Cafe Reconnaissance",
      status: "completed", 
      position: { x: 40, y: 25 },
      completionLevel: 4,
      connections: [3],
      description: "Gather intelligence at local cafe, establish pattern of behavior for cover identity.",
      objectives: [
        "Master cafe/restaurant vocabulary", 
        "Practice ordering dialogue",
        "Learn social small talk patterns"
      ],
      equipment: "Field microphone"
    },
    { 
      id: 3, 
      title: "Festival Access",
      status: "active", 
      position: { x: 60, y: 20 },
      completionLevel: 2,
      connections: [4],
      description: "Secure credentials for film festival. Establish industry connections for deeper cover.",
      objectives: [
        "Master film industry vocabulary",
        "Practice credential request dialogue",
        "Learn networking terminology"
      ],
      equipment: "Document scanner"
    },
    { 
      id: 4, 
      title: "Yacht Party",
      status: "locked", 
      position: { x: 80, y: 25 },
      completionLevel: 0,
      connections: [7],
      description: "Infiltrate exclusive yacht party to access high-value targets. Formal setting requires enhanced language skills.",
      objectives: [
        "Master formal social vocabulary",
        "Practice elegent conversation",
        "Learn maritime terminology"
      ],
      equipment: "Formal surveillance kit"
    },
    { 
      id: 5, 
      title: "Local Market",
      status: "completed", 
      position: { x: 35, y: 50 },
      completionLevel: 5,
      connections: [6],
      description: "Blend with locals at market to enhance cover authenticity. Acquire daily necessities.",
      objectives: [
        "Master shopping vocabulary",
        "Practice negotiation dialogue",
        "Learn local product names"
      ],
      equipment: "Covert camera"
    },
    { 
      id: 6, 
      title: "Police Encounter",
      status: "active", 
      position: { x: 55, y: 45 },
      completionLevel: 1,
      connections: [7],
      description: "Navigate routine police checkpoint without compromising cover identity.",
      objectives: [
        "Master authority interaction vocabulary",
        "Practice identification dialogue",
        "Learn legal terminology"
      ],
      equipment: "Counterfeit documents"
    },
    { 
      id: 7, 
      title: "Asset Recruitment",
      status: "locked", 
      position: { x: 75, y: 55 },
      completionLevel: 0,
      connections: [],
      description: "Identify and recruit local asset for intelligence gathering. Requires persuasive language skills.",
      objectives: [
        "Master persuasion vocabulary",
        "Practice recruitment dialogue",
        "Learn confidentiality terminology"
      ],
      equipment: "Dead drop kit"
    }
  ];

  // Checkpoint (section boundary)
  const checkpoint = {
    position: { x: 90, y: 40 },
    title: "SECTION CHECKPOINT: COASTAL OPERATION",
    status: "locked"
  };

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Data flow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlowPosition((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle node click
  const handleNodeClick = (id) => {
    setSelectedNode(nodes.find(node => node.id === id));
  };

  // Get node status class
  const getNodeStatusClasses = (status, completionLevel) => {
    switch(status) {
      case 'completed':
        return 'border-green-500 bg-green-900/30 text-green-500';
      case 'active':
        return 'border-yellow-500 bg-yellow-900/30 text-yellow-500 animate-pulse';
      case 'locked':
        return 'border-gray-700 bg-gray-900/30 text-gray-700';
      default:
        return 'border-gray-700 bg-gray-900/30 text-gray-700';
    }
  };

  // Get connection status class
  const getConnectionClass = (fromStatus, toStatus) => {
    if (fromStatus === 'completed' && toStatus === 'completed') {
      return 'stroke-green-500 stroke-2';
    } else if (
      (fromStatus === 'completed' && toStatus === 'active') || 
      (fromStatus === 'active' && toStatus === 'completed')
    ) {
      return 'stroke-yellow-500 stroke-2';
    } else {
      return 'stroke-gray-700 stroke-1';
    }
  };

  // Render level indicators
  const renderCompletionLevel = (level) => {
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-1 h-3 ${i <= level ? 'bg-green-500' : 'bg-gray-800'}`}
          />
        ))}
      </div>
    );
  };

  // Calculate path for SVG connection
  const calculatePath = (from, to) => {
    // Calculate control points for a curved path
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    // Add some curve variation based on positions
    const curveOffsetX = (to.y - from.y) * 0.2;
    const curveOffsetY = (from.x - to.x) * 0.2;
    
    return `M${from.x} ${from.y} Q${midX + curveOffsetX} ${midY + curveOffsetY} ${to.x} ${to.y}`;
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
        <div className="text-xl font-bold text-green-500">OPERATION RIVIERA</div>
        <div className="text-xs border border-green-800 px-2 py-1 bg-black">
          INFILTRATION NETWORK // SECTION 2
        </div>
      </div>
      
      <div className="flex h-full">
        {/* Left panel - Map */}
        <div className="flex-1 relative border border-green-900 mr-4 overflow-hidden">
          {/* Map header */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center bg-black/80 border-b border-green-900 p-2 z-10">
            <div className="text-xs text-green-400">OPERATION MAP • PHASE 2: PRELIMINARY INFILTRATION</div>
            <div className="text-xs text-green-600">ZOOM: 75%</div>
          </div>
          
          {/* Network Map SVG */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full" 
            style={{ padding: '30px 10px 10px 10px' }}
          >
            {/* Connection lines between nodes */}
            {nodes.map(node => 
              node.connections.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId);
                if (!targetNode) return null;
                
                const path = calculatePath(node.position, targetNode.position);
                const connectionClass = getConnectionClass(node.status, targetNode.status);
                
                // Only animate connections between completed and active nodes
                const shouldAnimate = (
                  (node.status === 'completed' && targetNode.status === 'active') ||
                  (node.status === 'active' && targetNode.status === 'completed')
                );
                
                return (
                  <g key={`connection-${node.id}-${targetId}`}>
                    <path 
                      d={path} 
                      className={connectionClass} 
                      fill="none" 
                      strokeDasharray={shouldAnimate ? "4 2" : "none"}
                    />
                    
                    {shouldAnimate && (
                      <circle 
                        r="0.8" 
                        fill="#FFCC00"
                        className="animate-pulse"
                        style={{
                          offset: `${dataFlowPosition}%`,
                        }}
                      >
                        <animateMotion 
                          dur="3s" 
                          repeatCount="indefinite"
                          path={path}
                        />
                      </circle>
                    )}
                  </g>
                );
              })
            )}
            
            {/* Section checkpoint */}
            <g>
              <rect 
                x={checkpoint.position.x - 5} 
                y={checkpoint.position.y - 5} 
                width="10" 
                height="10" 
                className="fill-gray-900 stroke-red-800" 
                strokeWidth="0.5" 
                strokeDasharray="1 1"
              />
              <text 
                x={checkpoint.position.x} 
                y={checkpoint.position.y - 8} 
                textAnchor="middle" 
                className="fill-red-800 text-xs"
                style={{ fontSize: '3px' }}
              >
                CHECKPOINT
              </text>
            </g>
            
            {/* Nodes */}
            {nodes.map(node => (
              <g 
                key={`node-${node.id}`} 
                onClick={() => node.status !== 'locked' && handleNodeClick(node.id)}
                style={{ cursor: node.status !== 'locked' ? 'pointer' : 'not-allowed' }}
              >
                <circle
                  cx={node.position.x}
                  cy={node.position.y}
                  r="3.5"
                  className={`${getNodeStatusClasses(node.status)} stroke-1 fill-black`}
                  strokeWidth="0.7"
                />
                
                <text
                  x={node.position.x}
                  y={node.position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={node.status === 'locked' ? 'fill-gray-700' : 'fill-current'}
                  style={{ fontSize: '2.2px' }}
                >
                  {node.status === 'locked' ? '🔒' : node.id}
                </text>
                
                <text
                  x={node.position.x}
                  y={node.position.y + 6}
                  textAnchor="middle"
                  className={node.status === 'locked' ? 'fill-gray-700' : 'fill-current'}
                  style={{ fontSize: '2.5px' }}
                >
                  {node.title}
                </text>
                
                {node.status === 'completed' && (
                  <g transform={`translate(${node.position.x - 2.5}, ${node.position.y + 8})`}>
                    <rect width="5" height="1" fill="none" />
                    {renderCompletionLevel(node.completionLevel)}
                  </g>
                )}
              </g>
            ))}
          </svg>
          
          {/* Map footer */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center bg-black/80 border-t border-green-900 p-2 z-10">
            <div className="text-xs text-green-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              COMPLETED: 3
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-3 mr-1"></span>
              IN PROGRESS: 2
              <span className="inline-block w-2 h-2 bg-gray-700 rounded-full ml-3 mr-1"></span>
              LOCKED: 2
            </div>
            <div className="text-xs border border-green-900 bg-green-900/20 px-2 py-0.5">
              SECTION PROGRESS: 57%
            </div>
          </div>
        </div>
        
        {/* Right panel - Mission details */}
        <div className="w-72 border border-green-900 bg-black/70 flex flex-col">
          {selectedNode ? (
            <>
              <div className="border-b border-green-900 p-3">
                <div className={`text-lg font-bold ${
                  selectedNode.status === 'completed' ? 'text-green-500' : 
                  selectedNode.status === 'active' ? 'text-yellow-500' : 
                  'text-gray-700'
                }`}>
                  {selectedNode.title}
                </div>
                <div className="text-xs text-green-700 mt-1">MISSION {selectedNode.id} • PHASE 2</div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3">
                <div className="mb-4">
                  <div className="text-xs text-green-400 mb-1">MISSION BRIEF</div>
                  <div className="text-sm text-green-300">
                    {selectedNode.description}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-green-400 mb-1">TRAINING OBJECTIVES</div>
                  <div className="space-y-1">
                    {selectedNode.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-green-700 mr-2">›</div>
                        <div className="text-sm text-green-300">{objective}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-green-400 mb-1">EQUIPMENT REQUIRED</div>
                  <div className="text-sm text-green-300 border border-green-900 bg-green-900/10 p-2">
                    {selectedNode.equipment}
                  </div>
                </div>
                
                {selectedNode.status === 'completed' && (
                  <div className="mb-4">
                    <div className="text-xs text-green-400 mb-1">MASTERY LEVEL</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        {renderCompletionLevel(selectedNode.completionLevel)}
                      </div>
                      <div className="text-xs text-green-600">
                        {selectedNode.completionLevel === 5 ? 'FULLY OPERATIONAL' : 
                         selectedNode.completionLevel >= 3 ? 'MISSION CAPABLE' : 
                         'TRAINING IN PROGRESS'}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedNode.status === 'active' && (
                  <div className="mb-4">
                    <div className="text-xs text-green-400 mb-1">CURRENT PROGRESS</div>
                    <div className="w-full h-1.5 bg-green-900/30 mt-1">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${selectedNode.completionLevel * 20}%` }}
                      />
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {selectedNode.completionLevel}/5 EXERCISES COMPLETED
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-green-900 p-3">
                {selectedNode.status === 'completed' && (
                  <button className="w-full bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 py-1.5 text-sm transition-colors">
                    REVIEW MISSION
                  </button>
                )}
                {selectedNode.status === 'active' && (
                  <button className="w-full bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-900 text-yellow-500 py-1.5 text-sm transition-colors">
                    CONTINUE TRAINING
                  </button>
                )}
                {selectedNode.status === 'locked' && (
                  <button disabled className="w-full bg-gray-900/30 border border-gray-900 text-gray-700 py-1.5 text-sm cursor-not-allowed">
                    MISSION LOCKED
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="text-green-700 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="text-green-400 text-lg mb-2">SELECT MISSION</div>
              <div className="text-green-700 text-sm">
                Choose a mission node to view details and training options
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfiltrationMap;