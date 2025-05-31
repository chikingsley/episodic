import React, { useState, useEffect } from 'react';

const MainTerminal = () => {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootPhase, setBootPhase] = useState(0);
  const [scanPosition, setScanPosition] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [coverIntegrity, setCoverIntegrity] = useState(87);
  const [daysInField, setDaysInField] = useState(12);
  const [currentTime, setCurrentTime] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', text: 'DAILY INTERCEPT REQUIRED', time: '2h remaining' },
    { id: 2, type: 'info', text: 'NEW FIELD EQUIPMENT AVAILABLE', time: '6m ago' }
  ]);

  // Boot sequence effect
  useEffect(() => {
    if (bootSequence) {
      const timer = setTimeout(() => {
        if (bootPhase < 5) {
          setBootPhase(bootPhase + 1);
        } else {
          setBootSequence(false);
        }
      }, bootPhase === 0 ? 1000 : 600);
      return () => clearTimeout(timer);
    }
  }, [bootPhase, bootSequence]);

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Time update
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence render
  if (bootSequence) {
    return (
      <div className="h-screen w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center p-6 overflow-hidden relative">
        {/* Scanline effect */}
        <div 
          className="absolute left-0 right-0 h-1 bg-green-500 opacity-20"
          style={{ top: `${scanPosition}%` }}
        />
        
        <div className="w-full max-w-2xl">
          <div className={`transition-opacity duration-500 ${bootPhase >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-4 text-center">
              <div className="text-2xl text-green-400 mb-1">SHADOW DIRECTIVE</div>
              <div className="text-sm text-green-600">OPERATIVE NEURAL NETWORK v4.2.7</div>
            </div>
          </div>
          
          <div className={`transition-opacity duration-500 ${bootPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-6 bg-black border border-green-800 my-4 overflow-hidden">
              <div 
                className="h-full bg-green-800 transition-all duration-1000"
                style={{ width: `${bootPhase >= 1 ? 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className={`transition-opacity duration-500 ${bootPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-green-400 text-sm mb-2">SYSTEM INITIALIZATION...</div>
            <div className="text-green-600 text-xs mb-1">▸ Secure connection established</div>
            <div className="text-green-600 text-xs mb-1">▸ Neural language pathways loaded</div>
            <div className="text-green-600 text-xs mb-1">▸ Field agent protocols activated</div>
          </div>
          
          <div className={`transition-opacity duration-500 ${bootPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-green-400 text-sm my-2">IDENTITY VERIFICATION</div>
            <div className="h-6 bg-black border border-green-800 my-3">
              <div 
                className="h-full bg-green-800 transition-all duration-1000"
                style={{ width: `${bootPhase >= 4 ? 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className={`transition-opacity duration-500 ${bootPhase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-green-400 text-center my-4 text-lg animate-pulse">
              ACCESS GRANTED - DARK MALLARD
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen w-full bg-black text-green-500 font-mono p-4 overflow-hidden relative ${
        glitchActive ? 'animate-pulse' : ''
      }`}
    >
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
      
      {/* Top status bar */}
      <div className="flex justify-between items-center mb-4 border-b border-green-900 pb-2">
        <div className="flex items-center">
          <div className="text-xs border border-green-800 px-2 py-1 bg-black">
            TERMINAL//SD-12
          </div>
          <div className="ml-4 text-xs text-green-400">{currentTime}</div>
        </div>
        <div className="flex items-center">
          <div className="text-xs text-green-400 mr-4">OPERATIVE: DARK MALLARD</div>
          <div className="text-xs border border-green-800 px-2 py-1 bg-black flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            SECURE
          </div>
        </div>
      </div>
      
      {/* Cover status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-green-900 bg-black/70 p-3">
          <div className="text-xs text-green-400 mb-1">COVER INTEGRITY</div>
          <div className="flex items-end justify-between">
            <div className="text-xl font-bold">{coverIntegrity}%</div>
            <div className={`text-xs ${
              coverIntegrity > 80 ? 'text-green-500' : 
              coverIntegrity > 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {
                coverIntegrity > 80 ? 'OPTIMAL' : 
                coverIntegrity > 50 ? 'COMPROMISED' : 'CRITICAL'
              }
            </div>
          </div>
          <div className="w-full h-1.5 bg-green-900/30 mt-2">
            <div 
              className={`h-full ${
                coverIntegrity > 80 ? 'bg-green-500' : 
                coverIntegrity > 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${coverIntegrity}%` }}
            />
          </div>
        </div>
        
        <div className="border border-green-900 bg-black/70 p-3">
          <div className="text-xs text-green-400 mb-1">DAYS IN FIELD</div>
          <div className="flex items-end justify-between">
            <div className="flex">
              {daysInField.toString().padStart(2, '0').split('').map((digit, idx) => (
                <div key={idx} className="h-8 w-7 bg-black border border-green-800 mr-0.5 flex items-center justify-center text-lg">
                  {digit}
                </div>
              ))}
            </div>
            <div className="text-xs text-green-500">ACTIVE</div>
          </div>
          <div className="text-xs text-green-700 mt-2">NEXT REPORT: 09:00 HOURS</div>
        </div>
      </div>
      
      {/* Current mission */}
      <div className="border border-green-900 bg-black/70 p-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-green-400">CURRENT DIRECTIVE</div>
            <div className="text-lg font-bold text-green-500">HOTEL INFILTRATION</div>
            <div className="text-xs text-green-700 mt-0.5">OPERATION RIVIERA • MISSION 2.4</div>
          </div>
          <div className="text-xs border border-yellow-900 bg-yellow-900/20 text-yellow-500 px-2 py-1">IN PROGRESS</div>
        </div>
        
        <div className="text-sm mb-4">
          Establish cover as Canadian film industry professional and secure accommodation at Grand Palais Hotel. Extract information on target's arrival schedule.
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <div className="text-green-400">MISSION READINESS</div>
            <div className="text-green-600">68%</div>
          </div>
          <div className="w-full h-1.5 bg-green-900/30">
            <div className="h-full bg-green-600" style={{ width: '68%' }}></div>
          </div>
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="text-xs text-green-400 mb-1">INTEL ACQUISITION</div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-green-700 flex items-center justify-center mr-3 bg-green-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-green-300 line-through">Acquire hotel layout</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-green-700 flex items-center justify-center mr-3 bg-green-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-green-300 line-through">Master reservation vocabulary</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-green-700 mr-3"></div>
            <div className="text-sm text-green-300">Develop room preference dialogue</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border border-green-700 mr-3"></div>
            <div className="text-sm text-green-300">Establish rapport with concierge</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-green-400">
            FIELD OPERATION AVAILABLE IN: <span className="text-green-300">2 EXERCISES</span>
          </div>
          <button className="bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 px-4 py-1.5 text-sm transition-colors">
            CONTINUE TRAINING
          </button>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="border border-green-900 bg-black/70 p-3">
        <div className="text-xs text-green-400 mb-2">SYSTEM NOTIFICATIONS</div>
        <div className="space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-2 border ${
                notification.type === 'warning' ? 'border-yellow-900 bg-yellow-900/10' : 
                notification.type === 'danger' ? 'border-red-900 bg-red-900/10' : 
                'border-green-900 bg-green-900/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className={`text-sm font-bold ${
                  notification.type === 'warning' ? 'text-yellow-500' : 
                  notification.type === 'danger' ? 'text-red-500' : 
                  'text-green-500'
                }`}>
                  {notification.text}
                </div>
                <div className="text-xs text-green-700">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-green-900 py-3 px-6 bg-black/90 backdrop-blur-sm flex justify-around">
        <div className="text-green-500 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-xs mt-1">TERMINAL</div>
        </div>
        <div className="text-green-800 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <div className="text-xs mt-1">NETWORK</div>
        </div>
        <div className="text-green-800 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <div className="text-xs mt-1">COMMS</div>
        </div>
        <div className="text-green-800 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <div className="text-xs mt-1">SETTINGS</div>
        </div>
      </div>
    </div>
  );
};

export default MainTerminal;