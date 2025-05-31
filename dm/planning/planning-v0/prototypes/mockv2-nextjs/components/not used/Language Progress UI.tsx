import React, { useState } from 'react';
import { X, Flag, Check, ChevronRight } from 'lucide-react';

const LanguageLearningProgressUI = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Progress data
  const currentLevel = 1;
  const progress = 4;
  const totalPoints = 100;
  const language = "Russian";
  const milestones = [
    { words: 25, reward: "Basic Phrases Badge" },
    { words: 50, reward: "Conversation Starter" },
    { words: 75, reward: "Grammar Expert" },
    { words: 100, reward: "Level Complete!" }
  ];
  
  // Level structure data
  const levels = [
    {
      name: "Absolute Beginner",
      units: [1, 2, 3, 4, 5],
      description: "Set the groundwork with basic vocabulary and phrases to start your language learning journey.",
      current: true
    },
    {
      name: "Beginner",
      units: [6, 7, 8, 9, 10],
      description: "Acquire essential language elements like vocabulary, key phrases, and basic communication skills for comprehension and expression."
    },
    {
      name: "Elementary",
      units: [11, 12, 13, 14, 15],
      description: "Progress towards fluid interactions by refining vocabulary and improving speaking/listening skills for effective communication."
    },
    {
      name: "Intermediate",
      units: [16, 17, 18, 19, 20],
      description: "Reach a level of competence where language use feels effortless, allowing confident communication across different situations."
    },
    {
      name: "Advanced Intermediate",
      units: [21, 22, 23, 24, 25],
      description: "Develop an advanced level of language proficiency, demonstrating deep understanding and fluency in complex language tasks."
    },
    {
      name: "Advanced",
      units: [26, 27, 28, 29, 30],
      description: "Achieve near-native proficiency, nuanced understanding, and effortless communication, with exceptional accuracy and sophistication."
    },
    {
      name: "Mastery",
      units: [31, 32, 33, 34, 35],
      description: "The language journey has no end! Continue to refine your skills to become a linguistic maestro."
    }
  ];

  // Toggle modal function
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  // Calculate progress percentage
  const progressPercentage = (progress / totalPoints) * 100;
  
  // Function to show milestone tooltips
  const renderMilestoneTooltip = (index) => {
    return (
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 p-2 rounded shadow-lg text-xs w-32 z-20 text-center">
        <div className="font-bold mb-1">{milestones[index].reward}</div>
        <div>{milestones[index].words} words</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
      </div>
    );
  };

  return (
    <div className="font-sans text-white h-screen bg-gray-800 p-4 relative">
      {/* Progress bar header */}
      <div 
        onClick={toggleModal}
        className="bg-gray-700 p-4 rounded-lg shadow-lg cursor-pointer transition-all hover:bg-gray-600 relative"
      >
        <div className="flex items-center mb-2">
          <div className="bg-gray-600 p-1 rounded">
            <Flag size={16} className="text-gray-300" />
          </div>
          <span className="ml-2 text-gray-300">Absolute Beginner</span>
          <ChevronRight size={16} className="ml-1 text-gray-400" />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{language} - Level <span className="inline-flex items-center justify-center bg-yellow-500 text-gray-900 w-8 h-8 rounded-full">{currentLevel}</span></h2>
        </div>
        
        {/* Progress bar with 4-point design system */}
        <div className="relative h-4 bg-gray-600 rounded-full overflow-hidden w-full mb-2">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
          
          {/* 4-point markers with numbers */}
          {[25, 50, 75, 100].map((point, index) => (
            <div 
              key={index}
              className="absolute top-1/2 transform -translate-y-1/2 z-10"
              style={{ 
                left: point === 100 ? 'calc(100% - 24px)' : `${point}%`, 
                marginLeft: point === 100 ? '' : '-12px' 
              }}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progressPercentage >= point ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'
              } text-xs font-bold shadow-md`}>
                {point}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-300">
          Get in your practice for today!
        </div>
      </div>
      
      {/* Full-page modal */}
      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 z-10 transition-all animate-slide-up overflow-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">My Journey</h1>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img src="/api/placeholder/30/30" alt="Russian flag" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="text-gray-300 mb-6">
              <p>Started learning 16 Dec 2024</p>
              <p>Track your progress with levels and stages—earn points for every word, video, and chat and continue to level up!</p>
            </div>
            
            {/* Level progression cards */}
            <div className="space-y-4">
              {levels.map((level, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-600 p-1 rounded">
                      <Flag size={16} className="text-gray-300" />
                    </div>
                    <span className="ml-2 font-bold">{level.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between w-full mb-3">
                    {level.units.map((unit, unitIndex) => (
                      <React.Fragment key={unitIndex}>
                        <div 
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold
                            ${level.current && unit === currentLevel ? 'bg-yellow-500 text-gray-900' : 
                              (level.current && unit < currentLevel ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400')}
                          `}
                        >
                          {level.current && unit < currentLevel ? <Check size={16} /> : unit}
                        </div>
                        
                        {/* Add small dot between circles (except after the last one) */}
                        {unitIndex < level.units.length - 1 && (
                          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-300">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageLearningProgressUI;