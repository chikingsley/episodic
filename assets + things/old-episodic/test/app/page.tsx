'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '../context/user-context';
import { motion, AnimatePresence } from 'motion/react';
import HQScreen from '../components/hq-screen';
import AgentAvatar from '../components/agent-avatar';

export default function Home() {
  const { isLoggedIn, login, userProgress } = useUser();
  const [agentCode, setAgentCode] = useState('');
  const [showIntro, setShowIntro] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSetupIntroRef = useRef(false);

  // Only run once on mount
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      // Clean up any lingering timers on unmount
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
    };
  }, []);

  // Setup intro animation only once after mount if not logged in
  useEffect(() => {
    // Skip if component is not mounted yet or if we've already set up the intro
    if (!isMounted || hasSetupIntroRef.current) return;
    
    // Only run intro animation for non-logged-in users
    if (!isLoggedIn) {
      hasSetupIntroRef.current = true;
      setShowIntro(true);
      
      introTimerRef.current = setTimeout(() => {
        setShowIntro(false);
        introTimerRef.current = null;
      }, 5000);
    }
  }, [isMounted, isLoggedIn]);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(agentCode || 'DARK MALLARD');
  };

  // Show the HQScreen if logged in
  if (isLoggedIn) {
    return <HQScreen />;
  }

  // Return loading state during server-side rendering
  if (!isMounted) {
    return <div className="flex h-screen items-center justify-center bg-gray-900"></div>;
  }

  // Render content based on intro state
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-900">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            className="absolute flex h-screen w-full flex-col items-center justify-center bg-black text-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-4 text-center text-4xl font-bold">EPISODE</div>
            <div className="text-center text-xl">Learning Languages Through Stories</div>
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            className="bg-black min-h-screen w-full text-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="max-w-md w-full">
                <div className="text-center mb-10">
                  <div className="inline-block w-20 h-20 rounded-full bg-red-900/40 border-2 border-red-800 mb-6">
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-2xl font-mono text-red-500 mb-2">AGENT VERIFICATION</h1>
                  <p className="text-sm text-gray-400 font-mono">Enter your agent codename to continue</p>
                </div>
                
                <motion.div 
                  className="bg-gray-900 border border-red-900 rounded-lg p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <form onSubmit={handleLogin}>
                    <div className="mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                          <AgentAvatar seed={agentCode || "DARK MALLARD"} size={80} />
                        </div>
                      </div>
                      
                      <label className="block text-xs font-mono text-gray-400 mb-2">CODENAME:</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white font-mono"
                        placeholder="DARK MALLARD"
                        value={agentCode}
                        onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      PROCEED TO MISSION HUB
                    </motion.button>
                  </form>
                </motion.div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 font-mono">SECURITY CLEARANCE LEVEL {userProgress.level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
