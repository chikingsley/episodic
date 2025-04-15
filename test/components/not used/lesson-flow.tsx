import { useState } from 'react';

// This component demonstrates the flow of a typical mission/lesson
// It doesn't represent actual functionality but shows the UI progression
const LessonFlowDemo = () => {
  const [currentScreen, setCurrentScreen] = useState('briefing');
  
  const nextScreen = () => {
    switch(currentScreen) {
      case 'briefing': setCurrentScreen('vocab'); break;
      case 'vocab': setCurrentScreen('practice'); break;
      case 'practice': setCurrentScreen('conversation'); break;
      case 'conversation': setCurrentScreen('challenge'); break;
      case 'challenge': setCurrentScreen('debrief'); break;
      case 'debrief': setCurrentScreen('briefing'); break; // Reset for demo
      default: setCurrentScreen('briefing');
    }
  };
  
  return (
    <div className="bg-black min-h-screen text-white">
      {currentScreen === 'briefing' && <MissionBriefing onNext={nextScreen} />}
      {currentScreen === 'vocab' && <VocabularyDrill onNext={nextScreen} />}
      {currentScreen === 'practice' && <PracticeDrill onNext={nextScreen} />}
      {currentScreen === 'conversation' && <ConversationSimulation onNext={nextScreen} />}
      {currentScreen === 'challenge' && <FinalChallenge onNext={nextScreen} />}
      {currentScreen === 'debrief' && <MissionDebrief onNext={nextScreen} />}
      
      <div className="fixed bottom-2 left-0 right-0 flex justify-center">
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'briefing' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'vocab' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'practice' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'conversation' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'challenge' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentScreen === 'debrief' ? 'bg-red-500' : 'bg-gray-700'}`}></div>
        </div>
      </div>
    </div>
  );
};

// 1. Mission Briefing Screen
const MissionBriefing = ({ onNext }) => {
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mr-2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          <h1 className="text-xl font-mono font-bold tracking-tight text-gray-200">MISSION BRIEFING</h1>
        </div>
        <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded-md">
          <span className="text-xs text-red-500 font-mono">MISSION 1.2</span>
        </div>
      </div>

      {/* Mission Brief */}
      <div className="bg-gray-900 border border-red-900 rounded-lg overflow-hidden mb-6">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-900/40 border border-red-800 flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono text-red-500">OPERATION</p>
              <h3 className="font-mono text-gray-200 text-lg">PERSONAL INTRODUCTIONS</h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 font-mono mb-4">
            AGENT DARK MALLARD: For this mission, you must master personal introductions in French. Your cover identity requires you to seamlessly integrate into social situations without raising suspicion.
          </p>
          
          <p className="text-sm text-gray-400 font-mono mb-4">
            Your training will include essential phrases for introducing yourself, stating your name, nationality, and occupation - all critical components of your cover identity.
          </p>
          
          <div className="border-t border-red-900/30 pt-4 mb-4">
            <h4 className="font-mono text-gray-300 text-sm mb-3">MISSION OBJECTIVES:</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400 font-mono">Master 4 key introduction phrases</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400 font-mono">Practice natural pronunciation to avoid detection</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400 font-mono">Complete a simulated social introduction scenario</span>
              </li>
            </ul>
          </div>
          
          <div className="flex items-center justify-between text-xs font-mono mb-4">
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
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
              <span className="text-gray-500">XP REWARD: </span>
              <span className="text-gray-300 ml-1">150 XP</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-red-900/30 bg-gray-900">
          <button 
            className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
            onClick={onNext}
          >
            BEGIN MISSION
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Vocabulary Drill Screen
const VocabularyDrill = ({ onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-800 h-1 rounded-full">
            <div className="bg-red-700 h-1 rounded-full w-2/6"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 font-mono">2/6</span>
            <span className="text-xs text-gray-500 font-mono">WEAPONS DRILL</span>
          </div>
        </div>
      </div>

      {/* Vocabulary Card */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-red-500 font-mono">NEW VOCABULARY</span>
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded">
            <span className="text-xs text-red-500 font-mono">ESSENTIAL</span>
          </div>
        </div>
        
        <h2 className="text-center text-3xl font-mono text-gray-200 mb-2">JE M'APPELLE</h2>
        <p className="text-center text-sm text-gray-400 font-mono mb-4">/ʒə ma.pɛl/</p>
        
        <div className="flex justify-center mb-6">
          <button className="w-12 h-12 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <path d="M12 2v20"></path>
              <path d="M17 5H7.5a2.5 2.5 0 0 0 0 5h9a2.5 2.5 0 0 1 0 5H7"></path>
            </svg>
          </button>
        </div>
        
        <p className="text-center font-mono text-gray-300 text-lg mb-8">MY NAME IS</p>
        
        <div className="border-t border-red-900/30 pt-4">
          <p className="text-xs text-gray-500 font-mono mb-3">EXAMPLE USAGE:</p>
          <p className="text-sm text-gray-400 font-mono">Je m'appelle Dark Mallard.</p>
          <p className="text-sm text-gray-500 font-mono italic">My name is Dark Mallard.</p>
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <h3 className="font-mono text-gray-300 text-base mb-3">SELECT THE CORRECT TRANSLATION:</h3>
        
        <div className="space-y-3">
          <button 
            className={`w-full p-4 font-mono text-left border rounded-lg ${
              selectedOption === 1 
                ? 'bg-green-900/30 border-green-800 text-green-500' 
                : 'bg-gray-900 border-gray-800 text-gray-400'
            }`}
            onClick={() => setSelectedOption(1)}
          >
            My name is
          </button>
          
          <button 
            className={`w-full p-4 font-mono text-left border rounded-lg ${
              selectedOption === 2 
                ? 'bg-red-900/30 border-red-800 text-red-500' 
                : 'bg-gray-900 border-gray-800 text-gray-400'
            }`}
            onClick={() => setSelectedOption(2)}
          >
            How are you?
          </button>
          
          <button 
            className={`w-full p-4 font-mono text-left border rounded-lg ${
              selectedOption === 3 
                ? 'bg-red-900/30 border-red-800 text-red-500' 
                : 'bg-gray-900 border-gray-800 text-gray-400'
            }`}
            onClick={() => setSelectedOption(3)}
          >
            I am from
          </button>
        </div>
      </div>
      
      <button 
        className={`w-full py-3 rounded-md font-mono text-white ${
          selectedOption 
            ? 'bg-red-800 hover:bg-red-700 transition-colors' 
            : 'bg-gray-800 opacity-50 cursor-not-allowed'
        }`}
        onClick={selectedOption ? onNext : undefined}
      >
        CONTINUE
      </button>
    </div>
  );
};

// 3. Practice Drill Screen
const PracticeDrill = ({ onNext }) => {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-800 h-1 rounded-full">
            <div className="bg-red-700 h-1 rounded-full w-3/6"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 font-mono">3/6</span>
            <span className="text-xs text-gray-500 font-mono">FIELD PRACTICE</span>
          </div>
        </div>
      </div>

      {/* Practice Card */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-red-500 font-mono">FIELD EXERCISE</span>
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded">
            <span className="text-xs text-red-500 font-mono">TRANSLATE</span>
          </div>
        </div>
        
        <p className="text-center font-mono text-gray-300 text-lg mb-8">Translate this phrase to French:</p>
        <p className="text-center text-2xl font-mono text-gray-200 mb-8">"My name is Dark Mallard."</p>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="TYPE TRANSLATION HERE"
            className="bg-gray-800 border border-gray-700 w-full pl-4 pr-10 py-3 rounded font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-900"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20"></path>
              <path d="M17 5H7.5a2.5 2.5 0 0 0 0 5h9a2.5 2.5 0 0 1 0 5H7"></path>
            </svg>
          </button>
        </div>
        
        <div className="border-t border-red-900/30 pt-4">
          <p className="text-xs text-gray-500 font-mono mb-3">MISSION TIP:</p>
          <p className="text-sm text-gray-400 font-mono">Remember to use the phrase "Je m'appelle" followed by your cover name.</p>
        </div>
      </div>
      
      <button 
        className={`w-full py-3 rounded-md font-mono text-white ${
          inputValue.length > 0
            ? 'bg-red-800 hover:bg-red-700 transition-colors' 
            : 'bg-gray-800 opacity-50 cursor-not-allowed'
        }`}
        onClick={inputValue.length > 0 ? onNext : undefined}
      >
        CHECK ANSWER
      </button>
    </div>
  );
};

// 4. Conversation Simulation Screen
const ConversationSimulation = ({ onNext }) => {
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-800 h-1 rounded-full">
            <div className="bg-red-700 h-1 rounded-full w-4/6"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 font-mono">4/6</span>
            <span className="text-xs text-gray-500 font-mono">FIELD COMMUNICATIONS</span>
          </div>
        </div>
      </div>

      {/* Conversation Simulation */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-red-500 font-mono">CONVERSATION SIMULATION</span>
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded">
            <span className="text-xs text-red-500 font-mono">LIVE EXERCISE</span>
          </div>
        </div>
        
        <div className="mb-4 relative">
          <div className="absolute left-4 top-0 -mt-2 w-16 h-2 bg-gray-900"></div>
          <div className="border-l-2 border-t-2 border-r-2 border-gray-700 rounded-t-md p-2">
            <p className="text-xs text-gray-500 font-mono">LOCATION: CAFÉ CENTRAL, CANNES</p>
          </div>
          <div className="border-2 border-gray-700 rounded-b-md p-4">
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-800 flex items-center justify-center overflow-hidden mr-3">
                <span className="text-lg">🧔</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-300 font-mono">Bonjour! Comment vous appelez-vous?</p>
                <p className="text-xs text-gray-500 font-mono mt-1 italic">Hello! What is your name?</p>
              </div>
            </div>
            
            <div className="flex justify-end mb-4">
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-300 font-mono">Je m'appelle Dark Mallard.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-900 border border-red-800 flex items-center justify-center overflow-hidden ml-3">
                <span className="text-lg">🦆</span>
              </div>
            </div>
            
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-800 flex items-center justify-center overflow-hidden mr-3">
                <span className="text-lg">🧔</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-300 font-mono">Enchanté, Dark Mallard. D'où venez-vous?</p>
                <p className="text-xs text-gray-500 font-mono mt-1 italic">Nice to meet you, Dark Mallard. Where are you from?</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-red-900/30 pt-4 mb-4">
          <p className="text-xs text-gray-500 font-mono mb-3">SELECT YOUR RESPONSE:</p>
          
          <div className="space-y-3">
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je m'appelle Dark Mallard.
            </button>
            
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je ne comprends pas.
            </button>
            
            <button className="w-full p-3 font-mono text-left bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:border-red-900 transition-colors">
              Je viens des États-Unis.
            </button>
          </div>
        </div>
      </div>
      
      <button 
        className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
        onClick={onNext}
      >
        CONTINUE SIMULATION
      </button>
    </div>
  );
};

// 5. Final Challenge Screen
const FinalChallenge = ({ onNext }) => {
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-800 h-1 rounded-full">
            <div className="bg-red-700 h-1 rounded-full w-5/6"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 font-mono">5/6</span>
            <span className="text-xs text-gray-500 font-mono">FINAL CHALLENGE</span>
          </div>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-gray-900 border border-red-900 rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-red-500 font-mono">MISSION CRITICAL</span>
          <div className="px-2 py-1 bg-red-900/30 border border-red-800 rounded">
            <span className="text-xs text-red-500 font-mono">FIELD ASSESSMENT</span>
          </div>
        </div>
        
        <h2 className="text-center text-xl font-mono text-gray-200 mb-6">SPEAKING CHALLENGE</h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-900/30 border border-red-800 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <path d="M12 2v20"></path>
              <path d="M17 5H7.5a2.5 2.5 0 0 0 0 5h9a2.5 2.5 0 0 1 0 5H7"></path>
            </svg>
          </div>
          
          <p className="text-center text-sm text-gray-400 font-mono mb-6">
            Record yourself introducing in French:<br />
            - Your name<br />
            - Where you're from<br />
            - Your occupation
          </p>
          
          <div className="w-full bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center mr-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                </svg>
              </div>
              <div className="flex-1">
                <div className="w-full h-1 bg-gray-700 rounded-full">
                  <div className="w-0 h-1 bg-red-700 rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 font-mono">0:00</span>
                  <span className="text-xs text-gray-500 font-mono">0:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-red-900/30 pt-4">
          <p className="text-xs text-gray-500 font-mono mb-3">ASSESSMENT CRITERIA:</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
              <span className="text-xs text-gray-400 font-mono">Pronunciation accuracy</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
              <span className="text-xs text-gray-400 font-mono">Proper vocabulary usage</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
              <span className="text-xs text-gray-400 font-mono">Fluency and natural delivery</span>
            </li>
          </ul>
        </div>
      </div>
      
      <button 
        className="w-full bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
        onClick={onNext}
      >
        SUBMIT RECORDING
      </button>
    </div>
  );
};

// 6. Mission Debrief Screen
const MissionDebrief = ({ onNext }) => {
  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-800 h-1 rounded-full">
            <div className="bg-red-700 h-1 rounded-full w-full"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500 font-mono">6/6</span>
            <span className="text-xs text-gray-500 font-mono">MISSION DEBRIEF</span>
          </div>
        </div>
      </div>

      {/* Mission Complete Card */}
      <div className="bg-gray-900 border border-green-800 rounded-lg p-5 mb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-900/30 border border-green-800 flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h2 className="text-center text-2xl font-mono text-gray-200 mb-2">MISSION ACCOMPLISHED</h2>
          <p className="text-center text-sm text-gray-400 font-mono mb-6">
            You have successfully completed the Personal Introductions mission.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-gray-300">MISSION SCORE</span>
              <span className="text-lg font-mono text-green-500">87%</span>
            </div>
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div className="bg-green-700 h-2 rounded-full w-[87%]"></div>
            </div>
          </div>
          
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M12 20V10"></path>
                  <path d="M18 20V4"></path>
                  <path d="M6 20v-4"></path>
                </svg>
              </div>
              <span className="text-xs font-mono text-gray-400">XP EARNED</span>
              <span className="text-lg font-mono text-gray-200">150</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="text-xs font-mono text-gray-400">WORDS MASTERED</span>
              <span className="text-lg font-mono text-gray-200">4</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <span className="text-xs font-mono text-gray-400">STREAK</span>
              <span className="text-lg font-mono text-gray-200">1 DAY</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-800/30 pt-4 mb-4">
          <p className="text-xs text-gray-500 font-mono mb-3">AGENT FEEDBACK:</p>
          <p className="text-sm text-gray-400 font-mono mb-3">
            Your cover identity is taking shape. You've mastered the basics of personal introductions in French. Pronunciation requires further refinement to avoid detection during extended interactions.
          </p>
          <p className="text-sm text-gray-400 font-mono">
            NEXT MISSION: "Casual Conversations" will be unlocked once you've completed today's training objectives.
          </p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button 
          className="flex-1 bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors py-3 rounded-md font-mono text-gray-300"
        >
          REVIEW LESSON
        </button>
        
        <button 
          className="flex-1 bg-red-800 hover:bg-red-700 transition-colors py-3 rounded-md font-mono text-white"
          onClick={onNext}
        >
          RETURN TO HQ
        </button>
      </div>
    </div>
  );
};

export default LessonFlowDemo;