import { useState } from 'react';
import AgentAvatar from './agent-avatar';

/**
 * A simple explorer component for testing different agent avatars
 * This is a developer tool and not intended for production use
 */
const AgentAvatarExplorer = () => {
  const [codename, setCodename] = useState('DARK MALLARD');
  const [variant, setVariant] = useState<'standard' | 'classified' | 'undercover'>('standard');
  const [size, setSize] = useState(80);
  
  // Sample codenames for quick testing
  const sampleCodenames = [
    'DARK MALLARD',
    'RED OCTOBER',
    'BLACK WIDOW',
    'SILVER FOX',
    'BLUE FALCON',
    'GOLDEN EYE',
    'CRIMSON HAWK',
    'GHOST PROTOCOL',
    'EMERALD SERPENT',
    'ARCTIC WOLF',
  ];

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-xl font-mono font-bold mb-6 text-red-500">AGENT PROFILE GENERATOR</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
          <h2 className="font-mono text-red-500 mb-4">CONFIGURATION</h2>
          
          <div className="mb-4">
            <label className="block text-gray-400 font-mono text-sm mb-2">AGENT CODENAME</label>
            <input 
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white p-2 font-mono"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-400 font-mono text-sm mb-2">AVATAR SIZE</label>
            <input 
              type="range"
              min="24"
              max="200"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-gray-400 font-mono text-sm">{size}px</span>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-400 font-mono text-sm mb-2">VARIANT</label>
            <div className="flex space-x-3">
              <button 
                className={`px-3 py-1 font-mono text-xs ${variant === 'standard' ? 'bg-red-800' : 'bg-gray-800'}`}
                onClick={() => setVariant('standard')}
              >
                STANDARD
              </button>
              <button 
                className={`px-3 py-1 font-mono text-xs ${variant === 'classified' ? 'bg-red-800' : 'bg-gray-800'}`}
                onClick={() => setVariant('classified')}
              >
                CLASSIFIED
              </button>
              <button 
                className={`px-3 py-1 font-mono text-xs ${variant === 'undercover' ? 'bg-red-800' : 'bg-gray-800'}`}
                onClick={() => setVariant('undercover')}
              >
                UNDERCOVER
              </button>
            </div>
          </div>
          
          <h3 className="font-mono text-gray-400 text-sm mb-2">SAMPLE CODENAMES</h3>
          <div className="flex flex-wrap gap-2">
            {sampleCodenames.map((name) => (
              <button 
                key={name}
                className="px-2 py-1 bg-gray-800 text-xs font-mono hover:bg-red-900/30"
                onClick={() => setCodename(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 border border-red-900 rounded-lg p-4">
          <h2 className="font-mono text-red-500 mb-4">AGENT PREVIEW</h2>
          
          <div className="flex flex-col items-center mb-6">
            <div className={`w-${size/4} h-${size/4} rounded-full bg-gray-900 border-2 border-red-800 flex items-center justify-center overflow-hidden mb-3`}>
              <AgentAvatar 
                seed={codename} 
                size={size} 
                variant={variant}
              />
            </div>
            <span className="text-xs font-mono text-red-500">AGENT CODENAME</span>
            <h3 className="font-mono text-white text-xl">{codename}</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {sampleCodenames.slice(0, 8).map((name) => (
              <div key={name} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center overflow-hidden mb-1">
                  <AgentAvatar 
                    seed={name} 
                    size={48} 
                    variant={variant}
                  />
                </div>
                <span className="text-xs font-mono text-gray-400 truncate w-full text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAvatarExplorer; 