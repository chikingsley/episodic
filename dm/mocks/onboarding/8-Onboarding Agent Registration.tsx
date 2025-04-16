import React, { useState, useEffect } from 'react';

const AgentRegistrationScreen = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [codename, setCodename] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Scanning animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(scanInterval);
  }, []);
  
  // Handle registration submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistrationComplete(true);
    
    // Auto proceed after confirmation
    setTimeout(() => {
      window.location.href = '#mission-control';
    }, 2000);
  };
  
  return (
    <div id="agent-registration" className="relative flex flex-col items-center justify-start w-full min-h-screen bg-black overflow-hidden font-mono py-16">
      {/* Background grid and effects */}
      <div className="absolute inset-0 overflow-hidden">
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
      
      {/* Header */}
      <div className="z-10 flex flex-col items-center mb-8">
        <div className="text-red-600 text-xl font-bold mb-2 tracking-wide">
          ESTABLISH SECURE COMMUNICATION
        </div>
        <div className="text-gray-400 text-sm text-center max-w-md px-4">
          ENCRYPTION KEY CREATION REQUIRED
        </div>
      </div>
      
      {/* Main content */}
      <div className="z-10 w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="border-2 border-red-800/30 bg-black/70 p-6">
          {/* Email field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
              COMMUNICATION CHANNEL (EMAIL)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-gray-700 text-gray-300 px-3 py-2 focus:border-red-700 focus:outline-none"
              placeholder="agent@example.com"
            />
          </div>
          
          {/* Password field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
              ACCESS PROTOCOL (PASSWORD)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-gray-700 text-gray-300 px-3 py-2 focus:border-red-700 focus:outline-none"
              placeholder="••••••••••••"
            />
            <div className="text-gray-600 text-xs mt-1">
              MINIMUM 8 CHARACTERS, ALPHANUMERIC WITH SPECIAL CHARACTERS
            </div>
          </div>
          
          {/* Age verification field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="age">
              SECURITY CLEARANCE VERIFICATION (AGE)
            </label>
            <input
              id="age"
              type="number"
              min="13"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full bg-black border border-gray-700 text-gray-300 px-3 py-2 focus:border-red-700 focus:outline-none"
              placeholder="Enter your age"
            />
          </div>
          
          {/* Codename field (optional) */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="codename">
              FIELD OPERATIVE DESIGNATION (OPTIONAL)
            </label>
            <input
              id="codename"
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              className="w-full bg-black border border-gray-700 text-gray-300 px-3 py-2 focus:border-red-700 focus:outline-none"
              placeholder="Agent codename"
            />
          </div>
          
          {/* Auth options */}
          <div className="mb-6">
            <div className="text-gray-400 text-sm mb-3">ALTERNATIVE AUTHENTICATION METHODS</div>
            
            <div className="space-y-2">
              <button
                type="button"
                className="w-full border border-gray-700 text-gray-300 px-4 py-2 flex items-center justify-center hover:bg-gray-900 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                CONNECT WITH GOOGLE
              </button>
              
              <button
                type="button"
                className="w-full border border-gray-700 text-gray-300 px-4 py-2 flex items-center justify-center hover:bg-gray-900 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.25 10.48L10.5 17.5l-2-1.5v-3.5L12.25 9l1.5.5-2 2.75z"
                  />
                </svg>
                CONNECT WITH APPLE
              </button>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="border-2 border-red-800 px-8 py-3 text-red-600 font-bold tracking-wide hover:bg-red-800 hover:text-white transition-colors duration-300"
            >
              SECURE AUTHENTICATION
            </button>
          </div>
          
          {/* Terms */}
          <div className="mt-4 text-gray-500 text-xs text-center">
            By proceeding, you acknowledge acceptance of our operational protocols and data handling practices as outlined in the Network Security Directive.
          </div>
        </form>
        
        {/* Have account link */}
        <div className="mt-4 text-center">
          <a href="#mission-control" className="text-gray-400 hover:text-red-600 text-sm">
            EXISTING OPERATIVE? ACCESS YOUR ACCOUNT
          </a>
        </div>
        
        {/* Confirmation message */}
        <div className={`mt-6 text-center transition-opacity duration-500 ${registrationComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-green-500 animate-pulse">
            AGENT CREDENTIALS SECURED. PREPARING MISSION CONTROL...
          </div>
        </div>
      </div>
      
      {/* File classification stamp */}
      <div className="absolute top-5 right-5 rotate-12 opacity-8 select-none z-20">
        <div className="border-2 border-red-700 px-6 py-2">
          <div className="text-red-700 font-mono text-lg font-bold">CONFIDENTIAL</div>
        </div>
      </div>
      
      {/* Corner decorative elements */}
      <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-800/40 w-16 h-16" />
      <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-800/40 w-16 h-16" />
      
      {/* Footer */}
      <div className="absolute bottom-5 font-mono text-gray-600 text-xs flex flex-col items-center">
        <div>ENCRYPTION: AES-256-GCM</div>
        <div className="mt-1 text-gray-500">SECURE CHANNEL: ESTABLISHED</div>
      </div>
    </div>
  );
};

export default AgentRegistrationScreen;