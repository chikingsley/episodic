'use client';

import { useState } from 'react';
import HQScreen from '../components/hq-screen';
import IntelScreen from '../components/intel-screen';
import ProfileScreen from '../components/settings-screen';
// import LessonFlowDemo from '../components/lesson-flow';

// Mission Control might need to be imported from a different path
// Approximate path based on the outline
import MissionControlScreen from '../components/mission-control-screen';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('hq');
  // Uncomment when lesson flow is implemented
  // const [showLessonFlow, setShowLessonFlow] = useState(false);

  // Render the active screen based on tab selection
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'hq':
        return <HQScreen />;
      case 'intel':
        return <IntelScreen />;
      case 'mission':
        return <MissionControlScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HQScreen />;
    }
  };

  return (
    <main className="bg-black min-h-screen text-white relative">
      {/* Main Content Area */}
      <div className="pb-16"> {/* Extra padding to account for the bottom tab bar */}
        {renderActiveScreen()}
      </div>

      {/* Bottom Tab Navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-red-900 p-2">
        <div className="flex justify-around">
          {/* HQ Tab */}
          <div 
            className="flex flex-col items-center cursor-pointer" 
            onClick={() => setActiveTab('hq')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              className={activeTab === 'hq' ? "text-red-500" : "text-gray-600"}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className={`text-xs font-mono ${activeTab === 'hq' ? "text-red-500" : "text-gray-600"}`}>HQ</span>
          </div>

          {/* Intel Tab */}
          <div 
            className="flex flex-col items-center cursor-pointer" 
            onClick={() => setActiveTab('intel')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              className={activeTab === 'intel' ? "text-red-500" : "text-gray-600"}>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            <span className={`text-xs font-mono ${activeTab === 'intel' ? "text-red-500" : "text-gray-600"}`}>INTEL</span>
          </div>

          {/* Mission Control Tab */}
          <div 
            className="flex flex-col items-center cursor-pointer" 
            onClick={() => setActiveTab('mission')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              className={activeTab === 'mission' ? "text-red-500" : "text-gray-600"}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className={`text-xs font-mono ${activeTab === 'mission' ? "text-red-500" : "text-gray-600"}`}>MISSIONS</span>
          </div>

          {/* Profile/Settings Tab */}
          <div 
            className="flex flex-col items-center cursor-pointer" 
            onClick={() => setActiveTab('profile')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
              className={activeTab === 'profile' ? "text-red-500" : "text-gray-600"}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className={`text-xs font-mono ${activeTab === 'profile' ? "text-red-500" : "text-gray-600"}`}>AGENT</span>
          </div>
        </div>
      </div>

      {/* Lesson Flow Modal would go here */}
      {/*
      When implementing lesson flow:
      1. Uncomment the state at the top
      2. Add onStartMission prop to HQScreen
      3. Uncomment this section:

      {showLessonFlow && (
        <div className="fixed inset-0 z-50">
          <LessonFlowDemo onClose={() => setShowLessonFlow(false)} />
        </div>
      )}
      */}
    </main>
  );
}
