import React from 'react';

// Component based on the mockup in dm/mocks/lesson-flow.tsx
// Displays a simulated conversation with response options
const FieldCommunicationsSimulation = ({ onNext }: { onNext?: () => void }) => {
  return (
    <div className="p-4 pb-20">
      {/* Header can be added if needed, mimicking lesson flow */}
      {/* <div className="flex items-center justify-between mb-4"> ... </div> */}

      {/* Conversation Simulation Box */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-red-500 font-mono">CONVERSATION SIMULATION</span>
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded">
            <span className="text-xs text-red-500 font-mono">LIVE EXERCISE</span>
          </div>
        </div>
        
        {/* Location & Dialogue Area */}
        <div className="mb-4 relative">
          <div className="absolute left-4 top-0 -mt-2 w-16 h-2 bg-gray-900"></div>
          <div className="border-l-2 border-t-2 border-r-2 border-gray-700 rounded-t-md p-2">
            <p className="text-xs text-gray-500 font-mono">LOCATION: CAFÉ CENTRAL, CANNES</p>
          </div>
          <div className="border-2 border-gray-700 rounded-b-md p-4 min-h-[200px] space-y-4">
            {/* Example Dialogue - This would be dynamically generated */}
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-800 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                <span className="text-lg">🧔</span> {/* Character Avatar */}
              </div>
              <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-300 font-mono">Bonjour! Comment vous appelez-vous?</p>
                <p className="text-xs text-gray-500 font-mono mt-1 italic">Hello! What is your name?</p>
              </div>
            </div>
            
            {/* User Response Example */}
            {/* <div className="flex justify-end"> ... </div> */}

          </div>
        </div>
        
        {/* Response Selection Area */}
        <div className="border-t border-red-900/30 pt-4 mb-4">
          <p className="text-xs text-gray-500 font-mono mb-3">SELECT YOUR RESPONSE:</p>
          <div className="space-y-3">
            {/* Example Response Options - These would be dynamic */}
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je m&apos;appelle Agent Canard.
            </button>
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je ne comprends pas.
            </button>
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je viens de nulle part.
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Button - Can be handled by parent component */}
      {onNext && (
        <button 
          className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
          onClick={onNext}
        >
          SUBMIT RESPONSE / CONTINUE
        </button>
      )}
    </div>
  );
};

export default FieldCommunicationsSimulation;
