import React, { useState, useEffect } from 'react';

const CommunicationsIntercept = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [phase, setPhase] = useState('brief'); // 'brief', 'listen', 'respond', 'analyze'
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [recording, setRecording] = useState(false);
  const [responseQuality, setResponseQuality] = useState(null); // null, 'poor', 'acceptable', 'excellent'
  const [waveformPoints, setWaveformPoints] = useState([]);
  const [responseWaveform, setResponseWaveform] = useState([]);
  
  // Mock intercept data
  const interceptData = {
    title: "CAFÉ RECONNAISSANCE",
    missionCode: "FR-R2-M3",
    location: "Café de la Paix, Cannes",
    objectives: [
      "Master café ordering vocabulary",
      "Practice natural pronunciation",
      "Comprehend native response variations"
    ],
    characters: [
      { name: "WAITER", description: "Local café staff, 40s, no known agency connections" },
      { name: "AGENT", description: "Your cover identity as Canadian film industry professional" }
    ],
    transcript: [
      { speaker: "NARRATOR", text: "You approach the café counter. The waiter greets you." },
      { speaker: "WAITER", text: "Bonjour monsieur, je peux vous aider?" },
      { speaker: "AGENT", text: "[You will respond to order a coffee]" },
      { speaker: "WAITER", text: "Un café, bien sûr. Vous désirez autre chose?" },
      { speaker: "AGENT", text: "[You will respond to ask for the menu]" },
      { speaker: "WAITER", text: "Voici la carte, monsieur. Prenez votre temps." }
    ],
    vocabulary: [
      { term: "Bonjour", translation: "Hello", level: "A1" },
      { term: "Je peux vous aider", translation: "Can I help you?", level: "A1" },
      { term: "Un café", translation: "A coffee", level: "A1" },
      { term: "Bien sûr", translation: "Of course", level: "A1" },
      { term: "Vous désirez autre chose", translation: "Would you like anything else?", level: "A2" },
      { term: "La carte", translation: "The menu", level: "A1" },
      { term: "Prenez votre temps", translation: "Take your time", level: "A2" }
    ],
    expectedResponses: [
      {
        prompt: "Order a coffee",
        example: "Je voudrais un café, s'il vous plaît.",
        keyPhrases: ["café", "s'il vous plaît", "voudrais", "commander"]
      },
      {
        prompt: "Ask for the menu",
        example: "Je peux voir la carte, s'il vous plaît?",
        keyPhrases: ["carte", "menu", "voir", "avoir"]
      }
    ],
    currentPrompt: 0 // Index of the current expected response
  };

  // Scanline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev + 1) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Audio playback simulation
  useEffect(() => {
    let interval;
    if (audioPlaying && phase === 'listen') {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setAudioPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [audioPlaying, phase]);

  // Simulated waveform generator
  useEffect(() => {
    const generatePoints = () => {
      const points = [];
      for (let i = 0; i < 100; i++) {
        const height = Math.sin(i * 0.2) * Math.random() * 20 + 25;
        points.push(height);
      }
      return points;
    };

    setWaveformPoints(generatePoints());
    
    // Refresh points periodically when playing
    const interval = setInterval(() => {
      if (audioPlaying) {
        setWaveformPoints(generatePoints());
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [audioPlaying]);

  // Simulated response waveform
  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        const points = [];
        for (let i = 0; i < 60; i++) {
          // More varied waveform for speech
          const height = Math.sin(i * 0.3) * Math.random() * 30 + 15;
          points.push(height);
        }
        setResponseWaveform(points);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [recording]);

  // Handle play/pause
  const togglePlayback = () => {
    if (audioProgress >= 100) {
      setAudioProgress(0);
    }
    setAudioPlaying(!audioPlaying);
  };

  // Handle recording
  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      // Simulate recording for 3 seconds then evaluation
      setTimeout(() => {
        setRecording(false);
        // Random evaluation result for demo
        const results = ['poor', 'acceptable', 'excellent'];
        setResponseQuality(results[Math.floor(Math.random() * results.length)]);
      }, 3000);
    }
  };

  // Handle phase advancement
  const advancePhase = () => {
    switch(phase) {
      case 'brief':
        setPhase('listen');
        break;
      case 'listen':
        setPhase('respond');
        break;
      case 'respond':
        setPhase('analyze');
        break;
      case 'analyze':
        // In a real app, this would move to the next intercept
        // For demo purposes, we reset to brief
        setPhase('brief');
        setAudioProgress(0);
        setResponseQuality(null);
        break;
      default:
        setPhase('brief');
    }
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
            COMMS INTERCEPT
          </div>
          <div className="ml-4 text-xs text-green-400">{interceptData.missionCode}</div>
        </div>
        
        <div className="flex items-center">
          <div className="text-xs text-green-400 mr-4">COVER INTEGRITY: 83%</div>
          <div className={`text-xs border px-2 py-1 ${
            phase === 'brief' ? 'border-blue-800 bg-blue-900/20 text-blue-500' :
            phase === 'listen' ? 'border-yellow-800 bg-yellow-900/20 text-yellow-500' :
            phase === 'respond' ? 'border-orange-800 bg-orange-900/20 text-orange-500' :
            'border-green-800 bg-green-900/20 text-green-500'
          }`}>
            {phase === 'brief' ? 'BRIEFING' :
             phase === 'listen' ? 'LISTENING' :
             phase === 'respond' ? 'RESPONDING' : 'ANALYSIS'
            }
          </div>
        </div>
      </div>
      
      <div className="flex h-full">
        {/* Left panel - Intercept visualization */}
        <div className="flex-1 border border-green-900 mr-4 flex flex-col overflow-hidden">
          {/* Mission title */}
          <div className="border-b border-green-900 p-3">
            <div className="text-lg font-bold text-green-500">{interceptData.title}</div>
            <div className="text-xs text-green-700 mt-1">LOCATION: {interceptData.location}</div>
          </div>
          
          {/* Main content area - changes based on phase */}
          <div className="flex-1 p-4 overflow-auto">
            {/* Briefing Phase */}
            {phase === 'brief' && (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <div className="text-xs text-green-400 mb-2">MISSION OBJECTIVES</div>
                  <div className="space-y-1 pl-4">
                    {interceptData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <div className="text-green-700 mr-2">•</div>
                        <div className="text-sm text-green-300">{objective}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-xs text-green-400 mb-2">FIELD PERSONNEL</div>
                  <div className="space-y-3">
                    {interceptData.characters.map((character, index) => (
                      <div key={index} className="border border-green-900 bg-green-900/10 p-2">
                        <div className="text-sm font-bold text-green-500">{character.name}</div>
                        <div className="text-xs text-green-400 mt-1">{character.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-xs text-green-400 mb-2">INTELLIGENCE FOCUS</div>
                  <div className="border border-green-900 bg-green-900/10 p-3">
                    <div className="text-sm mb-2">Required vocabulary for this mission:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {interceptData.vocabulary.slice(0, 4).map((item, index) => (
                        <div key={index} className="text-xs border border-green-900 p-1">
                          <span className="text-green-300">{item.term}</span>
                          <span className="text-green-700 ml-1">({item.level})</span>
                          <div className="text-green-500 text-opacity-80">{item.translation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto border-t border-green-900 pt-4">
                  <div className="text-xs text-green-400 mb-2">MISSION PROTOCOL</div>
                  <div className="text-sm text-green-300">
                    You will first listen to intercepted communication, then respond verbally. 
                    Your responses will be analyzed for linguistic accuracy and cover integrity.
                  </div>
                </div>
              </div>
            )}
            
            {/* Listening Phase */}
            {phase === 'listen' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                  {/* Audio visualization area */}
                  <div className="border border-green-900 bg-black p-4 mb-4 flex-1 flex flex-col">
                    <div className="text-center mb-4">
                      <div className="text-xs text-green-400 mb-1">INTERCEPTED COMMUNICATION</div>
                      <div className="text-lg font-bold text-green-500">
                        {interceptData.title} - SEGMENT 1
                      </div>
                    </div>
                    
                    {/* Location visualization - simulated satellite view */}
                    <div className="relative h-48 mb-4 overflow-hidden">
                      <div className="absolute inset-0 border border-green-900">
                        {/* This would be a real image in production */}
                        <div className="w-full h-full bg-green-900/10 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-green-700 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="text-green-500">CAFÉ DE LA PAIX</div>
                            <div className="text-green-700 text-xs">43.551°N, 7.011°E</div>
                          </div>
                        </div>
                        
                        {/* Overlay elements */}
                        <div className="absolute top-2 left-2 text-xs text-green-700">
                          SAT-VIEW-04
                        </div>
                        <div className="absolute top-2 right-2 text-xs text-green-700">
                          ZOOM: 250m
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs text-green-700">
                          TIME: 14:32 LOCAL
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio waveform visualization */}
                    <div className="relative h-20 border border-green-900 bg-black">
                      <div className="absolute inset-0 flex items-center px-4">
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                          {waveformPoints.map((height, index) => (
                            <rect
                              key={index}
                              x={index}
                              y={25 - height/2}
                              width="0.5"
                              height={height}
                              className={index/100 <= audioProgress/100 ? 'fill-green-500' : 'fill-green-900'}
                            />
                          ))}
                        </svg>
                      </div>
                      
                      {/* Playback position indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                        style={{ 
                          left: `${audioProgress}%`, 
                          display: audioProgress > 0 ? 'block' : 'none'
                        }}
                      />
                      
                      <div className="absolute bottom-2 right-2 text-xs text-green-700">
                        {Math.floor(audioProgress/100 * 35)}s / 35s
                      </div>
                    </div>
                  </div>
                  
                  {/* Transcript section */}
                  <div className="border border-green-900 bg-black p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-green-400">LIVE TRANSCRIPT</div>
                      <button 
                        className="text-xs text-green-700 hover:text-green-500"
                        onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                      >
                        {transcriptExpanded ? 'COLLAPSE' : 'EXPAND'}
                      </button>
                    </div>
                    
                    <div className={`space-y-2 overflow-y-auto ${transcriptExpanded ? 'h-40' : 'h-20'}`}>
                      {interceptData.transcript.slice(0, audioProgress > 30 ? 3 : audioProgress > 60 ? 4 : audioProgress > 90 ? 6 : 2).map((line, index) => (
                        <div key={index} className="flex">
                          <div className="text-xs text-green-700 w-20 flex-shrink-0">
                            {line.speaker}:
                          </div>
                          <div className="text-sm text-green-300 flex-1">
                            {line.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Audio controls */}
                <div className="mt-4 border-t border-green-900 pt-4 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button 
                      className="bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 h-10 w-10 flex items-center justify-center"
                      onClick={togglePlayback}
                    >
                      {audioPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      className="bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 h-10 w-10 flex items-center justify-center"
                      onClick={() => {
                        setAudioProgress(0);
                        setAudioPlaying(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                    
                    <div className="text-xs text-green-700 self-center">
                      SPEED: 1.0x
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-xs text-green-700 mr-2">
                      COMPLETION:
                    </div>
                    <div className="w-32 h-2 bg-green-900/30">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Responding Phase */}
            {phase === 'respond' && (
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  {/* Response prompt */}
                  <div className="border border-green-900 bg-black p-4 mb-4">
                    <div className="text-center mb-4">
                      <div className="text-xs text-green-400 mb-1">COMMUNICATION RESPONSE</div>
                      <div className="text-lg font-bold text-green-500">
                        MAINTAIN COVER IDENTITY
                      </div>
                    </div>
                    
                    <div className="border border-green-900 bg-green-900/10 p-3 mb-4">
                      <div className="text-xs text-green-400 mb-2">SCENARIO CONTEXT</div>
                      <div className="text-sm text-green-300">
                        The waiter has greeted you at the café counter. He has asked if he can help you.
                      </div>
                    </div>
                    
                    <div className="border border-yellow-900 bg-yellow-900/10 p-3">
                      <div className="text-xs text-yellow-500 mb-2">YOUR OBJECTIVE</div>
                      <div className="text-sm text-yellow-300 font-bold">
                        {interceptData.expectedResponses[interceptData.currentPrompt].prompt}
                      </div>
                      <div className="text-xs text-yellow-700 mt-2">
                        Use appropriate vocabulary and natural pronunciation
                      </div>
                    </div>
                  </div>
                  
                  {/* Response interface */}
                  <div className="border border-green-900 bg-black p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs text-green-400">VOICE RESPONSE SYSTEM</div>
                      <div className={`text-xs ${recording ? 'text-red-500 animate-pulse' : 'text-green-700'}`}>
                        {recording ? 'RECORDING...' : 'READY'}
                      </div>
                    </div>
                    
                    {/* Voice visualization */}
                    <div className="relative h-24 border border-green-900 bg-black mb-4 flex items-center justify-center">
                      {recording ? (
                        <div className="absolute inset-0 flex items-center px-4">
                          <svg viewBox="0 0 60 50" className="w-full h-full">
                            {responseWaveform.map((height, index) => (
                              <rect
                                key={index}
                                x={index}
                                y={25 - height/2}
                                width="0.7"
                                height={height}
                                className="fill-red-500"
                              />
                            ))}
                          </svg>
                        </div>
                      ) : responseQuality ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className={`text-2xl font-bold mb-2 ${
                            responseQuality === 'excellent' ? 'text-green-500' :
                            responseQuality === 'acceptable' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {responseQuality === 'excellent' ? 'EXCELLENT' :
                             responseQuality === 'acceptable' ? 'ACCEPTABLE' :
                             'NEEDS IMPROVEMENT'}
                          </div>
                          <div className="text-sm text-green-700">
                            Tap mic to try again or continue to analysis
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-green-700">
                          <div className="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <div className="text-sm">
                            Press the microphone button to respond
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-green-700">
                        COVER INTEGRITY IMPACT: 
                        {responseQuality === 'excellent' ? ' +5%' :
                         responseQuality === 'acceptable' ? ' +0%' :
                         responseQuality === 'poor' ? ' -10%' : ' PENDING'}
                      </div>
                      <button 
                        className={`h-12 w-12 rounded-full flex items-center justify-center border ${
                          recording ? 
                            'border-red-900 bg-red-900/30 text-red-500' : 
                            'border-green-900 bg-green-900/30 text-green-500 hover:bg-green-900/50'
                        }`}
                        onClick={toggleRecording}
                        disabled={recording}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Example response (collapsed by default) */}
                  <div className="border border-green-900 bg-black p-3">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                    >
                      <div className="text-xs text-green-400">EXAMPLE RESPONSE</div>
                      <div className="text-xs text-green-700">
                        {transcriptExpanded ? 'HIDE' : 'SHOW'}
                      </div>
                    </button>
                    
                    {transcriptExpanded && (
                      <div className="mt-2 p-2 border border-green-900 bg-green-900/10">
                        <div className="text-sm text-green-300">
                          {interceptData.expectedResponses[interceptData.currentPrompt].example}
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          Key phrases: {interceptData.expectedResponses[interceptData.currentPrompt].keyPhrases.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="mt-4 border-t border-green-900 pt-4 flex justify-between">
                  <button 
                    className="bg-blue-900/30 hover:bg-blue-900/50 border border-blue-900 text-blue-500 px-4 py-1.5 text-sm transition-colors"
                    onClick={() => {
                      setResponseQuality(null);
                      setPhase('listen');
                    }}
                  >
                    LISTEN AGAIN
                  </button>
                  
                  <button 
                    className={`bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 px-4 py-1.5 text-sm transition-colors ${!responseQuality && 'opacity-50 cursor-not-allowed'}`}
                    onClick={advancePhase}
                    disabled={!responseQuality}
                  >
                    CONTINUE TO ANALYSIS
                  </button>
                </div>
              </div>
            )}
            
            {/* Analysis Phase */}
            {phase === 'analyze' && (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <div className="text-xs text-green-400 mb-1">MISSION PERFORMANCE</div>
                    <div className="text-lg font-bold text-green-500">
                      COMMUNICATION ANALYSIS
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border border-green-900 bg-black p-3">
                      <div className="text-xs text-green-400 mb-2">VOCABULARY USAGE</div>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-bold">
                          {responseQuality === 'excellent' ? '92%' :
                           responseQuality === 'acceptable' ? '74%' : '45%'}
                        </div>
                        <div className={`text-xs ${
                          responseQuality === 'excellent' ? 'text-green-500' :
                          responseQuality === 'acceptable' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {responseQuality === 'excellent' ? 'ADVANCED' :
                           responseQuality === 'acceptable' ? 'PROFICIENT' :
                           'BASIC'}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-green-900/30 mt-2">
                        <div 
                          className={`h-full ${
                            responseQuality === 'excellent' ? 'bg-green-500' :
                            responseQuality === 'acceptable' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ 
                            width: responseQuality === 'excellent' ? '92%' :
                                 responseQuality === 'acceptable' ? '74%' : '45%'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="border border-green-900 bg-black p-3">
                      <div className="text-xs text-green-400 mb-2">PRONUNCIATION</div>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-bold">
                          {responseQuality === 'excellent' ? '88%' :
                           responseQuality === 'acceptable' ? '71%' : '52%'}
                        </div>
                        <div className={`text-xs ${
                          responseQuality === 'excellent' ? 'text-green-500' :
                          responseQuality === 'acceptable' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {responseQuality === 'excellent' ? 'NATURAL' :
                           responseQuality === 'acceptable' ? 'CLEAR' :
                           'FOREIGN ACCENT'}
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-green-900/30 mt-2">
                        <div 
                          className={`h-full ${
                            responseQuality === 'excellent' ? 'bg-green-500' :
                            responseQuality === 'acceptable' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ 
                            width: responseQuality === 'excellent' ? '88%' :
                                  responseQuality === 'acceptable' ? '71%' : '52%'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-green-900 bg-black p-4 mb-4">
                    <div className="text-xs text-green-400 mb-2">RESPONSE EVALUATION</div>
                    <div className="border-l-2 border-l-green-900 pl-3 mb-3">
                      <div className="text-sm text-green-300">
                        "{interceptData.transcript[2].text.replace('[You will respond to order a coffee]', 
                          responseQuality === 'excellent' ? 'Je voudrais un café, s\'il vous plaît.' :
                          responseQuality === 'acceptable' ? 'Un café, s\'il vous plaît.' :
                          'Je veux café.'
                        )}"
                      </div>
                      <div className="text-xs text-green-700 mt-1">Your response</div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start">
                        <div className={`text-xs mr-2 mt-0.5 ${
                          responseQuality === 'excellent' ? 'text-green-500' :
                          responseQuality === 'acceptable' ? 'text-green-500' :
                          'text-red-500'
                        }`}>
                          {responseQuality === 'excellent' || responseQuality === 'acceptable' ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-green-300">
                          {responseQuality === 'excellent' ? 'Used polite form "voudrais" (would like)' :
                           responseQuality === 'acceptable' ? 'Used basic but correct phrasing' :
                           'Missing polite form and "s\'il vous plaît"'}
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={`text-xs mr-2 mt-0.5 ${
                          responseQuality === 'excellent' ? 'text-green-500' :
                          responseQuality === 'acceptable' ? 'text-green-500' :
                          'text-yellow-500'
                        }`}>
                          {responseQuality === 'excellent' || responseQuality === 'acceptable' ? '✓' : '⚠'}
                        </div>
                        <div className="text-sm text-green-300">
                          {responseQuality === 'excellent' || responseQuality === 'acceptable' ? 
                            'Correct article usage ("un café")' :
                            'Missing article before "café"'}
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className={`text-xs mr-2 mt-0.5 ${
                          responseQuality === 'excellent' ? 'text-green-500' :
                          responseQuality === 'acceptable' ? 'text-green-500' :
                          'text-red-500'
                        }`}>
                          {responseQuality === 'excellent' || responseQuality === 'acceptable' ? '✓' : '✗'}
                        </div>
                        <div className="text-sm text-green-300">
                          {responseQuality === 'excellent' || responseQuality === 'acceptable' ? 
                            'Included politeness marker "s\'il vous plaît"' :
                            'Missing politeness marker'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-green-400 mt-4 mb-2">COVER INTEGRITY IMPACT</div>
                    <div className="flex items-center">
                      <div className={`text-sm font-bold ${
                        responseQuality === 'excellent' ? 'text-green-500' :
                        responseQuality === 'acceptable' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {responseQuality === 'excellent' ? '+5%' :
                         responseQuality === 'acceptable' ? '±0%' :
                         '-10%'}
                      </div>
                      <div className="text-xs text-green-700 ml-2">
                        {responseQuality === 'excellent' ? 'Cover enhanced, perceived as fluent speaker' :
                         responseQuality === 'acceptable' ? 'Cover maintained, perceived as tourist' :
                         'Cover degraded, identified as non-French speaker'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-green-900 bg-black p-3">
                    <div className="text-xs text-green-400 mb-2">EQUIPMENT ASSEMBLY PROGRESS</div>
                    
                    <div className="relative h-16 border border-green-900 bg-green-900/10 mb-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          {/* This would be actual equipment graphics in production */}
                          <div className="h-10 w-10 border border-green-500 bg-black flex items-center justify-center">
                            <div className="text-green-500 text-xs">BASE</div>
                          </div>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          
                          <div className="h-10 w-10 border border-green-500 bg-black flex items-center justify-center">
                            <div className="text-green-500 text-xs">MIC</div>
                          </div>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          
                          <div className="h-10 w-10 border border-green-700 bg-black flex items-center justify-center">
                            <div className="text-green-700 text-xs">LENS</div>
                          </div>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          
                          <div className="h-10 w-10 border border-gray-700 bg-black flex items-center justify-center">
                            <div className="text-gray-700 text-xs">COMM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-green-700">FIELD CAMERA: 2/4 COMPONENTS</div>
                      <div className="text-green-500">50% COMPLETE</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1"></div>
                
                {/* Action buttons */}
                <div className="mt-4 border-t border-green-900 pt-4 flex justify-end">
                  <button 
                    className="bg-green-900/30 hover:bg-green-900/50 border border-green-900 text-green-500 px-4 py-1.5 text-sm transition-colors"
                    onClick={advancePhase}
                  >
                    CONTINUE TRAINING
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right panel - Vocabulary and tools */}
        <div className="w-72 border border-green-900 bg-black/70 flex flex-col">
          <div className="border-b border-green-900 p-3">
            <div className="text-lg font-bold text-green-500">INTELLIGENCE DATA</div>
            <div className="text-xs text-green-700 mt-1">MISSION VOCABULARY & TOOLS</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {/* Key vocabulary section */}
            <div className="mb-4">
              <div className="text-xs text-green-400 mb-2">KEY VOCABULARY</div>
              <div className="space-y-2">
                {interceptData.vocabulary.map((vocab, index) => (
                  <div key={index} className="border border-green-900 bg-green-900/10 p-2">
                    <div className="flex justify-between">
                      <div className="font-bold text-green-500">{vocab.term}</div>
                      <div className="text-xs text-green-700">{vocab.level}</div>
                    </div>
                    <div className="text-sm text-green-300">{vocab.translation}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tools */}
            <div>
              <div className="text-xs text-green-400 mb-2">FIELD TOOLS</div>
              <div className="space-y-2">
                <button className="w-full border border-green-900 bg-green-900/10 p-2 text-left hover:bg-green-900/20">
                  <div className="text-sm text-green-500">Audio Playback Tool</div>
                  <div className="text-xs text-green-700">Listen to individual phrases</div>
                </button>
                
                <button className="w-full border border-green-900 bg-green-900/10 p-2 text-left hover:bg-green-900/20">
                  <div className="text-sm text-green-500">Pronunciation Analyzer</div>
                  <div className="text-xs text-green-700">Compare your speech to native</div>
                </button>
                
                <button className="w-full border border-green-900 bg-green-900/10 p-2 text-left hover:bg-green-900/20">
                  <div className="text-sm text-green-500">Translation Matrix</div>
                  <div className="text-xs text-green-700">Analyze sentence structure</div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-900 p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-green-400">COVER INTEGRITY</div>
              <div className="text-xs text-green-700">
                {responseQuality === 'excellent' ? '88%' :
                 responseQuality === 'acceptable' ? '83%' :
                 responseQuality === 'poor' ? '73%' : '83%'}
              </div>
            </div>
            <div className="w-full h-1.5 bg-green-900/30">
              <div 
                className={`h-full ${
                  (responseQuality === 'excellent' || !responseQuality) ? 'bg-green-500' :
                  responseQuality === 'acceptable' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`}
                style={{ width: responseQuality === 'excellent' ? '88%' :
                               responseQuality === 'acceptable' ? '83%' :
                               responseQuality === 'poor' ? '73%' : '83%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsIntercept;