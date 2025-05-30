import React, { useState } from 'react';
import { Globe, Headphones, Book, Flame, Star, Award, Play, ChevronRight, Check, User, Settings, Bell, Calendar, Gift, Lock, Home, TrendingUp, Tv, Compass, List, ArrowLeft, Mic, BookOpen, FileText, PenTool, Volume2, AlignJustify, Plus, X } from 'lucide-react';

const ComprehensiveAppWireframe = () => {
  const [activeTab, setActiveTab] = useState('stories');
  const [selectedShow, setSelectedShow] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('main'); // main, lesson, wordList, mistakes, etc.
  
  // Render different content based on active tab, selection, and current screen
  const renderContent = () => {
    if (currentScreen === 'lesson') {
      return <LessonScreen goBack={() => setCurrentScreen('main')} />;
    }
    
    if (currentScreen === 'wordList') {
      return <WordListScreen goBack={() => setCurrentScreen('main')} />;
    }
    
    if (currentScreen === 'mistakes') {
      return <MistakesScreen goBack={() => setCurrentScreen('main')} />;
    }
    
    if (currentScreen === 'dailyChallenges') {
      return <DailyChallengesScreen goBack={() => setCurrentScreen('main')} />;
    }
    
    if (activeTab === 'stories' && !selectedShow) {
      return <StoriesTab setSelectedShow={setSelectedShow} setCurrentScreen={setCurrentScreen} />;
    } else if (activeTab === 'stories' && selectedShow) {
      return <ShowEpisodesTab show={selectedShow} setSelectedShow={setSelectedShow} setCurrentScreen={setCurrentScreen} />;
    } else if (activeTab === 'practice') {
      return <PracticeTab setCurrentScreen={setCurrentScreen} />;
    } else if (activeTab === 'progress') {
      return <ProgressTab />;
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Top Bar */}
      <div className="bg-gray-800 px-4 py-3 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          {/* Flag only (no text) */}
          <div className="flex items-center">
            <div className="w-8 h-6 rounded overflow-hidden">
              <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
              </div>
            </div>
          </div>
          
          {/* Center Stats */}
          <div className="flex items-center space-x-4">
            {/* Streak */}
            <div className="flex items-center">
              <div className="bg-orange-600 p-1 rounded-full mr-1">
                <Flame size={16} className="text-orange-100" />
              </div>
              <span className="text-sm font-bold">5</span>
            </div>
            
            {/* Daily Goal */}
            <div className="flex items-center">
              <div className="w-24 bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            {/* XP */}
            <div className="flex items-center">
              <Star size={16} className="text-yellow-400 mr-1" />
              <span className="text-sm font-bold">247</span>
            </div>
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            <button>
              <Bell size={18} className="text-gray-400" />
            </button>
            <button className="bg-indigo-700 w-8 h-8 rounded-full flex items-center justify-center">
              <User size={16} />
            </button>
          </div>
        </div>
        
        {/* Curriculum Progress & Level */}
        <div className="flex flex-col">
          {/* Curriculum Progress */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Curriculum Progress</span>
            <span className="text-xs text-gray-400">12%</span>
          </div>
          <div className="w-full bg-gray-700 h-1.5 rounded-full mb-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '12%' }}></div>
          </div>
          
          {/* Language Level */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className="bg-green-700 px-2 py-0.5 rounded text-xs">
                Beginner
              </div>
              <span className="text-xs text-gray-400 ml-2">Level 3</span>
            </div>
            
            {/* Level Dots */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">A0</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">A1</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">A2</span>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-500">B1</span>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <span className="text-xs text-gray-500">B2</span>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <span className="text-xs text-gray-500">C1</span>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <span className="text-xs text-gray-500">C2</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
      
      {/* Current Scene (Bottom Bar) */}
      <div className="relative">
        {/* Top lip indicator */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-t"></div>
        
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 flex items-center justify-between border-t border-blue-800">
          <div>
            <p className="text-xs text-blue-300">NOW PLAYING</p>
            <p className="font-bold">Pirate Adventure: Confronting Alvida</p>
            <div className="flex items-center mt-1">
              <div className="w-32 bg-blue-800 h-1.5 rounded-full">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
              <span className="text-xs text-blue-300 ml-2">35%</span>
            </div>
          </div>
          
          <button 
            className="bg-blue-600 rounded-lg px-4 py-2 flex items-center"
            onClick={() => setCurrentScreen('lesson')}
          >
            <Play size={16} className="mr-2" />
            Continue
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-around bg-gray-800 py-3 border-t border-gray-700">
        <button 
          className={`flex flex-col items-center ${activeTab === 'stories' ? 'text-blue-400' : 'text-gray-400'}`}
          onClick={() => {
            setActiveTab('stories');
            setSelectedShow(null);
            setCurrentScreen('main');
          }}
        >
          <Tv size={18} />
          <span className="text-xs mt-1">Stories</span>
        </button>
        <button 
          className={`flex flex-col items-center ${activeTab === 'practice' ? 'text-blue-400' : 'text-gray-400'}`}
          onClick={() => {
            setActiveTab('practice');
            setCurrentScreen('main');
          }}
        >
          <Book size={18} />
          <span className="text-xs mt-1">Practice</span>
        </button>
        <button 
          className={`flex flex-col items-center ${activeTab === 'progress' ? 'text-blue-400' : 'text-gray-400'}`}
          onClick={() => {
            setActiveTab('progress');
            setCurrentScreen('main');
          }}
        >
          <TrendingUp size={18} />
          <span className="text-xs mt-1">Progress</span>
        </button>
      </div>
    </div>
  );
};

// Stories Tab (Shows Netflix-style narrative selection)
const StoriesTab = ({ setSelectedShow, setCurrentScreen }) => {
  return (
    <div className="p-4">
      {/* Narratives Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Pirate Adventure */}
        <div 
          className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setSelectedShow('pirate')}
        >
          <div className="h-32 relative">
            <div className="absolute bottom-0 right-4 h-28 w-20 bg-blue-600 rounded-t-lg opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <div className="bg-blue-500 h-full" style={{ width: '35%' }}></div>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold">Pirate Adventure</h3>
              <div className="text-xs bg-blue-700 px-1.5 py-0.5 rounded">35%</div>
            </div>
            <p className="text-xs text-gray-300">Learn through epic sea adventures</p>
          </div>
        </div>
        
        {/* Dating Adventure */}
        <div 
          className="bg-gradient-to-br from-rose-900 to-pink-800 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => setSelectedShow('dating')}
        >
          <div className="h-32 relative">
            <div className="absolute bottom-0 right-4 h-28 w-20 bg-rose-600 rounded-t-lg opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <div className="bg-rose-500 h-full" style={{ width: '10%' }}></div>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold">Dating Adventure</h3>
              <div className="text-xs bg-rose-700 px-1.5 py-0.5 rounded">10%</div>
            </div>
            <p className="text-xs text-gray-300">Master romantic conversations</p>
          </div>
        </div>
        
        {/* Business Japanese */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl overflow-hidden relative">
          <div className="h-32 relative">
            <div className="absolute bottom-0 right-4 h-28 w-20 bg-gray-600 rounded-t-lg opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            {/* Locked overlay */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
              <div className="bg-gray-800 p-2 rounded-full">
                <Lock size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-bold mb-1">Business Japanese</h3>
            <p className="text-xs text-gray-400">Office and professional contexts</p>
          </div>
        </div>
        
        {/* Travel Adventure */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl overflow-hidden relative">
          <div className="h-32 relative">
            <div className="absolute bottom-0 right-4 h-28 w-20 bg-gray-600 rounded-t-lg opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            {/* Locked overlay */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
              <div className="bg-gray-800 p-2 rounded-full">
                <Lock size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-bold mb-1">Travel Adventure</h3>
            <p className="text-xs text-gray-400">Navigate cities and tourist spots</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Show Episodes Tab (Episodes for a specific narrative)
const ShowEpisodesTab = ({ show, setSelectedShow, setCurrentScreen }) => {
  const showTitle = show === 'pirate' ? 'Pirate Adventure' : 'Dating Adventure';
  const primaryColor = show === 'pirate' ? 'blue' : 'rose';
  
  return (
    <div className="p-4">
      {/* Back button and title */}
      <div className="flex items-center mb-4">
        <button 
          className="mr-2 p-1 bg-gray-800 rounded-full"
          onClick={() => setSelectedShow(null)}
        >
          <ChevronRight size={20} className="transform rotate-180" />
        </button>
        <h2 className="text-xl font-bold">{showTitle}</h2>
      </div>
      
      {/* Episodes List */}
      <div className="space-y-4">
        {/* Episode 1 */}
        <div className={`bg-${primaryColor}-900 bg-opacity-20 border border-${primaryColor}-800 rounded-xl overflow-hidden`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Episode 1: First Encounters</h3>
              <div className={`bg-${primaryColor}-700 px-2 py-1 rounded text-xs`}>
                35% Complete
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">Learn basic introductions and first interactions</p>
            
            {/* Language concepts */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Introductions
              </div>
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Basic Questions
              </div>
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Describing People
              </div>
            </div>
            
            {/* Scenes progress */}
            <div className="grid grid-cols-5 gap-1 mt-3">
              <div className={`h-1 bg-${primaryColor}-500 rounded-full`}></div>
              <div className={`h-1 bg-${primaryColor}-500 rounded-full`}></div>
              <div className={`h-1 bg-${primaryColor}-500 rounded-full opacity-40`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
            </div>
          </div>
          
          {/* Scene list */}
          <div className="border-t border-gray-700">
            <div className="p-3 flex items-center justify-between bg-gray-800 bg-opacity-30">
              <span className="text-sm">View 5 Scenes</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
        
        {/* Episode 2 */}
        <div className={`bg-${primaryColor}-900 bg-opacity-10 border border-${primaryColor}-800 border-opacity-50 rounded-xl overflow-hidden`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Episode 2: Growing Bonds</h3>
              <div className={`bg-${primaryColor}-700 bg-opacity-50 px-2 py-1 rounded text-xs`}>
                0% Complete
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">Deepen connections through shared experiences</p>
            
            {/* Language concepts */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Past Tense
              </div>
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Expressing Opinions
              </div>
              <div className="bg-gray-800 px-2 py-1 rounded-full text-xs">
                Agreements
              </div>
            </div>
            
            {/* Scenes progress */}
            <div className="grid grid-cols-5 gap-1 mt-3">
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
              <div className={`h-1 bg-gray-700 rounded-full`}></div>
            </div>
          </div>
          
          {/* Scene list */}
          <div className="border-t border-gray-700">
            <div className="p-3 flex items-center justify-between bg-gray-800 bg-opacity-30">
              <span className="text-sm">View 5 Scenes</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
        
        {/* Episode 3 - Locked */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden opacity-70">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Episode 3: Overcoming Challenges</h3>
              <div className="bg-gray-700 px-2 py-1 rounded text-xs">
                Locked
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-3">Face obstacles and learn to express determination</p>
            
            {/* Language concepts */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                Expressing Goals
              </div>
              <div className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                Determination
              </div>
              <div className="bg-gray-700 px-2 py-1 rounded-full text-xs">
                Problem Solving
              </div>
            </div>
            
            {/* Locked message */}
            <div className="flex items-center justify-center bg-gray-800 py-2 rounded-lg mt-3">
              <Lock size={14} className="mr-2 text-gray-500" />
              <span className="text-xs text-gray-500">Complete Episode 1 to unlock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Practice Tab - Redesigned
const PracticeTab = ({ setCurrentScreen }) => {
  return (
    <div className="p-4">
      {/* Daily Challenges - Moved to top */}
      <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold">Daily Challenge</h3>
            <p className="text-xs text-gray-300">Practice 20 words you've learned</p>
          </div>
          <div className="bg-purple-800 px-2 py-1 rounded text-xs">
            +30 XP
          </div>
        </div>
        <div className="flex items-center mb-3">
          <div className="flex-1 bg-gray-800 h-2 rounded-full mr-2">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
          </div>
          <span className="text-xs">8/20</span>
        </div>
        <button 
          className="w-full bg-purple-700 py-2 rounded-lg text-sm"
          onClick={() => setCurrentScreen('dailyChallenges')}
        >
          Continue Challenge
        </button>
      </div>
      
      {/* Practice Categories */}
      <h3 className="text-md font-semibold mb-3">Practice Areas</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Vocabulary Practice */}
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-800 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center mb-2">
            <Book size={20} className="text-indigo-300" />
          </div>
          <h3 className="font-bold mb-1">Vocabulary</h3>
          <p className="text-xs text-gray-300 mb-3">Master words from all your stories</p>
          <button className="w-full bg-indigo-700 py-2 rounded-lg text-sm">
            Start Practice
          </button>
        </div>
        
        {/* Grammar Practice */}
        <div className="bg-green-900 bg-opacity-30 border border-green-800 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center mb-2">
            <AlignJustify size={20} className="text-green-300" />
          </div>
          <h3 className="font-bold mb-1">Grammar</h3>
          <p className="text-xs text-gray-300 mb-3">Refine your language structure</p>
          <button className="w-full bg-green-700 py-2 rounded-lg text-sm">
            Start Practice
          </button>
        </div>
      </div>
      
      {/* Conversation Practice */}
      <h3 className="text-md font-semibold mb-3">Conversation Skills</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Speaking Practice */}
        <div className="bg-orange-900 bg-opacity-30 border border-orange-800 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-orange-800 flex items-center justify-center mb-2">
            <Mic size={20} className="text-orange-300" />
          </div>
          <h3 className="font-bold mb-1">Speaking</h3>
          <p className="text-xs text-gray-300 mb-3">Improve your pronunciation</p>
          <button className="w-full bg-orange-700 py-2 rounded-lg text-sm">
            Start Practice
          </button>
        </div>
        
        {/* Listening Practice */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-800 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mb-2">
            <Volume2 size={20} className="text-blue-300" />
          </div>
          <h3 className="font-bold mb-1">Listening</h3>
          <p className="text-xs text-gray-300 mb-3">Train your ear comprehension</p>
          <button className="w-full bg-blue-700 py-2 rounded-lg text-sm">
            Start Practice
          </button>
        </div>
        
        {/* Reading Practice */}
        <div className="bg-teal-900 bg-opacity-30 border border-teal-800 rounded-xl p-4">
          <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center mb-2">
            <BookOpen size={20} className="text-teal-300" />
          </div>
          <h3 className="font-bold mb-1">Reading</h3>
          <p className="text-xs text-gray-300 mb-3">Develop text comprehension</p>
          <button className="w-full bg-teal-700 py-2 rounded-lg text-sm">
            Start Practice
          </button>
        </div>
        
        {/* Writing Practice - Grayed Out */}
        <div className="bg-gray-800 bg-opacity-30 border border-gray-700 rounded-xl p-4 opacity-60">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mb-2">
            <PenTool size={20} className="text-gray-400" />
          </div>
          <h3 className="font-bold mb-1">Writing</h3>
          <p className="text-xs text-gray-400 mb-3">Master written expression</p>
          <div className="w-full bg-gray-700 py-2 rounded-lg text-sm text-center">
            Coming Soon
          </div>
        </div>
      </div>
      
      {/* Collections */}
      <h3 className="text-md font-semibold mb-3">Collections</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Word Collection */}
        <div 
          className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-xl p-4 cursor-pointer"
          onClick={() => setCurrentScreen('wordList')}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Words</h3>
            <span className="text-xs bg-yellow-800 px-2 py-0.5 rounded">72</span>
          </div>
          <p className="text-xs text-gray-300">All vocabulary you've learned</p>
        </div>
        
        {/* Mistakes Collection */}
        <div 
          className="bg-red-900 bg-opacity-20 border border-red-800 rounded-xl p-4 cursor-pointer"
          onClick={() => setCurrentScreen('mistakes')}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Mistakes</h3>
            <span className="text-xs bg-red-800 px-2 py-0.5 rounded">14</span>
          </div>
          <p className="text-xs text-gray-300">Review your frequent errors</p>
        </div>
      </div>
    </div>
  );
};

// Progress Tab
const ProgressTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>
      
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 bg-indigo-900 bg-opacity-30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-300">Streak</p>
            <p className="text-xl font-bold text-orange-400">5</p>
            <p className="text-xs text-gray-300">days</p>
          </div>
          <div className="flex-1 bg-indigo-900 bg-opacity-30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-300">XP</p>
            <p className="text-xl font-bold text-yellow-400">247</p>
            <p className="text-xs text-gray-300">points</p>
          </div>
          <div className="flex-1 bg-indigo-900 bg-opacity-30 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-300">Words</p>
            <p className="text-xl font-bold text-green-400">72</p>
            <p className="text-xs text-gray-300">learned</p>
          </div>
        </div>
        
        <h3 className="text-md font-semibold mb-2">Weekly Activity</h3>
        <div className="flex items-end justify-between h-24 mb-1">
          <div className="w-8 bg-blue-800 rounded-t" style={{ height: '40%' }}></div>
          <div className="w-8 bg-blue-800 rounded-t" style={{ height: '20%' }}></div>
          <div className="w-8 bg-blue-800 rounded-t" style={{ height: '70%' }}></div>
          <div className="w-8 bg-blue-800 rounded-t" style={{ height: '50%' }}></div>
          <div className="w-8 bg-blue-800 rounded-t" style={{ height: '35%' }}></div>
          <div className="w-8 bg-blue-600 rounded-t" style={{ height: '65%' }}></div>
          <div className="w-8 bg-gray-700 rounded-t" style={{ height: '10%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>
      </div>
      
      <h3 className="text-md font-semibold mb-3">Recent Achievements</h3>
      <div className="space-y-3">
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-800 flex items-center justify-center mr-3">
            <Flame size={20} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">5-Day Streak</p>
            <p className="text-xs text-gray-400">Keep learning every day!</p>
          </div>
          <div className="bg-yellow-800 bg-opacity-30 px-2 py-1 rounded text-xs text-yellow-400">
            +15 XP
          </div>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center mr-3">
            <Award size={20} className="text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Scene Master</p>
            <p className="text-xs text-gray-400">Completed "Meeting Koby" with perfect score</p>
          </div>
          <div className="bg-green-800 bg-opacity-30 px-2 py-1 rounded text-xs text-green-400">
            +25 XP
          </div>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-lg flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center mr-3">
            <Book size={20} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Vocabulary Builder</p>
            <p className="text-xs text-gray-400">Learned 50 words</p>
          </div>
          <div className="bg-blue-800 bg-opacity-30 px-2 py-1 rounded text-xs text-blue-400">
            +20 XP
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson Screen
const LessonScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Lesson Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={goBack}>
          <X size={20} className="text-gray-400" />
        </button>
        <div className="flex items-center">
          <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: '40%' }}></div>
          </div>
          <span className="text-xs ml-2">2/5</span>
        </div>
        <div className="flex items-center">
          <Star size={16} className="text-yellow-400 mr-1" />
          <span className="text-sm">25</span>
        </div>
      </div>
      
      {/* Lesson Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 mb-4">
          <h3 className="text-xl font-bold mb-4 text-center">Vocabulary</h3>
          
          <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-2xl font-bold text-center mb-2">海賊</p>
            <p className="text-sm text-center text-gray-300 mb-1">kaizoku</p>
            <p className="text-lg text-center">pirate</p>
          </div>
          
          <div className="flex justify-between">
            <button className="bg-gray-700 px-4 py-2 rounded-lg">
              <Volume2 size={20} />
            </button>
            <button className="bg-blue-600 px-6 py-2 rounded-lg font-medium">
              Continue
            </button>
          </div>
        </div>
        
        <div className="w-full max-w-md">
          <p className="text-sm text-gray-400 text-center">
            This word appears in the "Confronting Alvida" scene when Luffy declares his dream to become the Pirate King.
          </p>
        </div>
      </div>
    </div>
  );
};

// Word List Screen
const WordListScreen = ({ goBack }) => {
  const [sortBy, setSortBy] = useState('recent');
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center">
        <button onClick={goBack} className="mr-3">
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <h2 className="text-lg font-bold">My Words</h2>
        <div className="ml-auto">
          <select 
            className="bg-gray-700 text-sm rounded px-2 py-1 border-none outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Recently Learned</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </div>
      
      {/* Word List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {/* Word Item */}
            <div className="p-4 border-l-4 border-green-500 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">海賊</p>
                  <p className="text-xs text-gray-400">kaizoku</p>
                </div>
                <p className="text-sm">pirate</p>
              </div>
              <button className="bg-gray-700 p-2 rounded">
                <Volume2 size={16} className="text-gray-300" />
              </button>
            </div>
            
            {/* Word Item */}
            <div className="p-4 border-l-4 border-green-500 border-t border-gray-700 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">王</p>
                  <p className="text-xs text-gray-400">ō</p>
                </div>
                <p className="text-sm">king</p>
              </div>
              <button className="bg-gray-700 p-2 rounded">
                <Volume2 size={16} className="text-gray-300" />
              </button>
            </div>
            
            {/* Word Item */}
            <div className="p-4 border-l-4 border-yellow-500 border-t border-gray-700 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">美しい</p>
                  <p className="text-xs text-gray-400">utsukushii</p>
                </div>
                <p className="text-sm">beautiful</p>
              </div>
              <button className="bg-gray-700 p-2 rounded">
                <Volume2 size={16} className="text-gray-300" />
              </button>
            </div>
            
            {/* Word Item */}
            <div className="p-4 border-l-4 border-green-500 border-t border-gray-700 flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">夢</p>
                  <p className="text-xs text-gray-400">yume</p>
                </div>
                <p className="text-sm">dream</p>
              </div>
              <button className="bg-gray-700 p-2 rounded">
                <Volume2 size={16} className="text-gray-300" />
              </button>
            </div>
            
            {/* More word items would follow */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mistakes Screen
const MistakesScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center">
        <button onClick={goBack} className="mr-3">
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <h2 className="text-lg font-bold">My Mistakes</h2>
      </div>
      
      {/* Mistakes List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="bg-gray-800 rounded-xl overflow-hidden mb-4">
            <div className="bg-red-900 bg-opacity-20 p-3">
              <p className="text-sm">You often confused these similar words:</p>
            </div>
            
            {/* Mistake Group */}
            <div className="p-4 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="flex items-center mb-1">
                    <p className="font-medium mr-2">聞く</p>
                    <p className="text-xs text-gray-400">kiku</p>
                  </div>
                  <p className="text-sm">to hear/listen</p>
                </div>
                <button className="bg-gray-700 p-2 rounded">
                  <Volume2 size={16} className="text-gray-300" />
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <p className="font-medium mr-2">聞く</p>
                    <p className="text-xs text-gray-400">kiku</p>
                  </div>
                  <p className="text-sm">to ask</p>
                </div>
                <button className="bg-gray-700 p-2 rounded">
                  <Volume2 size={16} className="text-gray-300" />
                </button>
              </div>
              
              <button className="bg-red-800 bg-opacity-50 px-3 py-2 rounded-lg text-sm mt-3">
                Practice These Words
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="bg-red-900 bg-opacity-20 p-3">
              <p className="text-sm">Pronunciation challenges:</p>
            </div>
            
            {/* Pronunciation Mistake */}
            <div className="p-4 border-t border-gray-700 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">約束</p>
                  <p className="text-xs text-gray-400">yakusoku</p>
                </div>
                <p className="text-sm">promise</p>
              </div>
              <button className="bg-red-800 bg-opacity-50 px-3 py-1 rounded text-sm">
                Practice
              </button>
            </div>
            
            {/* Pronunciation Mistake */}
            <div className="p-4 border-t border-gray-700 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <p className="font-medium mr-2">綺麗</p>
                  <p className="text-xs text-gray-400">kirei</p>
                </div>
                <p className="text-sm">beautiful/clean</p>
              </div>
              <button className="bg-red-800 bg-opacity-50 px-3 py-1 rounded text-sm">
                Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Daily Challenges Screen
const DailyChallengesScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={goBack}>
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <h2 className="text-lg font-bold">Daily Challenge</h2>
        <div className="flex items-center">
          <Star size={16} className="text-yellow-400 mr-1" />
          <span className="text-sm">+30 XP</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs text-gray-400">8/20 words</span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
          <div className="bg-purple-500 h-full" style={{ width: '40%' }}></div>
        </div>
      </div>
      
      {/* Challenge Content */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 mb-4">
          <h3 className="text-center text-sm text-gray-400 mb-4">Choose the correct meaning</h3>
          
          <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-lg p-4 mb-6">
            <p className="text-2xl font-bold text-center mb-2">海賊王</p>
            <p className="text-sm text-center text-gray-300">kaizoku-ō</p>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
              pirate ship
            </button>
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
              sea monster
            </button>
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
              pirate king
            </button>
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
              treasure map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAppWireframe;