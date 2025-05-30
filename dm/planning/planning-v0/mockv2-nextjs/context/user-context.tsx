'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress, initialUserProgress } from '../data/lesson-data';

// Define what our context will contain
type UserContextType = {
  userProgress: UserProgress;
  updateProgress: (newProgress: Partial<UserProgress>) => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  isLoggedIn: boolean;
  login: (agentCode: string) => void;
  logout: () => void;
};

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export function UserProvider({ children }: { children: ReactNode }) {
  // Initialize with default values, then update in useEffect to avoid hydration mismatch
  const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user data from localStorage only on client
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      
      const loggedInState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedInState);
      
      // Mark as initialized after first load
      setIsInitialized(true);
    }
  }, []);

  // Save progress to localStorage whenever it changes after initialized
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }
  }, [userProgress, isInitialized]);

  // Save login state to localStorage whenever it changes after initialized
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    }
  }, [isLoggedIn, isInitialized]);

  // Function to update user progress
  const updateProgress = (newProgress: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...newProgress,
      lastActive: new Date().toISOString(),
    }));
  };

  // Function to mark a lesson as completed
  const completeLesson = (lessonId: string, xpEarned: number) => {
    setUserProgress(prev => {
      // Only add the lesson if it's not already in the completed list
      const lessonsCompleted = prev.lessonsCompleted.includes(lessonId)
        ? prev.lessonsCompleted
        : [...prev.lessonsCompleted, lessonId];
      
      return {
        ...prev,
        lessonsCompleted,
        totalXP: prev.totalXP + xpEarned,
        dailyXP: prev.dailyXP + xpEarned,
        lastActive: new Date().toISOString(),
      };
    });
  };

  // Login function
  const login = (agentCode: string) => {
    setIsLoggedIn(true);
    setUserProgress(prev => ({
      ...prev,
      agentCodename: agentCode || 'DARK MALLARD',
      lastActive: new Date().toISOString(),
    }));
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
  };

  // Provide the context value
  const value = {
    userProgress,
    updateProgress,
    completeLesson,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 